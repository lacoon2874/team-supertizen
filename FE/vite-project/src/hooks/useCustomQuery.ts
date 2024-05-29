import { useQuery } from "@tanstack/react-query";
import { fetchTodayWeather, fetch5daysWeather, fetchLocate } from "@/hooks/useCustomAPI";



export const useTodayWeather = (locateKey: number) => {
    return useQuery({
        queryKey: ['weather1day'],
        queryFn: () => fetchTodayWeather(locateKey),
    })
};


export const use5daysWeather = (locateKey: number, language: string) => {
    return useQuery({
        queryKey: ['weather5days'],
        queryFn: () => fetch5daysWeather(locateKey, language),
    });
};

export const useLocate = (latitude: number, longitude: number,) => {
    return useQuery({
        queryKey: ['locate'],
        queryFn: () => fetchLocate(latitude, longitude),
    });
};


// export const useSchedule = (date:Date) => {
//     return useQuery({
//         queryKey: ['schedule'],
//         queryFn: () => fetchSchedule(date),
//     });
// };