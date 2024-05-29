import BottomNavBar from "./BottomNavBar";
import styled from "styled-components";
import { theme } from "@/styles/theme";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <Container>
      <main>{props.children}</main>
      <BottomNavBar />
    </Container>
  );
};

export default Layout;

const Container = styled.div`
  background-color: ${theme.colors.backgroundcolor};
  width: 100%;
  height: 100dvh;
  position: relative;
  box-sizing: border-box;

  ::-webkit-scrollbar {
    display: none;
  }

  main::-webkit-scrollbar {
    display: none;
  }
`;
