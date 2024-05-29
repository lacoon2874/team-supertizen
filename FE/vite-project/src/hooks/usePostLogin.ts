import { BASE_URL } from "@/config/config";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type dataType = {
  email: string;
  password: string;
};

export function usePostLogin() {
  const navigate = useNavigate();

  const { data, mutate } = useMutation({
    mutationFn: (data: dataType) => {
      return axios({
        method: "post",
        url: `${BASE_URL}/users`,
        // headers: {
        //   "User-ID": userToken,
        // },
        data: data,
      }).then((res) => res.data);
    },

    onSuccess: (data) => {
      const userId = data.dataBody.userId;
      console.log("mutation data", data);
      localStorage.clear();
      localStorage.setItem("token", userId);
      navigate(`/smarthome`);
    },
    onError: () => {
      window.alert("아이디 혹은 비밀번호가 일치하지 않습니다.");
    },
  });

  return { data, mutate };
}
