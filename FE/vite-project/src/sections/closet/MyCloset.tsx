import { Header, ClosetContent, Item, Filter } from "./ClosetStyle";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { Loader } from "@/components/Loader";
import { SimpleClothesResponseDataType } from "@/types/ClothesTypes";

const CATEGORY = ["전체", "상의", "하의", "아우터", "치마", "바지"];
const SORT = ["최근 등록 순", "오래된 순", "많이 입은 순"];

interface ApiResponseType {
  isLoading: boolean;
  data: SimpleClothesResponseDataType[];
}

const MyCloset = () => {
  const navigate = useNavigate();

  const handleDetailClick = (id: number) => {
    navigate(`/closet/${id}`);
  };

  const { isLoading, data }: ApiResponseType = useApi("get", "clothing");
  if (isLoading) return <Loader />;
  return (
    <>
      <Header>
        <p className="title">내 옷장</p>
        <Filter>
          <select className="category" name="category">
            <option style={{ textAlign: "center" }} hidden>
              카테고리
            </option>
            {CATEGORY.map((item) => {
              return (
                <option value={item} key={item}>
                  {item}
                </option>
              );
            })}
          </select>
          <select className="category">
            <option style={{ textAlign: "center" }} hidden>
              정렬
            </option>
            {SORT.map((item) => {
              return (
                <option value={item} key={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </Filter>
      </Header>

      <ClosetContent>
        {data.map((item) => {
          return (
            <Item
              key={item.clothingId}
              onClick={() => handleDetailClick(item.clothingId)}
            >
              <div className="imgarea">
                <img src={item.clothingImagePath} alt={item.clothingName} />
              </div>
            </Item>
          );
        })}
      </ClosetContent>
    </>
  );
};

export default MyCloset;
