import { BASE_URL } from "@/config/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useDeleteSchedule() {
  const userToken = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const { data, mutate } = useMutation({
    mutationFn: (data: string) => {
      return axios({
        method: "delete",
        url: `${BASE_URL}/calendar?date=${data}`,
        headers: {
          "User-ID": userToken,
        },
      }).then((res) => res.data);
    },
    onSuccess: () => {
      // InvalidateQueryFilters 객체를 사용하는 예시
      queryClient.invalidateQueries({
        queryKey: ["calendarData"],
        // 필요한 경우, 여기에 더 많은 필터 옵션을 추가할 수 있습니다.
      });
    },
  });

  return { deletedata: data, deletemutate: mutate };
}
