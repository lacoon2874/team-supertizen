import { useState, useEffect } from 'react';
import CurrentLocate from './CurrentLocate';
import { useLocateStore } from '@/store/LocateStore';
import LocateWeather from './LocateWeather';
import { Loader } from "@/components/Loader";


function HomeLocate() {
    // 저장소 불러오기
    const { Sido, Sigungu } = useLocateStore()

    // 현재 좌표 정보
    const [latitude, setLatitude] = useState<number>(null)
    const [longitude, setLongitude] = useState<number>(null)


    // 현재위치를 잡기위한 hook(Sido, Sigungu 초기화 시)
    useEffect(() => {
        if (Sido === '' || Sigungu === '') {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLatitude(position.coords.latitude)
                        setLongitude(position.coords.longitude)
                    }
                )
            }
        }   
    }, [Sido, Sigungu])
  
    // Sido, Sigungu가 비워져있으며, 현재 좌표를 얻었을 때
    // 현재 좌표를 통해 Sido, Sigungu를 업데이트
    if ((latitude !== null && longitude !== null) && (Sido == '' || Sigungu == '')) {
        return (
            <div>
                <CurrentLocate latitude={latitude} longitude={longitude}/>
            </div>
        )
    // Sido, Sigungu가 비워져있으며, 현재 좌표를 얻지 못했을 때
    } else if ((latitude === null || longitude === null) && (Sido == '' || Sigungu == '')) {
        return (
            <div>
                <Loader/>
            </div>
        )
    // Sido, Sigungu가 존재할 때
    } else {
        return (
          <LocateWeather/>
        )
    }

}


export default HomeLocate;