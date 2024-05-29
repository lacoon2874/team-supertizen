import React, { useState } from "react";
import styled from "styled-components";
import SamsungLogo from "@/assets/ui/samsungLogo";
import { useNavigate } from "react-router-dom";

const TERMS = [
  "이용 약관",
  "특별 약관",
  "개인 정보 수집 및 이용 ",
  "삼성 맞춤형 서비스 이용하기(선택)",
];

export default function Agreement() {
  const navigate = useNavigate();

  // 모든 체크박스의 상태를 관리하는 상태 변수를 추가합니다.
  const [isChecked, setIsChecked] = useState(Array(TERMS.length).fill(false));

  // 모든 체크박스를 체크하거나 해제하는 함수를 추가합니다.
  const handleAllCheck = (e) => {
    setIsChecked(isChecked.map(() => e.target.checked));
  };

  // 각 체크박스를 개별적으로 제어하는 함수를 추가합니다.
  const handleSingleCheck = (position) => {
    const updatedCheckedState = isChecked.map((item, index) =>
      index === position ? !item : item
    );
    setIsChecked(updatedCheckedState);
  };

  return (
    <Container>
      <SamsungLogo />
      <p className="title">Smart Clothing Care+</p>

      {TERMS.map((item, index) => {
        return (
          <div className="question" key={item}>
            <StyledCheckBox
              type="checkbox"
              checked={isChecked[index]}
              onChange={() => handleSingleCheck(index)}
            />
            <div className="textarea">
              <p className="description">{item}</p>
              <span className="link">자세히 보기</span>
            </div>
          </div>
        );
      })}

      <div className="question">
        <StyledCheckBox
          type="checkbox"
          // 모든 항목이 체크되었는지 검사합니다.
          checked={isChecked.every(Boolean)}
          // 마지막 체크박스를 클릭하면 모든 체크박스의 상태를 변경합니다.
          onChange={handleAllCheck}
        />
        <div className="textarea">
          <p className="description">위의 내용을 모두 읽었으며</p>
          <p className="description">이에 동의합니다.</p>
        </div>
      </div>
      <ButtonGroup>
        <Button1>취소</Button1>
        <Button2 onClick={() => navigate("/home")}>동의</Button2>
      </ButtonGroup>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: white;
  box-sizing: border-box;
  padding: 6rem 2rem 1rem 2rem;

  .title {
    font-size: 1.9rem;
    color: ${(props) => props.theme.colors.blue};
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .question {
    display: flex;
    margin: 1rem 0rem 1rem 1rem;
  }

  .textarea {
    margin-left: 1rem;
  }

  .description {
    margin-bottom: 7px;
    display: flex;
    flex-wrap: wrap;
  }

  .link {
    font-weight: 600;
    border-bottom: 1px solid black;
  }
`;

const ButtonGroup = styled.div`
  height: 10dvh;
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 1rem;
`;

const Button1 = styled.button`
  width: 20%;
  background-color: #e8e8e8;
  border: none;
  color: black;
  border-radius: 30px;
  height: 3rem;
  font-size: 0.8rem;
  font-weight: bold;
`;

const Button2 = styled.button`
  width: 70%;
  border: none;
  background-color: ${(props) => props.theme.colors.blue};
  color: white;
  border-radius: 30px;
  height: 3rem;
  font-size: 0.8rem;
  font-weight: bold;
`;

const StyledCheckBox = styled.input`
  appearance: none;
  width: 24px;
  height: 24px;
  border: 1.5px solid gainsboro;
  border-radius: 50%;

  &:checked {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: ${(props) => props.theme.colors.blue};
  }
`;
