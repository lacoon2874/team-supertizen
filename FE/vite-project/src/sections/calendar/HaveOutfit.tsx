import { MomentInput } from "moment";
import moment from "moment";
import { useApi } from "@/hooks/useApi";
import { Loader } from "@/components/Loader";
import styled from "styled-components";
import { situationcolor, stateColor } from "./config-schedule";
import IconTrash from "@/assets/ui/IconTrash";
import { useDeleteSchedule } from "@/hooks/useDeleteSchedule";
import { useState, useRef, ReactNode } from "react";
import { BASE_URL } from "@/config/config";
import axios from "axios";

type OutfitResponseType = {
  scheduleId: number;
  scheduleCategory: string;
  scheduleName: string;
  outfitImagePath: string;
  clothing: [
    {
      clothingId: 0;
      clothingName: string;
      clothingImagePath: string;
      state: string;
    }
  ];
};

interface OutfitQuery {
  isLoading: boolean;
  data: OutfitResponseType;
}

const HaveOutfit = ({ date }) => {
  const { deletemutate } = useDeleteSchedule();
  const selected = moment(date as MomentInput).format("YYYY-MM-DD");
  const { isLoading, data }: OutfitQuery = useApi(
    "get",
    `calendar/date?date=${selected}`
  );

  const handleDelete = () => {
    deletemutate(selected);
  };

  const [dialogContent, setDialogContent] = useState<ReactNode>(null);
  const dialogRef = useRef(null);

  const handleDialogOpen = async (clothingId) => {
    try {
      const response = await axios(`${BASE_URL}/clothing/${clothingId}/info`, {
        headers: {
          "User-ID": localStorage.getItem("token"),
        },
      });
      const responseClothingInfo = response.data.dataBody;
      console.log("responseClothingInfo", responseClothingInfo);
      // const responseMessage = `마지막으로 세탁한 날짜는 : ${responseClothingInfo.lastWashDate}, 마지막 세탁 이후 착용 횟수는 : ${responseClothingInfo.wornCount} 입니다.`;

      const responseMessage = (
        <p>
          {/* 마지막으로 세탁한 날짜는 {moment(responseClothingInfo.lastWashDate).format("")},<br /> */}
          마지막으로 세탁한 날짜 : {responseClothingInfo.lastWashDate}
          <br />
          마지막 세탁 이후 착용 횟수 : {responseClothingInfo.wornCount} 회
        </p>
      );

      setDialogContent(responseMessage);
      dialogRef.current?.showModal();
    } catch (error) {
      console.error("옷 세부 정보 가져오기 실패", error);
    }
  };

  const handleDialogClose = () => {
    dialogRef.current.close();
  };

  if (isLoading) return <Loader />;

  return (
    <HaveOutfitContainer>
      <div className="upper">
        <span
          className="tag"
          style={{
            backgroundColor: situationcolor[data.scheduleCategory],
          }}
        >
          {data.scheduleCategory}
        </span>
        <IconTrash onClick={handleDelete} />
      </div>

      <div className="coordarea">
        <img src={data.outfitImagePath} alt={data.scheduleName} />
      </div>

      {data.clothing.map((item) => {
        return (
          <div className="item" key={item.clothingId}>
            <div className="imgarea">
              <img src={item.clothingImagePath} alt={item.clothingImagePath} />
            </div>
            <div className="textarea">
              <p className="clothingname">{item.clothingName}</p>
              <p
                style={{ color: stateColor[item.state] }}
                onClick={() => handleDialogOpen(item.clothingId)}
              >
                {item.state}
              </p>
            </div>
          </div>
        );
      })}
      <StyledDialog ref={dialogRef}>
        {dialogContent}
        <button onClick={handleDialogClose}>확인</button>
      </StyledDialog>
    </HaveOutfitContainer>
  );
};

export default HaveOutfit;

const HaveOutfitContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 10px;
  display: flex;
  flex-direction: column;
  padding-bottom: 12dvh;

  .upper {
    display: flex;
    justify-content: space-between;
  }
  .tag {
    width: 20%;
    padding: 5px 5px;
    border-radius: 10px;
    text-align: center;
    color: #acacac;
    font-weight: bold;
  }

  .coordarea {
    margin-top: 1rem;
    width: 95%;
    box-sizing: border-box;
    padding: 1rem 1rem;
    border-radius: 20px;
    aspect-ratio: 1 / 1;
    margin-left: auto;
    margin-right: auto;
    background-color: ${(props) =>
      `${props.theme.colors.pointcolor
        .replace("rgb", "rgba")
        .replace(")", ", 0.4)")}`};

    img {
      width: 100%;
      height: 100%;
    }
  }

  .item {
    width: 100%;
    margin-top: 1rem;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    column-gap: 10px;
  }

  .imgarea {
    border-radius: 10px;
    height: 100px;
    width: 100px;
    background-color: ${(props) => props.theme.colors.backgroundcolor};

    /* background-color: ${(props) =>
      `${props.theme.colors.pointcolor
        .replace("rgb", "rgba")
        .replace(")", ", 0.2)")}`}; */

    img {
      width: 100px;
      height: 100px;
      object-fit: contain;
    }
  }

  .textarea {
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: 1rem;
  }

  .clothingname {
    font-size: 1.2rem;
    font-weight: bold;
  }
`;

const StyledDialog = styled.dialog`
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;

  p {
    line-height: 210%;
  }

  & button {
    display: block;
    margin: 20px auto 0;
    border: none;
    padding: 4px 10px;
    background-color: #45ba8c;
    color: white;
    border-radius: 5px;
    box-sizing: border-box;
  }
`;
