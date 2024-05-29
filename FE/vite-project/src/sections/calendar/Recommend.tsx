import IconBack from "@/assets/ui/IconBack";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSelectedDateStore } from "@/store/DateStore";
import { useSelectedItemsStore } from "@/store/ClothesStore";
import { useApi } from "@/hooks/useApi";
import { Loader } from "@/components/Loader";
import { useMLApi } from "@/hooks/usePostRecommendedOutfitt";


type userResponseType = {
  age: number;
  gender: string;
};

interface userQuery {
  isLoading: boolean;
  data: userResponseType;
}

const Recommend = () => {

  const navigate = useNavigate();
  const { selectedDate, selectedKeyword } = useSelectedDateStore();
  const { selectedItems, toggleItem } = useSelectedItemsStore();

  const { isLoading, data:qqqq }: userQuery = useApi("get", "users");

  const rate:number = 0

  
  const today = new Date();
  const formattedDate = today.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
      }).replace(/\./g, '-').replace(/\s/g, '').slice(0, -1);
  const schedule = localStorage.getItem("schedule");
  const locateInfo = localStorage.getItem("locate");

  const { data:MLdata, isLoading:MLisLoding, isError:MLisError } = useMLApi("get", `test/${rate.toString()}/${formattedDate}/${locateInfo.toString()}/${schedule}/${2}`, 'MLQ');

  if (MLisLoding || MLisError) {
    console.log('api돌아가는ㄴ중 ')
  }

  if (isLoading) return <Loader />;
  const userAge = Math.floor(qqqq.age);
  const userGender = qqqq?.gender;

  

  if (isLoading) return <Loader />;
  if (MLisError) return <div>Error</div>;

  // console.log("recommenddata");
  if (MLdata) {
  console.log('데이터!', MLdata);
}
// console.log('데이터', MLData, example)
  return (
    <>
      <Header style={{ height: "8dvh" }}>
        <IconBack onClick={() => navigate("/calendar")} />
        <p className="title">코디 추천</p>
      </Header>
      <RecommendHeader>
        <h2 className="comment">
          <span className="point">{selectedDate}</span> 예상 날씨와 <br />
          <span className="point">{selectedKeyword}</span> 키워드에 맞는 <br />
          <span className="point">{Math.floor(userAge / 10) * 10}</span>대인{" "}
          <span className="point">{userGender}</span>를 위한 추천 코디
        </h2>
      </RecommendHeader>

      <RecomendContainer>
        {/* {(MLisLoding || MLisError) ? <Loader/> : MLData} */}
        { (MLisLoding || MLisError) ? <div><Loader/></div> : ((MLdata.length) ? (MLdata[0].length) ? 
         MLdata.map((list) => {
           return (
             <div className="category" key={list[0].clothing_id}>
               <div className="imgarea recommend">
                 <img
                   src={list[0].clothing_img_path}
                   alt={list[0].clothing_name}
                 />
               </div>
               {[1, 2].map((idx) => {
                 const isSelected = selectedItems.some(
                   (selectedItem: { id: string }) =>
                     Number(selectedItem.id) === list[idx].clothing_id
                 );
                 return (
                   <div
                     key={idx}
                     className={`imgarea ${isSelected ? "selected" : ""}`}
                     onClick={() => {
                       const item = {
                         clothingId: list[idx].clothing_id,
                         clothingName: list[idx].clothing_name,
                         clothingImagePath: list[idx].clothing_img_path,
                       };
                       toggleItem(item);
                     }}
                   >
                     <img
                       src={list[idx].clothing_img_path}
                       alt={list[idx].clothing_name}
                     />
                   </div>
                 );
               })}
             </div>
           );
         }) : <div>not enough data</div> : <div>not enough data</div>)}
      </RecomendContainer>

      <RecommendSelect>
        {selectedItems.length ? (
          <>
            <div className="arr">
              {selectedItems.map((item) => {
                return (  
                  <div className="selectedimgarea">
                    <img src={item.url} alt={item.name} />
                  </div>
                );
              })}
            </div>

            <div className="btnarea">
              <GreenButton onClick={() => navigate("/calendar/makeoutfit")}>
                수정하기
              </GreenButton>
            </div>
          </>
        ) : (
          <></>
        )}
      </RecommendSelect>
    </>
  );
}

export default Recommend;

const Header = styled.div`
  height: 6dvh;
  ${({ theme }) => theme.common.flexCenter};
  background-color: white;
  padding: 8px 8px 0 8px;

  .title {
    font-weight: bold;
    margin-left: auto;
    margin-right: auto;
  }
`;

const RecommendHeader = styled.div`
  width: 97%;
  box-sizing: border-box;
  padding: 1rem 5px;

  .comment {
    font-size: 1.5rem;
    line-height: 140%;
  }

  .point {
    color: ${(props) => props.theme.colors.pointcolor};
    font-size: 1.7rem;
    font-weight: bold;
  }
`;

const RecomendContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 5px 10px;

  .category {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 1rem;
  }

  .imgarea {
    aspect-ratio: 1/1;
    height: auto;
    border-radius: 10px;
    background-color: white;

    img {
      width: 100%;
      object-fit: fill;
    }
  }

  .recommend {
    border: 2px solid ${(props) => `${props.theme.colors.pointcolor}`};
    background-color: ${(props) =>
      `${props.theme.colors.pointcolor
        .replace("rgb", "rgba")
        .replace(")", ", 0.2)")}`};
  }

  .imgarea.selected {
    filter: contrast(0.5);
  }
`;

const RecommendSelect = styled.div`
  width: 100%;
  padding-bottom: 12dvh;

  .arr {
    width: 100%;
    display: flex;
    padding: 1rem 1rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    background-color: ${(props) =>
      `${props.theme.colors.pointcolor
        .replace("rgb", "rgba")
        .replace(")", ", 0.2)")}`};
  }

  .selectedimgarea {
    width: 90%;
    aspect-ratio: 1/1;
    height: auto;
    border-radius: 10px;
    background-color: white;

    img {
      width: 100%;
      object-fit: fill;
    }
  }
  .btnarea {
    width: 100%;
    padding-bottom: 3dvh;
    ${({ theme }) => theme.common.flexCenterColumn};
    background-color: ${(props) =>
      `${props.theme.colors.pointcolor
        .replace("rgb", "rgba")
        .replace(")", ", 0.2)")}`};
  }
`;

const GreenButton = styled.button`
  border: none;
  background-color: #3ba279;
  color: white;
  border-radius: 40px;
  box-sizing: border-box;
  opacity: 0.7;
  width: 50%;
  padding: 1rem 1rem;
`;
