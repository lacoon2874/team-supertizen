from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import numpy as np
from .models import User, Weather, Schedule, PastOutfit, Style, Texture, Clothing, ClothingStyle, ClothingTexture, UserClothing
import os
import cv2
from datetime import datetime
from sklearn.neighbors import KNeighborsClassifier
import json
import tensorflow
from tensorflow.keras.layers import Dense
from tensorflow.keras.callbacks import ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.models import Sequential
from tensorflow.keras.utils import to_categorical
import shutil
from skimage.metrics import structural_similarity as ssim
import requests
from .serializers import ClothingSerializer
import copy
from datetime import timedelta
from urllib.parse import unquote
import pytz

tz = pytz.timezone('UTC')

# 이미지 비교 벡터 가중치
weight = 5

model_dir = 'current'
path = os.path.dirname(os.path.abspath(__file__))


schedule_list = ['면접', '졸업식', '데이트', '업무', '여행', '운동', 
                 '휴식', '결혼식', '소개팅', '경조사', '일상', '기타', '없음']

schedule_dict = {
    '면접' : 'Interview', 
    '졸업식' : 'Graduate', 
    '데이트' : 'Date', 
    '업무' : 'Business', 
    '여행' : 'Trip', 
    '운동' : 'Workout', 
    '휴식' : 'Rest', 
    '결혼식' : 'Wedding', 
    '소개팅' : 'Meeting', 
    '경조사' : 'Event', 
    '일상' : 'Daily', 
    '기타' : 'ETC',
    '없음' : 'Nothing'
}

gender_list = ['남자', '여자']

gender_dict = {
    '남자' : 'male',
    '여자' : 'female'
}

clothes_type = []



@api_view(['GET'])
def mlp(request, rate, formattedDate, locateInfo, schedule, count):
    print('ddd')
    global clothes_type
    clothes_type = Clothing.objects.values_list('category', flat=True).distinct()
    if request.method == 'GET':
        rate = int(rate)
        pre_schedule_date = formattedDate
        try:
            schedule_date = datetime.strptime(pre_schedule_date, '%Y-%m-%d').date()
        except ValueError:
            return Response({'data':[[]]})
        # schedule_date = datetime.strptime(pre_schedule_date, '%Y-%m-%d').date()
        recommend_count = count
        user = get_object_or_404(User, user_id=request.META['HTTP_USERID'])
        user_age = user.age // 10
        user_gender = user.gender
        locate = int(locateInfo)
        schedule = unquote(schedule)
        print(locate)
        print(schedule_date),
        print(rate)
        print(schedule_date)
        print(schedule)

        # 1차 유저 옷 필터링
        user_clothes = Clothing.objects.filter(userclothing__user__user_id=request.META['HTTP_USERID'])
        now = datetime.now().date()
        days_difference = (schedule_date - now).days
        
        # 가용가능 필터링
        if days_difference < 3:
            user_clothes = user_clothes.filter(worn_count__lte=3)
            
        schedule_weather = Weather.objects.filter(location_key=locate, date=pre_schedule_date)
        if not len(schedule_weather):
            return Response({'data':[[]]})
        schedule_weather = schedule_weather[0]
        
        schedule_vector = np.zeros(10)
        print('abcd')
        
        # 전처리
        if schedule_weather:
            # 0: 나이, 1: 최저기온, 2: 최고기온, 3: 최저체감온도, 4: 최고체감온도,
            # 5: 강수량, 6: 적설량, 7: 습도, 8: 풍속, 9: 일조량
            schedule_vector[0] = user_age
            schedule_vector[1] = schedule_weather.lowest_temperature
            schedule_vector[2] = schedule_weather.highest_temperature
            schedule_vector[3] = schedule_weather.lowest_real_feeling_temperature
            schedule_vector[4] = schedule_weather.highest_real_feeling_temperature
            schedule_vector[5] = schedule_weather.precipitation
            schedule_vector[6] = schedule_weather.snow_cover
            schedule_vector[7] = schedule_weather.humidity
            schedule_vector[8] = schedule_weather.wind_speed
            schedule_vector[9] = schedule_weather.solar_irradiance
        
        input_data = np.expand_dims(np.array(schedule_vector, dtype=np.float32), axis=0) 
        print('asdfasfd')         
        # 학습된 모델이 없을 경우
        if not (os.path.exists(f'{path}/ML_models/{model_dir}/{gender_dict[user_gender]}_{schedule_dict[schedule]}.h5')):
            return Response({'data':[[]]})
        
        model = tensorflow.keras.models.load_model(f'{path}/ML_models/{model_dir}/{gender_dict[user_gender]}_{schedule_dict[schedule]}.h5')
    
        with open(f'{path}/ML_models/current/label.json', 'r', encoding='utf-8') as file:
            label_infos = json.load(file)

        result_list = label_infos[f'{gender_dict[user_gender]}_{schedule_dict[schedule]}']['label_list']
        
        # 1차 결과
        y_pred = model.predict(input_data).squeeze()
        i_pred = np.argsort(y_pred)[::-1]
        
        # 만약 재요청이 인덱스를 넘어가버리면
        if len(i_pred.tolist()) < rate + 1:
            return Response({'data':[[]]})
        
        # 1차 결과, 스케쥴 id를 가져옴
        result = result_list[i_pred.tolist()[rate]]
        
        
        # 비교를 위해 유저 옷 전부 불러와 벡터화(이미지 유사도 제외)
        
        # 유저 옷 저장공간(카테고리로 filter)
        user_category_clothes = {}
        # 유저 옷 벡터 저장공간
        user_clothes_vectors = {}
        
        for clothes_t in clothes_type:
            user_category_clothes[clothes_t] = user_clothes.filter(category=clothes_t)
            user_clothes_vectors[clothes_t] = []

        
        # 스타일 벡터화를 위한 리스트
        style_idx_list = list(Style.objects.values_list('style_id', flat=True))
        # 소재 벡터화를 위한 리스트
        texture_idx_list = list(Texture.objects.values_list('texture_id', flat=True))
        
        style_count = len(style_idx_list)
        texture_count = len(texture_idx_list)
        
        for category, category_clothes in user_category_clothes.items():
            
            input_list = user_clothes_vectors[category]
                
            for clothes in category_clothes:
                
                clothes_label = np.array([clothes.clothing_id])
                
                # idx가 1부터 시작하므로 index에러 방지
                style_vector = np.zeros(style_count + 1)
                texture_vector = np.zeros(texture_count + 1)
                
                # for문에 걸친 옷의 개별 스타일, 재질
                clothes_styles = ClothingStyle.objects.filter(clothing=clothes).values_list('style_id', flat=True)
                clothes_textures = ClothingTexture.objects.filter(clothing_detail=clothes.clothing_detail).values_list('texture_id', flat=True)
                
                for clothes_style in clothes_styles:
                    style_vector[clothes_style] = 1
                    
                for clothes_texture in clothes_textures:
                    texture_vector[clothes_texture] = 1
                
                # 추후 label을 통해 이미지를 가져와서 비교, 비교 시 제거되야함
                init_clothes_vector =  np.concatenate((clothes_label, style_vector, texture_vector))
                input_list.append(init_clothes_vector)


        # 응답 폼
        # response_form = {
        #     'recommand_outfit' : {
        #         '상의' : [],
        #         '바지' : [],
        #         '하의' : [],
        #         '스커트' : [],
        #         '아우터' : [],
        #         '원피스' : [],
        #         '외투' : [],
        #         '기타' : []
        #     },
        #     '상의' : [],
        #     '바지' : [],
        #     '하의' : [],
        #     '스커트' : [],
        #     '아우터' : [],
        #     '원피스' : [],
        #     '외투' : [],
        #     '기타' : []
        # }
        
        # schedule에서 옷 가져오기
        recommand_outfit = PastOutfit.objects.filter(schedule__schedule_id=result)
        
        
        nes_response_form = []

        
        # start = time.time()
        for clothes in recommand_outfit:
            # 여기 serialize할건지 결정
            actual_clothing = clothes.clothing
            
            new_response = []
            
            new_response.append(ClothingSerializer(actual_clothing, context={'user_id': request.META['HTTP_USERID']}).data)
            
            # 일단 담기
            # response_form['recommand_outfit'][clothes.clothing.category].append(ClothingSerializer(actual_clothing, context={'user_id': request.META['HTTP_USERID']}).data)
            
            # 비교를 위한 벡터 생성
            style_vector = np.zeros(style_count + 1)
            texture_vector = np.zeros(texture_count + 1)
            
            # for문에 걸친 옷의 개별 스타일, 재질
            # print(f'첫번째 {time.time() - start: .5f}')
            clothes_textures = ClothingTexture.objects.filter(clothing_detail=actual_clothing.clothing_detail).values_list('texture_id', flat=True)
            clothes_styles = ClothingStyle.objects.filter(clothing=actual_clothing).values_list('style_id', flat=True)
            for clothes_style in clothes_styles:
                style_vector[clothes_style] = 1
            
            for clothes_texture in clothes_textures:
                texture_vector[clothes_texture] = 1
            
            # 이미지 비교를 위한 마지막 벡터 합치기
            compare_clothes_vector = np.concatenate((style_vector, texture_vector, np.array([weight])))
            
            # 이미지 bite 데이터
            # print('비교', actual_clothing.clothing_detail.clothing_img_path)
            recommand_response = requests.get(actual_clothing.clothing_detail.clothing_img_path).content
            recommand_img = cv2.cvtColor(cv2.resize(cv2.imdecode(np.asarray(bytearray(recommand_response), dtype="uint8"), cv2.IMREAD_COLOR), (150, 150)), cv2.COLOR_BGR2RGB)
            
            # # opencv 내장 비교 함수
            # standard_hist = cv2.calcHist([recommand_img], [0, 1], None, [150, 150], [0, 150, 0, 150])
            # cv2.normalize(standard_hist, standard_hist, 0, 1, cv2.NORM_MINMAX)
            
            # 중복 옷 벡터화를 막기위한 저장공간 + 초기화공간
            vectors_for_knn = copy.deepcopy(user_clothes_vectors)
            # print(f'두번째 {time.time() - start: .5f}')
            for vector_idx in range(len(user_clothes_vectors[clothes.clothing.category])):
                # 비교할 이미지 데이터
                # print(f'중간1 {time.time() - start: .5f}')
                compare_clothes_img_url = get_object_or_404(Clothing, clothing_id=int(user_clothes_vectors[clothes.clothing.category][vector_idx][0])).clothing_detail.clothing_img_path
                # print(f'중간3 {time.time() - start: .5f}')
                compare_response = requests.get(compare_clothes_img_url).content
                # print(f'중간4 {time.time() - start: .5f}')
                compare_img = cv2.cvtColor(cv2.resize(cv2.imdecode(np.asarray(bytearray(compare_response), dtype="uint8"), cv2.IMREAD_COLOR), (150, 150)), cv2.COLOR_BGR2RGB)
                # print(f'중간5 {time.time() - start: .5f}')
                
                
                # # opencv 내장 비교 함수
                # compare_hist = cv2.calcHist([compare_img], [0, 1], None, [150, 150], [0, 150, 0, 150])
                # cv2.normalize(compare_hist, compare_hist, 0, 1, cv2.NORM_MINMAX)
                
                # ret = cv2.compareHist(standard_hist, compare_hist, 3)
                # print(ret)
                
                # img_compare_value = ret
                
                
                # ==================================ssim이용================================================
                ssim_vals = []
                
                # RGB비교
                for i in range(3):
                    ssim_val = ssim(recommand_img[:,:,i], compare_img[:,:,i], data_range=compare_img[:,:,i].max() - compare_img[:,:,i].min())
                    ssim_vals.append(ssim_val)
                    
                ssim_avg = np.mean(ssim_vals)
                
                img_compare_value = ssim_avg
                # ==================================ssim이용================================================
                # print(f'중간2 {time.time() - start: .5f}')
                vectors_for_knn[clothes.clothing.category][vector_idx] = np.concatenate((user_clothes_vectors[clothes.clothing.category][vector_idx], np.array([img_compare_value * weight])))
            # print(f'세번째 {time.time() - start: .5f}')
            # knn을 위한 데이터/라벨 분리
            knn_data = np.array(vectors_for_knn[clothes.clothing.category])[:, 1:]

            knn_label = np.array(vectors_for_knn[clothes.clothing.category])[:, 0]
            
            # knn
            knn = KNeighborsClassifier(n_neighbors=1, weights='distance', metric='euclidean')
            knn.fit(knn_data, knn_label)
            
            knn_n_neighbors = int(recommend_count)
            
            if len(knn_data) <= 1:
                knn_n_neighbors = 1
                
            distance, knn_result_index_list = knn.kneighbors(compare_clothes_vector.reshape(1, -1), n_neighbors=knn_n_neighbors)
            
            knn_result_list = knn.classes_[knn_result_index_list]
            
            # recommend_clothes_results = []
            
            for knn_result_clothes in knn_result_list[0]:

                new_response.append(ClothingSerializer(get_object_or_404(Clothing, clothing_id= int(knn_result_clothes)), context={'user_id': request.META['HTTP_USERID']}).data)
                # recommend_clothes_results.append(ClothingSerializer(get_object_or_404(Clothing, clothing_id= int(knn_result_clothes)), context={'user_id': request.META['HTTP_USERID']}).data)
            # print(f'네번째 {time.time() - start: .5f}')
            
            # response_form[clothes.clothing.category].append(recommend_clothes_results)
            nes_response_form.append(new_response)
            
        
        print('여기옴', {'data':nes_response_form})
        return Response({'data':nes_response_form}, status=status.HTTP_200_OK)
        
        


def fine_tuning():
    global model_dir
    model_dir = 'backup'
    
    # 추후 오늘 날짜 혹은 이틀 전 날짜로 바꾸기
    target_date = datetime.now().date() - timedelta(1)
    new_schedules = Schedule.objects.select_related('user', 'weather').filter(date__date=target_date)
    for schedule_ in schedule_list:
        for gender in gender_list:
            schedule_datas = new_schedules.filter(schedule_category=schedule_, user__gender=gender)
            
            data_count = len(schedule_datas)
            
            if data_count:
                
                # 라벨 데이터 읽기
                with open(f'{path}/ML_models/current/label.json', 'r', encoding='utf-8') as file:
                    label_infos = json.load(file)
                
                # 전처리
                pre_data = np.empty((data_count, 11), dtype=np.float32)
                for i, schedule in enumerate(schedule_datas):
                    pre_data[i] = [
                        schedule.user.age // 10,
                        schedule.weather.lowest_temperature,
                        schedule.weather.highest_temperature,
                        schedule.weather.lowest_real_feeling_temperature,
                        schedule.weather.highest_real_feeling_temperature,
                        schedule.weather.precipitation,
                        schedule.weather.snow_cover,
                        schedule.weather.humidity,
                        schedule.weather.wind_speed,
                        schedule.weather.solar_irradiance,
                        label_infos[f'{gender_dict[gender]}_{schedule_dict[schedule_]}']['count']
                    ]
                    
                    label_infos[f'{gender_dict[gender]}_{schedule_dict[schedule_]}']['label_list'].append(schedule.schedule_id)
                    
                    label_infos[f'{gender_dict[gender]}_{schedule_dict[schedule_]}']['count'] += 1
                
                with open(f'{path}/ML_models/current/label.json', 'w', encoding='utf-8') as file:
                    json.dump(label_infos, file, indent="\t", ensure_ascii=False)


                # [[3 1 1 1 1 1 1 1 1 1]]
                x_data = pre_data[:, :-1]
                
                # [0 1 2 3]
                labels = pre_data[:, -1]
                new_classes_count = len(labels)
                
                x_data = x_data.astype(np.float32)
                labels = labels.astype(np.float32)
                
                # 확인 후 fine-tuning / make model
                if os.path.exists(f'{path}/ML_models/current/{gender_dict[gender]}_{schedule_dict[schedule_]}.h5'):

                    # fine-tuning
                    model = tensorflow.keras.models.load_model(f'{path}/ML_models/current/{gender_dict[gender]}_{schedule_dict[schedule_]}.h5')
                    model.summary()
                    old_classes = model.layers[-1].units
                    
                    # categorical_crossentropy를 위한 categorical
                    y_train = to_categorical(labels, num_classes=new_classes_count + old_classes)
                    
                    model.pop()
                    
                    # 고유성을 위한 time으로 이름 설정
                    safe_name = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
                    
                    model.add(Dense(new_classes_count + old_classes, activation='softmax', name=str(safe_name)))
                    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['acc'])
                    
                    model.fit(
                                x_data,
                                y_train,
                                epochs=10,
                                callbacks=[
                                        ModelCheckpoint(f'{path}/ML_models/current/{gender_dict[gender]}_{schedule_dict[schedule_]}.h5', monitor='acc', verbose=1, save_best_only=True, mode='auto'),
                                        ReduceLROnPlateau(monitor='acc', factor=0.5, patience=50, verbose=1, mode='auto')
                                ]
                              )
                    
                else:
                    # make new model
                    y_train = to_categorical(labels, num_classes=new_classes_count)
                    
                    model = Sequential([
                        Dense(64, activation='relu', input_shape=(10,)),
                        Dense(32, activation='relu'),
                        Dense(new_classes_count, activation='softmax')
                    ])
                    
                    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['acc'])
                    
                    model.fit(
                        x_data,
                        y_train,
                        epochs=10,
                        callbacks=[
                                    ModelCheckpoint(f'{path}/ML_models/current/{gender_dict[gender]}_{schedule_dict[schedule_]}.h5', monitor='acc', verbose=1, save_best_only=True, mode='auto'),
                                    ReduceLROnPlateau(monitor='acc', factor=0.5, patience=50, verbose=1, mode='auto')
                                ]
                            )

    # 완료 후 dir 바꾸기
    model_dir = 'current'
    
    # 이후 backup에 복사
    all_update_files_list = os.listdir(f'{path}/ML_models/current')
    for file in all_update_files_list:
        shutil.copy2(f'{path}/ML_models/current/{file}', f'{path}/ML_models/backup')



    

@api_view(['GET'])
def test(request):
    fine_tuning()
    test = {}
    test_list = []
    test_list2 = []
    for a in Weather.objects.all():
        test_list.append(a.location_key)
    
    for b in Schedule.objects.all():
        test_list2.append(b.schedule_category)
        
    test['init'] = test_list
    test['fin'] = test_list2
    
    with open(f'{path}/ML_models/current/label.json', 'r', encoding='utf-8') as file:
        label_infos = json.load(file)
        
    test['label'] = label_infos
    
    return Response(test, status=status.HTTP_200_OK)


@api_view(['GET'])
def update(request):
    global model_dir
    model_dir = 'backup'

    
    # 초기화
    delete_path = f'{path}/ML_models/current'

    for file in os.listdir(delete_path):
        file_path = os.path.join(delete_path, file)
        os.remove(file_path)
    

    # 신규 라벨 파일 저장
    new_label_form = {
	"male_Interview": {
		"count": 0,
		"label_list": []
	},
	"female_Interview": {
		"count": 0,
		"label_list": []
	},
	"male_Graduate": {
		"count": 0,
		"label_list": [
		]
	},
	"female_Graduate": {
		"count": 0,
		"label_list": []
	},
	"male_Date": {
		"count": 0,
		"label_list": []
	},
	"female_Date": {
		"count": 0,
		"label_list": []
	},
	"male_Business": {
		"count": 0,
		"label_list": []
	},
	"female_Business": {
		"count": 0,
		"label_list": []
	},
	"male_Trip": {
		"count": 0,
		"label_list": []
	},
	"female_Trip": {
		"count": 0,
		"label_list": []
	},
	"male_Workout": {
		"count": 0,
		"label_list": []
	},
	"female_Workout": {
		"count": 0,
		"label_list": []
	},
	"male_Rest": {
		"count": 0,
		"label_list": []
	},
	"female_Rest": {
		"count": 0,
		"label_list": []
	},
	"male_Wedding": {
		"count": 0,
		"label_list": []
	},
	"female_Wedding": {
		"count": 0,
		"label_list": []
	},
	"male_Meeting": {
		"count": 0,
		"label_list": []
	},
	"female_Meeting": {
		"count": 0,
		"label_list": []
	},
	"male_Event": {
		"count": 0,
		"label_list": []
	},
	"female_Event": {
		"count": 0,
		"label_list": []
	},
	"male_Daily": {
		"count": 0,
		"label_list": []
	},
	"female_Daily": {
		"count": 0,
		"label_list": []
	},
	"male_ETC": {
		"count": 0,
		"label_list": []
	},
	"female_ETC": {
		"count": 0,
		"label_list": []
	},
	"male_Nothing": {
		"count": 0,
		"label_list": []
	},
	"female_Nothing": {
		"count": 0,
		"label_list": []
	}
}


    with open(os.path.join(f'{path}/ML_models/current', 'label.json'), 'w', encoding='utf-8') as file:
        json.dump(new_label_form, file)

    
    # 추후 오늘 날짜 혹은 이틀 전 날짜로 바꾸기
    target_date = datetime.now().date() - timedelta(1)
    new_schedules = Schedule.objects.select_related('user', 'weather').filter(date__date__lt=target_date)
    for schedule_ in schedule_list:
        for gender in gender_list:
            schedule_datas = new_schedules.filter(schedule_category=schedule_, user__gender=gender)
            
            data_count = len(schedule_datas)
            
            if data_count:
                
                # 라벨 데이터 읽기
                with open(f'{path}/ML_models/current/label.json', 'r', encoding='utf-8') as file:
                    label_infos = json.load(file)
                
                
                # 전처리
                pre_data = np.empty((data_count, 11), dtype=np.float32)
                for i, schedule in enumerate(schedule_datas):
                    if schedule.weather == None:
                        schedule.weather = {
                            'lowest_temperature': 0,
                            'highest_temperature': 0,
                            'lowest_real_feeling_temperature': 0,
                            'highest_real_feeling_temperature': 0,
                            'precipitation': 0,
                            'snow_cover': 0,
                            'humidity': 0,
                            'wind_speed': 0,
                            'solar_irradiance': 0,
                        }
                    pre_data[i] = [
                        schedule.user.age // 10,
                        schedule.weather.lowest_temperature,
                        schedule.weather.highest_temperature,
                        schedule.weather.lowest_real_feeling_temperature,
                        schedule.weather.highest_real_feeling_temperature,
                        schedule.weather.precipitation,
                        schedule.weather.snow_cover,
                        schedule.weather.humidity,
                        schedule.weather.wind_speed,
                        schedule.weather.solar_irradiance,
                        label_infos[f'{gender_dict[gender]}_{schedule_dict[schedule_]}']['count']
                    ]
                    
                    label_infos[f'{gender_dict[gender]}_{schedule_dict[schedule_]}']['label_list'].append(schedule.schedule_id)
                    
                    label_infos[f'{gender_dict[gender]}_{schedule_dict[schedule_]}']['count'] += 1
                
                with open(f'{path}/ML_models/current/label.json', 'w', encoding='utf-8') as file:
                    json.dump(label_infos, file, indent="\t", ensure_ascii=False)


                # [[3 1 1 1 1 1 1 1 1 1]]
                x_data = pre_data[:, :-1]
                
                # [0 1 2 3]
                labels = pre_data[:, -1]
                new_classes_count = len(labels)
                
                x_data = x_data.astype(np.float32)
                labels = labels.astype(np.float32)
                
                # 확인 후 fine-tuning / make model
                if os.path.exists(f'{path}/ML_models/current/{gender_dict[gender]}_{schedule_dict[schedule_]}.h5'):

                    # fine-tuning
                    model = tensorflow.keras.models.load_model(f'{path}/ML_models/current/{gender_dict[gender]}_{schedule_dict[schedule_]}.h5')
                    model.summary()
                    old_classes = model.layers[-1].units
                    
                    # categorical_crossentropy를 위한 categorical
                    y_train = to_categorical(labels, num_classes=new_classes_count + old_classes)
                    
                    model.pop()
                    
                    # 고유성을 위한 time으로 이름 설정
                    safe_name = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
                    
                    model.add(Dense(new_classes_count + old_classes, activation='softmax', name=str(safe_name)))
                    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['acc'])
                    
                    model.fit(
                                x_data,
                                y_train,
                                epochs=10,
                                callbacks=[
                                        ModelCheckpoint(f'{path}/ML_models/current/{gender_dict[gender]}_{schedule_dict[schedule_]}.h5', monitor='acc', verbose=1, save_best_only=True, mode='auto'),
                                        ReduceLROnPlateau(monitor='acc', factor=0.5, patience=50, verbose=1, mode='auto')
                                ]
                              )
                    
                else:
                    # make new model
                    y_train = to_categorical(labels, num_classes=new_classes_count)
                    
                    model = Sequential([
                        Dense(64, activation='relu', input_shape=(10,)),
                        Dense(32, activation='relu'),
                        Dense(new_classes_count, activation='softmax')
                    ])
                    
                    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['acc'])
                    
                    model.fit(
                        x_data,
                        y_train,
                        epochs=10,
                        callbacks=[
                                    ModelCheckpoint(f'{path}/ML_models/current/{gender_dict[gender]}_{schedule_dict[schedule_]}.h5', monitor='acc', verbose=1, save_best_only=True, mode='auto'),
                                    ReduceLROnPlateau(monitor='acc', factor=0.5, patience=50, verbose=1, mode='auto')
                                ]
                            )

    # 완료 후 dir 바꾸기
    model_dir = 'current'
    
    # 이후 backup에 복사
    all_update_files_list = os.listdir(f'{path}/ML_models/current')
    for file in all_update_files_list:
        shutil.copy2(f'{path}/ML_models/current/{file}', f'{path}/ML_models/backup')
    test = {}
    with open(f'{path}/ML_models/current/label.json', 'r', encoding='utf-8') as file:
        label_infos = json.load(file)
        
    test['label'] = label_infos
    
    return Response(test)
    