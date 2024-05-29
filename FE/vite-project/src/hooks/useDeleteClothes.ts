import { BASE_URL } from "@/config/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function useDeleteClothes() {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const { data, mutate } = useMutation({
    mutationFn: (id: string) => {
      return axios({
        method: "delete",
        url: `${BASE_URL}/clothing/${id}`,
        headers: {
          "User-ID": userToken,
        },
      }).then((res) => res.data);
    },
    onSuccess: () => {
      // InvalidateQueryFilters 객체를 사용하는 예시
      queryClient.invalidateQueries({
        queryKey: ["clothes"],
        // 필요한 경우, 여기에 더 많은 필터 옵션을 추가할 수 있습니다.
      });
      navigate(`/closet`);
    },
  });

  return { deletedata: data, deletemutate: mutate };
}
