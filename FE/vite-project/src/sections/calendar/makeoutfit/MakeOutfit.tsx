import styled from "styled-components";
import { useSelectedItemsStore } from "@/store/ClothesStore";
import Canvas from "./Canvas";
// import { useState, useEffect } from "react";
import { Loader } from "@/components/Loader";
import IconBack from "@/assets/ui/IconBack";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
// import store


const MakeOutfit = () => {
  // const [showCanvas, setShowCanvas] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Header style={{ height: "8dvh" }}>
        <IconBack onClick={() => navigate("/calendar")} />
        <p className="title">옷장에서 코디 고르기</p>
      </Header>
      {/* {showCanvas ? <Canvas /> : <Loader />} */}
      <Canvas />
      <ChooseClothes />
    </>
  );
};

export default MakeOutfit;

const CATEGORY = ["전체", "상의", "하의", "치마", "아우터"];
const SORT = ["최근 등록 순", "오래된 순", "많이 입은 순"];

const ChooseClothes = () => {
  // const { selectedItems, toggleItem } = useSelectedItemsStore();
  const { selectedItems, toggleItem } = useSelectedItemsStore();
  const { isLoading, data } = useApi("get", "clothing");
  console.log(selectedItems);
  if (isLoading) return <Loader />;
  return (
    <>
      <Filter>
        <select className="category" name="category">
          <option style={{ textAlign: "center" }} hidden>
            카테고리
          </option>
          {CATEGORY.map((item) => {
            return (
              <option value={item} key={item}>
                {item}
              </option>
            );
          })}
        </select>
        <select className="category">
          <option style={{ textAlign: "center" }} hidden>
            정렬
          </option>
          {SORT.map((item) => {
            return (
              <option value={item} key={item}>
                {item}
              </option>
            );
          })}
        </select>
      </Filter>
      <ChooseClothesWrapper>
        {data.map((item) => {
          const isSelected = selectedItems.some(
            (selectedItem: { id: string }) =>
              Number(selectedItem.id) === item.clothingId
          );

          return (
            <div
              className={`imgarea ${isSelected ? "selected" : ""}`}
              key={item.clothingId}
              onClick={() => toggleItem(item)}
            >
              <img
                className="clothesimg"
                src={item.clothingImagePath}
                alt={item.clothingId}
              />

              {isSelected && <div className="itemId">{item.clothingName}</div>}
            </div>
          );
        })}
      </ChooseClothesWrapper>
    </>
  );
};

const ChooseClothesWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  background-color: lightgray;
  height: 45dvh;
  gap: 3px;
  align-content: baseline;
  padding: 3px 0 calc(12dvh + 3px) 3px;
  overflow-y: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  .imgarea {
    width: calc((100% / 3 - 3px));
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props) =>
      `${props.theme.colors.pointcolor
        .replace("rgb", "rgba")
        .replace(")", ", 0.2)")}`};
    border-radius: 10px;
    position: relative;
  }

  .clothesimg {
    width: 90%;
  }

  .imgarea.selected {
    filter: contrast(0.5);
  }

  .itemId {
    /* id 스타일링 */
    position: absolute;
    top: 50%; /* 중간에 위치 */
    left: 50%;
    transform: translate(-50%, -50%); /* 정확한 중앙 정렬을 위해 */
    color: black; /* 글자색 */
    font-size: 0.8rem; /* 글자 크기 */
    z-index: 10; /* 이미지 위에 표시 */
    text-shadow: -1px 0px black, 0px 1px black, 1px 0px black, 0px -1px black;
  }
`;

/* ${({ theme }) => theme.common.flexCenterColumn}; */

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

const Filter = styled.div`
  select {
    margin: 5px 5px;
    padding: 5px 5px;
    border-radius: 4px;
    outline: 0 none;
  }

  select option {
    background: ${(props) => props.theme.colors.backgroundcolor};
    color: grey;
    padding: 3px 0px;
    font-size: 12px;
    border: 1px solid grey;
  }
`;
