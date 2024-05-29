import { useCurrentClothesStore } from "@/store/CurrentClothesStore";
import styled from "styled-components";
import ClothesImage from "@/components/CLothesImage";
import { useNavigate } from "react-router-dom";


interface LastItemProps {
    $isLastItem : boolean
}


const CurrentClothes = () => {
    const { CurrentClothesList } = useCurrentClothesStore()
    const testRFIDResponse = {isPending: false, isError: false, data:{outfit_list: [1, 2, 3,]}}
    const navigate = useNavigate()
    const changeCurrent = () => {
        navigate("/home/currentclothes")
    }

    return (
        <div>
            <div>

                <Container>
                    <Message>오늘 내가 입은 옷</Message>
                    <InfoContainer>
                        <ClothesList>
                        {!testRFIDResponse.isPending && !testRFIDResponse.isError && 
                            (
                                CurrentClothesList.map((item, index:number) => {
                                    const isLastItem = (index === CurrentClothesList.length - 1)
                                    return (
                                        <Clothes key={index} $isLastItem={isLastItem}>
                                            <ClothesImage clothingId={item.clothingId} clothingImagePath={item.clothingImagePath} clothingName={item.clothingName}/>
                                        </Clothes>
                                    )
                                })
                            )
                        }
                        </ClothesList>
                    </InfoContainer>
                    <GreenButton onClick={changeCurrent}>수정하기</GreenButton>
                </Container>
            </div> 
            
        </div>
    );
}; 

export default CurrentClothes;


const Container = styled.div`
position:relative;
width: 95%;
margin: auto;
background-color: #ffffff;
border-radius: 1rem;
box-sizing: border-box;
text-align: center;

`

const Message = styled.div`
text-align:center;
padding: 1rem;
font-size: 1.2rem;
font-weight: bolder;
color: #8d8d8d;
`

const InfoContainer = styled.div`
display: flex;
margin: 0 0.5rem;
`


const ClothesList = styled.div`
display: flex;
max-width: 100%;
margin: 0 auto;
overflow-x: auto
`

const Clothes = styled.div<LastItemProps>`
  height: 15vh;
  min-width: 15vh;
  margin: 0.5rem ${({ $isLastItem }) => ($isLastItem ? '0' : '1rem')} 0.5rem 0;
`

const GreenButton = styled.button`
    border: none;
    background-color: #45ba8c;
    color: white;
    border-radius: 40px;
    box-sizing: border-box;
    opacity: 0.7;
    width: 50%;
    padding: 1rem 1rem;
    margin: 0.5rem 0 1rem 0;
`;