import styled from "styled-components"


interface Clothes {
    clothingId: number,
    clothingImagePath: string,
    clothingName: string,
  }


interface ModalProps {
    onClose: () => void;
    item: Clothes
}


// 모달 컴포넌트 (여러분의 모달 구조에 맞게 조정하세요)
const ClothesDetail = ({ onClose, item }:ModalProps) => (
  <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
    <p>모달 컨텐츠</p>
    <AAA className="asdfsa">
        asdfsafsafsafa
    </AAA>
    {item.clothingId}
    <button onClick={onClose}>닫기</button>
  </div>
);

export default ClothesDetail;


const AAA = styled.div`
background-color: #ffffff;
height: 500px;
`