import axios from "axios";

const weatherToken = "abcd";

const weatherURL = `http://dataservice.accuweather.com/`;
const weatherAxiosInstance = axios.create({
  baseURL: weatherURL,
});

const locateURL = `https://dapi.kakao.com/`;
const locateAxiosInstance = axios.create({
  baseURL: locateURL,
  headers: {
    Authorization: import.meta.env.VITE_KAKAO_API_KEY,
  },
});

// // 로그인 유저 api
// const backendURL = '';
// const userAxiosInstance = axios.create({
//     baseURL: backendURL,
//     headers: {
//         'userID': ``
//       }
// });

// // 로그인 필요x api
// const nonUserAxiosInstance = axios.create({
//     baseURL: backendURL,
// });

// // 날짜-일정 요청
// export const fetchSchedule = async (date: Date) => {
//     return (await userAxiosInstance.get<void>(`${date}`));
// }

// 하루 날씨 데이터 요청
export const fetchTodayWeather = async (locateKey: number) => {
  return await weatherAxiosInstance.get<void>(
    `currentconditions/v1/${locateKey}?apikey=${weatherToken}&language=ko-kr&details=true`
  );
};

// 5일 날씨 데이터 요청
export const fetch5daysWeather = async (
  locateKey: number,
  language: string
) => {
  return await weatherAxiosInstance.get<void>(
    `currentconditions/v1/${locateKey}?apikey=${weatherToken}&language=${language}&details=true&metric=true`
  );
};

// 좌표 -> 주소 변경
export const fetchLocate = async (latitude: number, longitude: number) => {
  return await locateAxiosInstance.get<any>(
    `v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}&input_coord=WGS84`
  );
};
