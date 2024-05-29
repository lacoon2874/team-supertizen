import styled from "styled-components";
import { useSelectedItemsStore } from "@/store/ClothesStore";
import { useSelectedDateStore } from "@/store/DateStore";
import IconBack from "@/assets/ui/IconBack";
import IconCheck from "@/assets/ui/IconCheck";
import { useNavigate } from "react-router-dom";
import HashTag from "./HashTag";
import { usePatchConfirmClothes } from "@/hooks/usePatchConfirmClothes";
interface SelectedItem {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  url: string;
}

const ConfirmOutfit = () => {
  const navigate = useNavigate();
  const { confirmOutfit, selectedItems } = useSelectedItemsStore();
  const { selectedDate, title, selectedKeyword } = useSelectedDateStore();
  const { mutate } = usePatchConfirmClothes();
  const date = new Date();
  const fileName = `CanvasImage_${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.png`;
  console.log(fileName);

  const postCanvasImage = async (
    date: string,
    keyword: string,
    title: string,
    selectedClothes: SelectedItem[],
    imageData: string
  ) => {
    // console.log(date, keyword, title);
    // console.log(imageData);

    const formData = new FormData();

    // schedule 객체를 application/json 타입의 Blob으로 변환하여 FormData에 추가
    formData.append(
      "schedule",
      new Blob(
        [
          JSON.stringify({
            date,
            title,
            category: keyword,
            locationKey: 226003,
            clothing: selectedClothes.map((clothing) => ({
              clothingId: clothing.id,
              x: clothing.x,
              y: clothing.y,
              width: clothing.width,
              height: clothing.height,
            })),
          }),
        ],
        { type: "application/json" }
      )
    );

    // 이미지 데이터를 Blob으로 변환하여 FormData에 추가
    const imageBlob = await fetch(imageData).then((res) => res.blob());
    // console.log("**** imageBlob 확인**************");
    // console.log(typeof imageBlob);
    // console.log(imageBlob);
    formData.append("file", imageBlob, "image.png");

    mutate(formData);
  };

  return (
    <>
      <Header>
        <IconBack onClick={() => navigate("/calendar/makeoutfit")} />
        <IconCheck
          onClick={() => {
            postCanvasImage(
              selectedDate,
              selectedKeyword,
              title,
              selectedItems,
              confirmOutfit
            );
          }}
        />
      </Header>
      <Wrapper>
        <p className="date">{selectedDate}</p>
        <div className="imgarea">
          <img src={confirmOutfit} alt="confirmOutfit" />
        </div>
        <HashTag />
      </Wrapper>
    </>
  );
};

export default ConfirmOutfit;

const Header = styled.div`
  padding: 8px 8px 0 8px;
  height: 7dvh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
`;

const Wrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
  margin-left: auto;
  margin-right: auto;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }

  .date {
    font-size: 1rem;
    align-self: self-start;
  }

  .imgarea {
    margin: 1rem 0 0 0;
    width: 80%;
    aspect-ratio: 1 / 1;
    background-color: ${(props) =>
      `${props.theme.colors.pointcolor
        .replace("rgb", "rgba")
        .replace(")", ", 0.3)")}`};

    border-radius: 20px;
    padding: 1rem 1rem;
  }

  img {
    width: 100%;
    object-fit: contain;
  }
`;
