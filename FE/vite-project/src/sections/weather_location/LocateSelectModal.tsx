import styled from "styled-components";
import ScrollableComponent from "./ScrollCustom";
import { useLocateStore } from "@/store/LocateStore";


interface ModalProps {
    onClick: () => void;
}


const LocateSelectModal = ({ onClick }: ModalProps) => {
  const {ChangeLocateInfo} = useLocateStore()
  const currentLocate = () => {
    ChangeLocateInfo('', '', 0)
  }

  return (
    <ModalWrap>
        <ModalBackGround onClick={onClick}>
        </ModalBackGround>
        <ModalContainer>
            <div>
                <button onClick={currentLocate}>현재 위치</button>
            </div>
        <ScrollableComponent onClick={onClick}/>
        </ModalContainer>
    </ModalWrap>
);
};

export default LocateSelectModal;

const ModalWrap = styled.div`
  position: fixed;
  top: 0;
  left:0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
`;

const ModalContainer = styled.div`
  border-radius: 2rem;
  transform: translate(-50%, -50%);
  top: 25%;
  left: 50%;
  border: 1px solid var(--color-white);
  background-color: var(--color-white);
  position: absolute;
  width: 80%;
`;

const ModalBackGround = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100vh;
  position: absolute;
  bottom: 0;
  left: 0;
`;