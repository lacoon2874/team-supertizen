import styled from "styled-components";
import { useMLApi } from "@/hooks/usePostRecommendedOutfitt";
import { useLocateStore } from "@/store/LocateStore";
import { useState } from "react";
import IconRe from "@/assets/ui/IconRe";
import { Loader } from "@/components/Loader";
import ClothesImage from "@/components/CLothesImage";
import { useNavigate } from "react-router-dom";


interface Clothes {
    clothing_id: number,
    clothing_img_path: string,
    clothing_name: string,
}

interface LastItemProps {
    $isLastItem: boolean
}


const HaveSchedule = () => {
    const {LocateInfo} = useLocateStore()
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\./g, '-').replace(/\s/g, '').slice(0, -1);
    
    
    const [rate, setRate] = useState<number>(0)
    
    const navigate = useNavigate()

    // const { data:MLdata, isLoading:MLisLoding, isError:MLisError } = useMLApi("get", "test", { rate: rate.toString(), date: formattedDate,  locate: LocateInfo.toString(), schedule:'없음', count: "1"});
    // const { data:MLdata, isLoading:MLisLoding, isError:MLisError } = useMLApi("get", `test/${rate.toString()}/${formattedDate}/${LocateInfo.toString()}/없음/${1}`);

    // const MLdata = useMLApi("get", `test/${rate.toString()}/${formattedDate}/${LocateInfo.toString()}/없음/${1}`)
    
    const { data:MLdata, isLoading:MLisLoding, isError:MLisError } = useMLApi("get", `test/${rate.toString()}/${formattedDate}/${LocateInfo.toString()}/없음/${1}`, 'MLQ');

    const moveAddSchedule = () => {navigate(`/calendar`)}


    const addRate = () => {
        if (MLdata[0].length == 0 && rate == 0) {
            console.log('ddd')
        } else if (rate == 0) {
            setRate(0)
        } else
        {
            setRate(rate + 1)
        }
    }

    // 여기는 해당 리스트를 가지고 일정 등록하기 이동으로 가자
    const test = () => {
        console.log('bla')
    }
    

    
    if (MLisLoding || MLisError) {
        return (
            <Loader/>
        )
    } else {
        if (MLdata) {
            console.log('출력', MLdata)
            if (MLdata[0].length != 0) {
        const clothesData = MLdata.map(item => item[1])
        return (
        <Container>
            
            <Message>오늘 같은 날씨에 제안합니다
                <Re>
                    <IconRe onClick={addRate}/>
                </Re>
            </Message>
            <CoordiList onClick={test}>
                {(MLisError || MLisLoding) ? <Loader/> :  
                    (
                        // 
                        clothesData.map((item:Clothes, index:number) => {
                            console.log(clothesData)
                            const isLastItem = (index === MLdata.length - 1)
                            return (
                                <Coordi $isLastItem={isLastItem} key={index}>
                                    <ClothesImage clothingId={item.clothing_id} clothingImagePath={item.clothing_img_path} clothingName={item.clothing_name}/>
                                </Coordi>
                            )
                        })
                     )
                }
            </CoordiList>
            <GreenButton onClick={moveAddSchedule}>오늘 일정 등록하기</GreenButton>
 
        </Container>
        )
    } else {
        return (
            <Container>
                <Message>오늘 같은 날씨에 제안합니다</Message>
                <NotEnough>
                    <span>아직 충분한 데이터가 없습니다!</span>
                </NotEnough>
                <GreenButton onClick={moveAddSchedule}>오늘 일정 등록하기</GreenButton>
    
            </Container>
        )
    }
    }
}
};

export default HaveSchedule;


const Container = styled.div`
position: relative;
height : 100%
    
`

const Message = styled.div`
text-align:center;
padding: 1rem;
font-size: 1.2rem;
font-weight: bolder;
color: black;
`

const NotEnough = styled.div`
width: 95%;
margin: 0 auto;
`

const CoordiList = styled.div`
display: flex;
width: 95%;
margin: 0 auto;
overflow-x: auto
`

const Re = styled.div`
    position: absolute;
    right: 1rem;
    top: 1rem;
`


const Coordi = styled.div<LastItemProps>`
  height: 15vh;
  min-width: 15vh;
  ${({ $isLastItem }) => $isLastItem ? `margin: 0 0 0.7rem 0;` : `margin: 0 1rem 0.7rem 0;`}
`;

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
