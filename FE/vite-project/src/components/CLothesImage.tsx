import styled from "styled-components";


interface Clothes {
    clothingId: number,
    clothingImagePath: string,
    clothingName: string,
    backgroundColor?: string
}

interface ColorProps {
    backgroundColor?: string
}



const ClothesImage = ({clothingId, clothingImagePath, clothingName, backgroundColor}: Clothes) => {
    // 옷 인덱스 보내면 여기서 옷 상세정보 api 호출
    console.log(clothingName)
    return (
        <Container backgroundColor={backgroundColor}>
            <img src={clothingImagePath} alt={clothingId.toString()} />
        </Container>
    );
};

export default ClothesImage;


const Container = styled.div<ColorProps>`
background-color: ${(props) => {return props.backgroundColor || '#f5f5f5'}}; 
box-sizing: border-box;
width: 100%;
height: 100%;
border-radius: 1rem;
padding: 0.5rem;
display: flex;
justify-content: center;
align-items: center;
overflow: hidden;
img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
  }

`
