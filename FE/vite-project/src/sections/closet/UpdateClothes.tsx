import { Header, UpdateContent } from "./ClosetStyle";
import IconBack from "@/assets/ui/IconBack";
import IconCloseSmall from "@/assets/ui/IconCloseSmall";
import { useEffect, useState, useReducer } from "react";
import { theme } from "@/styles/theme";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { Loader } from "@/components/Loader";
import DropDown from "./DropDown";
import SharedUsers from "./SharedUsers";
import { DetailClothesResponseDataType } from "@/types/ClothesTypes";
import {
  ACTION_TYPES,
  initialState,
  clothesreducer,
} from "@/reducers/updateClothesReducer";
import { usePatchClothes } from "@/hooks/usePatchClothes";
interface DetailClothesResponseType {
  isLoading: boolean;
  data: DetailClothesResponseDataType;
}

const MONTH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const UpdateClothes = () => {
  const { id } = useParams();
  const { mutate } = usePatchClothes();
  const [value, dispatch] = useReducer(clothesreducer, initialState);
  const { isLoading, data }: DetailClothesResponseType = useApi(
    "get",
    `clothing/${id}`
  );

  const [viewCategory, setViewCategory] = useState(false);
  const [viewTexture, setViewTexture] = useState(false);
  const [viewStyle, setViewStyle] = useState(false);
  const [viewSharedUsers, setViewSharedUsers] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      dispatch({ type: ACTION_TYPES.set, payload: data });
    }
  }, [data]);

  const handleGoBack = () => {
    navigate(`/closet/${id}`);
  };

  const handleKeyUp = (event) => {
    const { value } = event.target;
    const key = event.key;
    switch (key) {
      case "Enter":
        dispatch({ type: ACTION_TYPES.updateClothingName, payload: value });
        break;
      default:
    }
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    dispatch({ type: ACTION_TYPES.updateClothingName, payload: value });
  };

  const handleBlur = (event) => {
    const { value } = event.target;
    dispatch({ type: ACTION_TYPES.updateClothingName, payload: value });
  };

  // const { mutate } = usePatchClothes();
  const handleDispatch = (actionType, value) => {
    dispatch({ type: actionType, payload: value });
  };

  const handleFinish = () => {
    const putData = {
      clothingId: value.clothingId,
      clothingName: value.clothingName,
      category: value.category,
      textures: value.textures,
      styles: value.styles,
      seasons: value.seasons,
      sharedUserIds: value.sharedUsers.map((user) => user.userId),
    };
    mutate({ id, putData });
  };
  if (isLoading) return <Loader />;

  return (
    <>
      <Header>
        <IconBack onClick={handleGoBack} />
        <p className="title">옷 정보 수정</p>
      </Header>
      <UpdateContent>
        <div className="titlearea">
          <span className="title">별칭</span>
        </div>
        <input
          type="text"
          defaultValue={value.clothingName}
          onChange={handleInputChange}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
        />
        <div className="titlearea">
          <span className="title">카테고리</span>
        </div>
        <div
          className="input"
          onClick={() => {
            setViewCategory(!viewCategory);
          }}
        >
          {value.category} <span>{viewCategory ? "▲" : "▼"}</span>
          {viewCategory && (
            <DropDown type="category" handleDispatch={handleDispatch} />
          )}
        </div>

        <div className="titlearea">
          <span className="title">소재</span>
          {value.textures.map((item) => {
            return (
              <span
                key={item}
                className="tag"
                onClick={() => handleDispatch(ACTION_TYPES.deleteTexture, item)}
              >
                {item}
                <IconCloseSmall />
              </span>
            );
          })}
        </div>
        <div
          className="input"
          onClick={() => {
            setViewTexture(!viewTexture);
          }}
        >
          선택해주세요 <span>{viewTexture ? "▲" : "▼"}</span>
          {viewTexture && (
            <DropDown type="texture" handleDispatch={handleDispatch} />
          )}
        </div>

        {/* <input
          className="texture"
          value={inputTexture}
          onChange={(e) => handleTextureInput(e)}
          onFocus={() => setViewTexture(true)}
          onBlur={() => setViewTexture(false)}
        ></input> */}

        <div className="titlearea">
          <span className="title">월</span>
        </div>
        <div className="month">
          {MONTH.map((item) => {
            const isSelected = value.seasons.some((m) => {
              return item === m;
            });
            return (
              <button
                key={item}
                onClick={() => handleDispatch(ACTION_TYPES.toggleMonth, item)}
                className="month-tag"
                style={{
                  backgroundColor: isSelected
                    ? theme.colors.pointcolor
                    : theme.colors.backgroundcolor,
                  color: isSelected ? "white" : "black",
                }}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="titlearea">
          <span className="title">스타일</span>{" "}
          {value.styles.map((item) => {
            return (
              <span
                key={item}
                className="tag"
                onClick={() => handleDispatch(ACTION_TYPES.deleteStyle, item)}
              >
                {item}
                <IconCloseSmall />
              </span>
            );
          })}
        </div>
        <div
          className="input"
          onClick={() => {
            setViewStyle(!viewStyle);
          }}
        >
          선택해주세요 <span>{viewStyle ? "▲" : "▼"}</span>
          {viewStyle && (
            <DropDown type="style" handleDispatch={handleDispatch} />
          )}
        </div>

        <div className="titlearea">
          <span className="title">같이 입는 사람</span>{" "}
          {value.sharedUsers.map((item) => {
            return (
              <span
                key={item.userId}
                className="tag"
                onClick={() =>
                  handleDispatch(ACTION_TYPES.deleteSharedUsers, item.userId)
                }
              >
                {item.userName}
                <IconCloseSmall />
              </span>
            );
          })}
        </div>
        <div
          className="input"
          onClick={() => {
            setViewSharedUsers(!viewSharedUsers);
          }}
        >
          같이 입는 사람을 골라주세요 <span>{viewSharedUsers ? "▲" : "▼"}</span>
          {viewSharedUsers && <SharedUsers handleDispatch={handleDispatch} />}
        </div>

        <button className="finish" onClick={handleFinish}>
          {" "}
          완료{" "}
        </button>
      </UpdateContent>
    </>
  );
};

export default UpdateClothes;
