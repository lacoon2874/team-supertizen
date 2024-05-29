import styled from "styled-components";


interface CoordiProps {
    outfit: string; 
}


const CoordiImage = ({outfit}: CoordiProps) => {
    // 옷 리스트를 보내면 여기서 옷 상세정보 api 호출
    return (
        <Container>
            <img src={outfit} alt="" />
        </Container>
    );
};

export default CoordiImage;


const Container = styled.div`
background-color: #f5f5f5;
box-sizing: border-box;
width: 100%;
height: 100%;
border-radius: 1rem;
display: flex;
justify-content: center;
align-items: center;
img {
    max-width: 90%;
    max-height: 90%;
    display: block;
}
`