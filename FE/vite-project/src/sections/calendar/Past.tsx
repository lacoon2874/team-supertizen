import styled from "styled-components";
import IconBack from "@/assets/ui/IconBack";
import { useNavigate } from "react-router-dom";
import { useSelectedItemsStore } from "@/store/ClothesStore";
import { useApi } from "@/hooks/useApi";
import { Loader } from "@/components/Loader";
import moment from "moment";
import axios from "axios";
import { BASE_URL } from "@/config/config";
import IconEdit from "@/assets/ui/IconEdit";
import { useState } from "react";
import IconCheck from "@/assets/ui/IconCheck";
import IconSmallWeather from "@/assets/weather/IconSmallWeather";
import { situationcolor } from "./config-schedule";

type PastResponseItem = {
  schedule: {
    scheduleId: number;
    date: string;
    scheduleCategory: string;
    outfitImagePath: string;
  };
  weather: {
    icon: number;
    lowestTemperature: number;
    highestTemperature: number;
  };
};

interface ClothingPositionQueryType {
  isLoading: boolean;
  data: PastResponseItem[];
}

function Past() {
  const [selectedPast, setSelectedPast] = useState<PastResponseItem>(null);

  const navigate = useNavigate();
  const { setConfirmOutfit, toggleItem, selectedItems } =
    useSelectedItemsStore();
  const { isLoading, data }: ClothingPositionQueryType = useApi(
    "get",
    "outfit/recommended"
  );

  function handleSelect(item) {
    setSelectedPast(item);
  }

  async function handleConfirm() {
    try {
      const response = await axios.get(
        `${BASE_URL}/outfit/recommended/pastOutfit?scheduleId=${selectedPast.schedule.scheduleId}`,
        {
          headers: {
            "User-ID": localStorage.getItem("token"),
          },
        }
      );
      console.log("==========");
      console.log(response.data);
      const simpleClothesData = response.data.dataBody.map((item) => ({
        clothingId: item.clothingId,
        clothingName: item.clothingName,
        clothingImagePath: item.clothingImagePath,
      }));

      console.log("simpleclothesdata");
      console.log(simpleClothesData);
      simpleClothesData.forEach((item) => {
        toggleItem(item);
        console.log("item", item);
        console.log(selectedItems);
      });

      setConfirmOutfit(selectedPast.schedule.outfitImagePath);
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
    navigate("/calendar/confirmoutfit");
  }

  async function handleEdit() {
    try {
      const response = await axios(
        `${BASE_URL}/outfit/recommended/pastOutfit?scheduleId=${selectedPast.schedule.scheduleId}`,
        {
          headers: {
            "User-ID": localStorage.getItem("token"),
          },
        }
      );
      const simpleClothesData = response.data.dataBody.map((item) => ({
        clothingId: item.clothingId,
        clothingName: item.clothingName,
        clothingImagePath: item.clothingImagePath,
      }));

      simpleClothesData.forEach((item) => {
        toggleItem(item);
        console.log(selectedItems);
      });
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
    navigate("/calendar/makeoutfit");
  }

  if (isLoading) return <Loader />;

  return (
    <>
      <Header>
        <IconBack onClick={() => navigate("/calendar")} />
        <p className="title">내 과거 코디에서 고르기</p>
        <IconEdit onClick={() => handleEdit()} />
        <IconCheck onClick={() => handleConfirm()} />
      </Header>
      <Content>
        {data.map((item) => {
          return (
            <Item
              key={item.schedule.scheduleId}
              onClick={() => {
                handleSelect(item);
              }}
            >
              <span className="date">
                {moment(item.schedule.date).format("M월 DD일 (dd)")}
              </span>
              <div
                className="keyword"
                style={{
                  backgroundColor:
                    situationcolor[item.schedule.scheduleCategory],
                }}
              >
                {item.schedule.scheduleCategory}
              </div>
              <div className="weather">
                <IconSmallWeather id={item.weather.icon} />
                {item.weather.highestTemperature}°C /{" "}
                {item.weather.lowestTemperature}°C
              </div>
              <div
                className={
                  selectedPast === item ? "imgarea selected" : "imgarea"
                }
              >
                <img
                  src={item.schedule.outfitImagePath}
                  alt={item.schedule.date}
                />
              </div>
            </Item>
          );
        })}
      </Content>
    </>
  );
}

export default Past;

const Header = styled.div`
  height: 8dvh;
  ${({ theme }) => theme.common.flexCenter};
  background-color: white;
  padding: 10px 8px 0 8px;
  width: 100%;
  position: fixed;
  max-width: 450px;
  min-width: 320px;

  .title {
    font-weight: bold;
    margin-left: auto;
    margin-right: auto;
  }
`;

const Content = styled.div`
  padding-top: 8dvh;
  padding-bottom: 12dvh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  background-color: ${(props) => props.theme.colors.backgroundcolor};
`;

const Item = styled.div`
  width: 100%;
  padding: 10px 10px;

  .selected {
    filter: contrast(0.5);
  }

  .date {
    font-size: 1.2rem;
    margin-right: 1rem;
  }

  .keyword {
    display: inline-block;
    border-radius: 5px;
    padding: 5px 5px;
    color: #aaaaaa;
    font-size: 0.7rem;
  }

  .weather {
    font-size: 0.8rem;
    color: gray;
    display: flex;
    align-items: center;
    margin-bottom: 3px;
  }

  .imgarea {
    width: 100%;
    aspect-ratio: 1/1;
    height: auto;
    border-radius: 10px;
    background-color: #9db49d;

    img {
      width: 100%;
      object-fit: fill;
    }
  }
`;
