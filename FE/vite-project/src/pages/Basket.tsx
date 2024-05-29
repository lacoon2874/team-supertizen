import Layout from "@/components/Layout";
import { Header } from "@/sections/closet/ClosetStyle";
import BasketState from "@/sections/basket/BasketState";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function Basket() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Layout>
      <Header style={{ textAlign: "center" }}>
        모아보기 <HideButton onClick={handleLogout}>로그아웃</HideButton>
      </Header>
      <BasketState />
    </Layout>
  );
}

export default Basket;

const HideButton = styled.button`
  border: none;
  background-color: white;
  color: #f0efef;
  position: absolute;
  top: 0;
  right: 0;
`;
