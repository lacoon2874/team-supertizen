import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";


export function useMLApi(method: string, url: string, querykey?: string) {
  const userToken = localStorage.getItem("token");

  const axiosRequestConfig: AxiosRequestConfig = {
    method: method,
    url: `https://j10s006.p.ssafy.io/ML-api/${url}`,
    headers: {
      "UserID": userToken,
    },
  };
  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: [querykey, url],
    queryFn: () => axios(axiosRequestConfig).then((res) => {
      console.log('응답코드', res.data)
      return res.data}),
    
    select: (res) => {
      console.log('응답',res['data'])
      return res['data']},
      
    // onSuccess: data => {
    //   // 성공시 호출
    //   console.log(data);
    // },
  }
  );
  return {
    isLoading,
    isError,
    data,
    isSuccess,
  };
}
