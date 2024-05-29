import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/config/config";
import axios, { AxiosRequestConfig } from "axios";

export function useApi(method: string, url: string, querykey?: string) {
  const userToken = localStorage.getItem("token");

  const axiosRequestConfig: AxiosRequestConfig = {
    method: method,
    url: `${BASE_URL}/${url}`,
    headers: {
      "User-ID": userToken,
    },
  };
  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: [querykey, url],
    queryFn: () => axios(axiosRequestConfig).then((res) => res.data),
    select: (res) => res.dataBody,
  });
  return {
    isLoading,
    isError,
    data,
    isSuccess,
  };
}

export function useDetailClothes(method: string, url: string, id: string) {
  const userToken = localStorage.getItem("token");

  const axiosRequestConfig: AxiosRequestConfig = {
    method: method,
    url: `${BASE_URL}/${url}`,
    headers: {
      "User-ID": userToken,
    },
  };
  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ["detail", id],
    queryFn: () => axios(axiosRequestConfig).then((res) => res.data),
    select: (res) => res.dataBody,
    enabled: true,
    staleTime: 1,
  });
  return {
    isLoading,
    isError,
    data,
    isSuccess,
  };
}
