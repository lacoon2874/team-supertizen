import styled from "styled-components";
import ClothesImage from "@/components/CLothesImage";
import IconDelete from "@/assets/ui/IconDelete";
import IconAdd from "@/assets/ui/IconAdd";
import { useCurrentClothesStore } from "@/store/CurrentClothesStore";
import HomeLocate from "../weather_location/HomeLocate";
import { Loader } from "@/components/Loader";
import { useState } from "react";
import AddCurrentClothesPage from "./AddCurrentClothes";
import { usePatchPastToday } from "@/hooks/usePatchPastToday";


interface CurrentProps {
    isloading : boolean,
    iserror : boolean
}

interface LastItemProps {
    $isLastItem : boolean
}

interface Clothes {
    clothingId: number,
    clothingImagePath: string,
    clothingName: string,
  }


const FixCurrentClothes = ({isloading, iserror}: CurrentProps) => {

    const { CurrentClothesList, ChangeAddClothesList, DeleteCurrentClothes } = useCurrentClothesStore()

    const [addPage, setAddPage] = useState<boolean>(false)

    const {mutate, isError, isPending, data} = usePatchPastToday()

    const saveList = () => {
        console.log('aaaa')
        const putData = CurrentClothesList.map((item) => item.clothingId)
        console.log(putData)
        mutate({putData:putData})
    }


    // 여기는 모달방식 느낌으로 가자
    const moveAddClothes = () => {
        setAddPage(true)
        // addlist초기화
        ChangeAddClothesList([])
    };

    const outAddClothes = () => {
        setAddPage(false)
      };
    // 들어올 때 api를 보내거나 응답을 받기

    const testRFIDResponse = {isPending: false, isError: false, data:{outfit_list: [1, 2, 3,]}}
    const deleteItem = (item:Clothes) => {
        DeleteCurrentClothes(item)
    }

    return (
        <div>
            {
            !addPage ? 
            <div>
                <HomeLocate />
                {
                (isloading || iserror ) ?  
                <Loader/> 
                : 
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
                                            <DeleteIconContainer>
                                                <IconDelete onClick={() => deleteItem(item)}/>
                                            </DeleteIconContainer>
                                        </Clothes>
                                    )
                                })
                            )
                        }
                        </ClothesList>
                        <AddBox>
                            <IconAdd onClick={moveAddClothes}/>
                        </AddBox>
                    </InfoContainer>
                    <GreenButton onClick={saveList}>확정하기</GreenButton>
                </Container>
                }
            </div> 
            :
            <div>
                <AddCurrentClothesPage onClick={outAddClothes}/>
            </div>
            }
        </div>
    );
};

export default FixCurrentClothes;


const Container = styled.div`
width: 95%;
margin: auto;
background-color: #ffffff;
border-radius: 1rem;
box-sizing: border-box;
position: relative;
text-align:center;

`

const DeleteIconContainer = styled.div`
position: absolute;
top: 0;
right: 0;
transform: translate(10%, -10%);
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
max-width: 85%;
margin: 0 auto;
overflow-x: auto
`

const AddBox = styled.div`
padding: 1rem;
flex: 1;
min-width: 15%;
min-height: calc(15vh + 1rem);
display: flex;
justify-content: center;
align-items: center;
`

const Clothes = styled.div<LastItemProps>`
  height: 15vh;
  min-width: 15vh;
  margin: 0.5rem ${({ $isLastItem }) => ($isLastItem ? '0.2rem' : '1rem')} 0.5rem 0;
  position: relative;
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