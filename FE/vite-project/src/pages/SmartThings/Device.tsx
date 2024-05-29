import styled from "styled-components";
import IconBack from "@/assets/ui/IconBack";
import { useNavigate } from "react-router-dom";

export default function AddDevice() {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <IconBack onClick={() => navigate("/smarthome")} />
        <p className="title">기기 추가</p>
      </Header>

      <ButtonGroup>
        <Button>QR 코드 스캔</Button>
        <Button>주변 검색</Button>
      </ButtonGroup>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: white;
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 9dvh;
  box-sizing: border-box;
  padding: 4dvh 0.5rem 0 0.5rem; // 상 우 하 좌
  display: flex;
  align-items: center;
  column-gap: 1rem;

  .title {
    font-weight: bold;
  }
`;

const ButtonGroup = styled.div`
  position: absolute;
  bottom: 0;
  height: 20dvh;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  row-gap: 1rem;
`;

const Button = styled.button`
  width: 70%;
  border: none;
  background-color: #e8e8e8;
  color: black;
  border-radius: 20px;
  height: 2.5rem;
  font-size: 0.8rem;
  font-weight: bold;
`;
