import { Header, DetailContent } from "./ClosetStyle";
import IconBack from "@/assets/ui/IconBack";
import { useNavigate, useParams } from "react-router-dom";
import { useDetailClothes } from "@/hooks/useApi";
import { Loader } from "@/components/Loader";
import { DetailClothesResponseDataType } from "@/types/ClothesTypes";
import { useEffect, useReducer } from "react";
import {
  ACTION_TYPES,
  initialState,
  clothesreducer,
} from "@/reducers/updateClothesReducer";
import { useDeleteClothes } from "@/hooks/useDeleteClothes";

interface DetailClothesResponseType {
  isLoading: boolean;
  data: DetailClothesResponseDataType;
}

const DetailClothes = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [value, dispatch] = useReducer(clothesreducer, initialState);

  const { isLoading, data }: DetailClothesResponseType = useDetailClothes(
    "get",
    `clothing/${id}`,
    id
  );

  useEffect(() => {
    if (data) {
      dispatch({ type: ACTION_TYPES.set, payload: data });
    }
  }, [data]);
  const { deletemutate } = useDeleteClothes();

  const handleGoBack = () => {
    navigate("/closet");
    // deletemutate(id);
  };

  const handleDelete = () => {
    deletemutate(id);
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Header>
        <IconBack onClick={handleGoBack} />
        <p className="title">옷 상세</p>
      </Header>

      {value ? (
        <DetailContent>
          <div className="imgarea">
            <img src={value.clothingImgPath} alt="" />
          </div>
          <div className="textarea">
            <div className="line">
              <span className="label">별칭</span>
              <span className="value">{value.clothingName}</span>
            </div>
            <div className="line">
              <span className="label">카테고리</span>
              <span className="value">{value.category}</span>
            </div>
            <div className="line">
              <span className="label">소재</span>
              <span className="value">{value.textures.join(", ")}</span>
            </div>
            <div className="line">
              <span className="label">월</span>
              <span className="value">
                {value.seasons.map((month) => `${month}월 `).join(", ")}
              </span>
            </div>
            <div className="line">
              <span className="label">스타일</span>
              <span className="value">
                {value.styles.map((keyword) => `${keyword}`).join(", ")}
              </span>
            </div>
            <div className="line">
              <span className="label">같이 입는 사람</span>
              <span className="value">
                {value.sharedUsers.map((item) => item.userName).join(", ")}
              </span>
            </div>
          </div>
          {data.isMyClothing ? (
            <div className="btnarea">
              <button
                className="btn edit"
                onClick={() => navigate(`/closet/update/${id}`)}
              >
                수정하기
              </button>
              <button className="btn delete" onClick={handleDelete}>
                삭제하기
              </button>
            </div>
          ) : (
            <></>
          )}
        </DetailContent>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default DetailClothes;
