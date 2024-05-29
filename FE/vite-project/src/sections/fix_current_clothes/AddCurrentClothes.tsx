import { useApi } from "@/hooks/useApi";
import { Loader } from "@/components/Loader";
import { SimpleClothesResponseDataType } from "@/types/ClothesTypes";
import styled from "styled-components";
import ClothesImage from "@/components/CLothesImage";
import { useCurrentClothesStore } from "@/store/CurrentClothesStore";
import IconDelete from "@/assets/ui/IconDelete";
import IconBack from "@/assets/ui/IconBack";
import ClothesDetail from "./DetailClothes";
import { useState } from "react";


const CATEGORY = ["전체", "상의", "하의", "아우터", "치마", "바지"];
const SORT = ["최근 등록 순", "오래된 순", "많이 입은 순"];

interface ApiResponseType {
  isLoading: boolean;
  data: SimpleClothesResponseDataType[];
}

interface Clothes {
  clothingId: number,
  clothingImagePath: string,
  clothingName: string,
}

interface NameAreaProps {
    fontSize: string;
}


interface LastItemProps {
  $isLastItem : boolean
}

interface ItemListProps {
  $isItmeList : boolean
}

interface ModalProps {
  onClick: () => void;
}


const AddCurrentClothesPage = ({ onClick }: ModalProps) => {
    const {AddClothesList, CurrentClothesList, AddCurrentClothes, ChangeCurrentClothesList, DeleteAddCurrentClothes} = useCurrentClothesStore()

    const isItmeList = (0 !== AddClothesList.length)

    const handleDetailClick = (clothes: Clothes) => {
      AddCurrentClothes(clothes)
    };

    const isItemBlinded = (item:Clothes) => {
      const isCurrent = CurrentClothesList.find(findItem => findItem.clothingId === item.clothingId);
      const isAdded = AddClothesList.find(findItem => findItem.clothingId === item.clothingId);
      return !!isCurrent || !!isAdded;
    };

    const confirmed = () => {
      ChangeCurrentClothesList([...CurrentClothesList, ...AddClothesList])
      onClick()
    }

    const deleteItem = (item:Clothes) => {
      DeleteAddCurrentClothes(item)
    }
    const [showDetail, setShowDetail] = useState(false);
    const [timerId, setTimerId] = useState(null);

    const handleMouseDown = () => {
      const id = setTimeout(() => {
        setShowDetail(true)
        console.log('test')
      }, 1200)
      setTimerId(id)
    };
  
    const handleMouseUp = () => {
      clearTimeout(timerId);
      setTimerId(null);
    };
  
    const closeModal = () => {
      setShowDetail(false);
    };


    const handleItemClick = (event, item:Clothes) => {
      if (isItemBlinded(item)) {
        event.stopPropagation();
        return;
      }
      handleDetailClick(item);
    };
  
    const { isLoading, data }: ApiResponseType = useApi("get", "clothing");
    if (isLoading) return <Loader />;
    const getFontSizeForName = (inputname:string) => {
        const length = inputname.length;
        if (length > 7) {
          return "0.8rem";
        } else {
          return "1.1rem";
        }
      };

    return (
      <>
        <Header>
        <button onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>sadfd</button>
          <Back>
            <IconBack onClick={onClick}/>
          </Back>
          <p className="title">추가하기</p>
          <Filter>
            <select className="category" name="category">
              <option style={{ textAlign: "center" }} hidden>
                카테고리
              </option>
              {CATEGORY.map((item) => {
                return (
                  <option value={item} key={item}>
                    <p>check</p>
                    {item}
                  </option>
                );
              })}
            </select>
            <select className="category">
              <option style={{ textAlign: "center" }} hidden>
                정렬
              </option>
              {SORT.map((item) => {
                return (
                  <option value={item} key={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </Filter>
        </Header>
        

        {showDetail && <ClothesDetail item={{clothingId:1, clothingName:'', clothingImagePath:''}} onClose={closeModal}/>}
        <ClosetContent $isItmeList={isItmeList}>
          {data.map((item) => { 
            return (
              <div key={item.clothingId} >
                
                <Item
                onClick={(event) => handleItemClick(event, item)}>
                    {isItemBlinded(item) && <Blinder></Blinder>}
                    <ImgArea>
                        <ClothesImage clothingId={item.clothingId} clothingImagePath={item.clothingImagePath} clothingName={item.clothingName} backgroundColor="rgba(69, 186, 140, 0)"/>
                    </ImgArea>
                    <NameArea fontSize={getFontSizeForName(item.clothingName)}>
                        {item.clothingName}
                    </NameArea>
                </Item>
              </div>
            );
          })}
        </ClosetContent>
        {
        AddClothesList.length ? <AddList>
          <Container>
            <InfoContainer>
                <ClothesList>
                  {
                      AddClothesList.map((item, index:number) => {
                          const isLastItem = (index === AddClothesList.length - 1)
                          return (
                              <Clothes key={index} $isLastItem={isLastItem}>
                                  <ClothesImage clothingId={item.clothingId} clothingImagePath={item.clothingImagePath} clothingName={item.clothingName}/>
                                  <DeleteIconContainer>
                                      <IconDelete onClick={() => deleteItem(item)}/>
                                  </DeleteIconContainer>
                              </Clothes>
                          )
                      })
                  }
                </ClothesList>
            </InfoContainer>
            <GreenButton onClick={confirmed}>추가하기</GreenButton>
          </Container>
        </AddList> : <div></div>
        }
      </>
    );
  };

export default AddCurrentClothesPage;

const Container = styled.div`
width: 95%;
margin: auto;
background-color: #ffffff;
box-sizing: border-box;
text-align: center;
`

const InfoContainer = styled.div`
display: flex;
margin: 0 0.5rem;
`

const ClothesList = styled.div`
display: flex;
max-width: 100%;
margin: 0;
overflow-x: auto
`

const DeleteIconContainer = styled.div`
position: absolute;
top: 0;
right: 0;
transform: translate(10%, -10%);
`

const Blinder = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1.2;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.4)

`

const Clothes = styled.div<LastItemProps>`
  height: 13vh;
  min-width: 13vh;
  margin: 0.5rem ${({ $isLastItem }) => ($isLastItem ? '0.2rem' : '1rem')} 0.5rem 0;
  position: relative;
`


const ClosetContent = styled.div<ItemListProps>`
  padding: 3rem 0.7rem ${({ $isItmeList }) => ($isItmeList ? '45dvh' : '12dvh')} 0.7rem;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background-color: ${(props) => props.theme.colors.backgroundcolor};
  gap: 0.3rem;
  position: relative;
`;

const Back = styled.div`
  position: fixed;
  z-index: 2;
  top: 3vh;
  left: 0;
  transform: translate(0, -50%);
`

const Header = styled.div`
  width: 100%;
  height: 6dvh;
  position: sticky;
  z-index: 1;
  top: 0;
  ${({ theme }) => theme.common.flexCenter};
  background-color: white;
  padding: 10px 8px 0 8px;
  max-width: 450px;
  min-width: 320px;

  .title {
    font-weight: bold;
    margin-left: auto;
    margin-right: auto;
  }
`;

const Item = styled.div`
  width: 100%;
  height: 100%;
  aspect-ratio: 1/1.2;
  border-radius: 10px;
  position: relative;
  background-color: ${(props) =>
    `${props.theme.colors.pointcolor
      .replace("rgb", "rgba")
      .replace(")", ", 0.2)")}`};

`
const ImgArea = styled.div`
    width: 100%;
    aspect-ratio: 1/1;
`
const NameArea = styled.div<NameAreaProps>`
  font-weight: 600;
  width: 100%;
  aspect-ratio: 1/0.2;
  font-size: ${(props) => props.fontSize};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align : center;
`


const Filter = styled.div`
  position: absolute;
  top: 6dvh;
  left: 0;

  select {
    margin: 5px 5px;
    padding: 5px 5px;
    border-radius: 4px;
    outline: 0 none;
  }

  select option {
    background: ${(props) => props.theme.colors.backgroundcolor};
    color: grey;
    padding: 3px 0px;
    font-size: 12px;
    border: 1px solid grey;
  }
`

const AddList = styled.div`
  padding: 1rem;  
  position: fixed;
  bottom: 12dvh;
  width: 100%;
  background-color: #ffffff;
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