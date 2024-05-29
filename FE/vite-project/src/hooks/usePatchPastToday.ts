import { BASE_URL } from "@/config/config";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type dataType = {
  putData: number[]
};

export function usePatchPastToday() {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("token");

  const { data, mutate, isError, isPending } = useMutation({
    mutationFn: (data: dataType) => {
      const { putData } = data;

      return axios({
        method: "put",
        url: `${BASE_URL}/outfit/past/today`,
        headers: {
          "User-ID": userToken,
        },
        data: {'todayClothing':putData},
      }).then((res) => res.data);
    },
    onSuccess: () => {
      navigate(`/home`);
    },
  });

  return { data, mutate, isError, isPending };
}
