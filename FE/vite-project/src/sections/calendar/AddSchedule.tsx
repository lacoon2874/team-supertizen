import styled from "styled-components";
import IconClose from "@/assets/ui/IconClose";
import { situation } from "./config-schedule";
import { useState } from "react";
import { theme } from "@/styles/theme";
import { useNavigate } from "react-router-dom";
import { useSelectedDateStore } from "@/store/DateStore";
import { useSelectedItemsStore } from "@/store/ClothesStore";
interface propType {
  isWithinNextFiveDays: boolean;
  selected: string | null;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddSchedule = ({
  selected,
  setPopup,
  isWithinNextFiveDays,
}: propType) => {
  const navigator = useNavigate();
  const close = () => {
    setPopup(false);
  };

  const { title, setTitle, selectedKeyword, setSelectedKeyword } =
    useSelectedDateStore();

  const { clearItems } = useSelectedItemsStore();

  const [selectedSituation, setSelectedSituation] =
    useState<string>(selectedKeyword);

  const handleButtonClick = (itemName: string) => {
    if (selectedSituation === itemName) {
      setSelectedSituation(""); // 이미 선택된 상황을 다시 클릭하면 선택을 취소
    } else {
      setSelectedSituation(itemName); // 새로운 상황 선택
      setSelectedKeyword(itemName);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <AddSKEDPopUp>
      <Container>
        <IconClose onClick={close} />
        <p className="date">{selected}</p>
        <div className="buttongroup">
          {situation.map((item) => (
            <button
              className="situation"
              key={item.name}
              onClick={() => handleButtonClick(item.name)}
              style={{
                backgroundColor:
                  selectedSituation === item.name ? theme.colors.grey : "white",
                color:
                  selectedSituation === item.name ? "white" : theme.colors.grey,
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
        <input
          className="forminput"
          type="text"
          placeholder="일정 제목(선택)"
          onChange={handleInputChange}
          defaultValue={title}
        />
        <GreenButton
          onClick={() => {
            if (selectedKeyword) {
              clearItems();
              navigator("makeoutfit");
            } else {
              window.alert("상황 하나 이상 선택해주세요");
            }
          }}
        >
          옷장에서 고르기
        </GreenButton>
        <GreenButton
          onClick={() => {
            if (selectedKeyword) {
              clearItems();
              navigator("past");
            } else {
              window.alert("상황 하나 이상 선택해주세요");
            }
          }}
        >
          과거 코디에서 고르기
        </GreenButton>
        {isWithinNextFiveDays && (
          <GreenButton
            onClick={() => {
              if (selectedKeyword) {
                clearItems();
                // console.log(selectedKeyword);
                navigator(`recommend`);
              } else {
                window.alert("상황 하나 이상 선택해주세요");
              }
            }}
          >
            코디 추천 받기
          </GreenButton>
        )}
      </Container>
    </AddSKEDPopUp>
  );
};

const AddSKEDPopUp = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: visible;
  max-width: 450px;
  min-width: 320px;
  justify-content: center;
  /* align-items: center; */
  ${({ theme }) => theme.common.flexCenterColumn}
`;

const Container = styled.div`
  width: 80%;
  background-color: white;
  box-sizing: border-box;
  padding: 1rem 1rem;
  border-radius: 1rem;
  ${({ theme }) => theme.common.flexCenterColumn}

  .box {
    margin-top: 1rem;
  }

  svg {
    align-self: flex-end;
  }

  .date {
    align-self: baseline;
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  .situation {
    border: 1px solid ${theme.colors.grey};
    border-radius: 1rem;
    margin: 3px 5px;
    box-sizing: border-box;
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 0.9rem;
  }

  input {
    font-size: large;
    margin-top: 1rem;
    width: 100%;
    height: 2rem;
    border-bottom: 1px solid grey;
    transition: border-bottom-width 0.2s ease, border-bottom-color 0.5s ease;
  }

  input::placeholder {
    color: lightgrey;
  }
`;

const GreenButton = styled.button`
  ${({ theme }) => theme.common.PointButton};
  width: 70%;
  height: 2.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;
