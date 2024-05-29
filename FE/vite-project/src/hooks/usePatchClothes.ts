import { BASE_URL } from "@/config/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type dataType = {
  id: string;
  putData: {
    clothingId: number;
    clothingName: string;
    category: string;
    textures: string[];
    styles: string[];
    seasons: number[];
    sharedUserIds: number[];
  };
};

export function usePatchClothes() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("token");

  const { data, mutate } = useMutation({
    mutationFn: (data: dataType) => {
      const { id, putData } = data;

      return axios({
        method: "put",
        url: `${BASE_URL}/clothing/${id}`,
        headers: {
          "User-ID": userToken,
        },
        data: putData,
      }).then((res) => res.data);
    },
    onSuccess: (context, data) => {
      queryClient.invalidateQueries({
        queryKey: ["detail", data.id],
      });
      navigate(`/closet/${data.id}`);
    },
  });

  return { data, mutate };
}
