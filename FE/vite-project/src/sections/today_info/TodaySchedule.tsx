import styled from "styled-components";
import NoSchedule from "@/sections/today_info/NoSchedule";
import HaveSchedule from "@/sections/today_info/HaveSchedule";
import { useApi } from "@/hooks/useApi";
import { Loader } from "@/components/Loader";
import { useCurrentClothesStore } from "@/store/CurrentClothesStore";
import { useEffect } from "react";
import CurrentClothes from "./CurrentClothes";


const TodaySchedule = () => {

    const today = new Date();
    const formattedDate = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
    }).replace(/\./g, '-').replace(/\s/g, '').slice(0, -1);
    console.log('지금 날짜', formattedDate)


    const {
        isLoading: isLoadingDetail,
        isError: isErrorDetail,
        data: dataDetail
    } = useApi(
        "get",
        `calendar/date?date=${formattedDate}`
    );
    
    const {
        isLoading: isLoadingExists,
        isError: isErrorExists,
        data: dataExists
    } = useApi(
        "get",
        `calendar/exists?date=${formattedDate}`
    );
    // const dataExists = {scheduleExists:false}

    const { ChangeCurrentClothesList, CurrentClothesList } = useCurrentClothesStore()

    const {
        isLoading : isLoadingCurrent, 
        isError : isErrorCurrent, 
        data : dataCurrent
    } = useApi(
        "get",
        `outfit/past/today`
    );

    useEffect(() => {
        if (dataCurrent) {
            ChangeCurrentClothesList(dataCurrent);
        }
    }, [dataCurrent, ChangeCurrentClothesList]);

    if (isLoadingCurrent || isErrorCurrent) {
        return (
            <Loader/>
        )
    } else {
        if (CurrentClothesList.length == 0) {
            if (isLoadingExists || isErrorExists) {
                return (
                    <Loader/>
                )
            }
        
            if (dataExists) {
                if (!dataExists.scheduleExists) {
                    return (
                        <Container>
                            <NoSchedule/>
                        </Container>
                    )
                } else {
                    console.log('일정있음!')
                    
                    if (isLoadingDetail || isErrorDetail) {
                        return (
                            <Loader/>
                        )
                    }
        
                    return (
                        <Container>
                            {dataDetail && <HaveSchedule schedule={dataDetail.scheduleCategory} outfit={dataDetail.outfitImagePath}/>}
                        </Container>
                    )
                }
            }
        } else {
            return (<CurrentClothes/>)
        }
    }


    
};

export default TodaySchedule;


const Container = styled.div`
width: 95%;
margin: auto;
background-color: #ffffff;
border-radius: 1rem;
box-sizing: border-box;
text-align: center;
padding-bottom: 1rem;
margin-bottom: 30vh;

`
