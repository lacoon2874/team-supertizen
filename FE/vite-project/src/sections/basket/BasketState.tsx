import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import styled from "styled-components";
import { Scrollbar } from "swiper/modules";
import { theme } from "@/styles/theme";
import { Loader } from "@/components/Loader";
import { useApi } from "@/hooks/useApi";

const MEMUS = [
  { id: 0, name: "전체" },
  { id: 1, name: "세탁기" },
  { id: 2, name: "에어드레서" },
];

type ClothingPositionType = {
  id: number;
  device: string;
  name: string;
  date: string;
  img: string;
};

interface ClothingPositionQueryType {
  isLoading: boolean;
  data: ClothingPositionType[];
}

const BasketState = () => {
  const [menu, setMenu] = useState(0);
  const { isLoading, data }: ClothingPositionQueryType = useApi(
    "get",
    "clothing/position"
  );

  if (isLoading) return <Loader />;

  return (
    <>
      <BasketContent>
        <div className="title">
          {MEMUS.map((item) => {
            return (
              <span
                key={item.id}
                style={{
                  color: menu === item.id ? "black" : theme.colors.lightgrey,
                  fontWeight: menu === item.id ? "bold" : "normal",
                }}
              >
                {item.name}
              </span>
            );
          })}
        </div>
        <Swiper
          scrollbar={{
            hide: false,
          }}
          modules={[Scrollbar]}
          className="mySwiper"
          onSlideChange={(swiper) => {
            setMenu(swiper.activeIndex);
          }}
        >
          <SwiperSlide>
            {data ? (
              data.map((item) => {
                return (
                  <Item key={item.id}>
                    <div className="imgarea">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="textarea">
                      <p className="message">
                        <span className="type">{item.device}</span>에
                        추가되었습니다.
                      </p>
                      <p className="name">{item.name}</p>
                      <p className="date">{item.date}</p>
                    </div>
                  </Item>
                );
              })
            ) : (
              <p>없습니다</p>
            )}
          </SwiperSlide>
          <SwiperSlide>
            {data.length ? (
              data.map((item) => {
                if (item.device === "세탁기")
                  return (
                    <Item key={item.id}>
                      <div className="imgarea">
                        <img src={item.img} alt={item.name} />
                      </div>
                      <div className="textarea">
                        <p className="message">
                          <span className="type">{item.device}</span>에
                          추가되었습니다.
                        </p>
                        <p className="name">{item.name}</p>
                        <p className="date">{item.date}</p>
                      </div>
                    </Item>
                  );
              })
            ) : (
              <p>없습니다</p>
            )}
          </SwiperSlide>
          <SwiperSlide>
            {data ? (
              data.map((item) => {
                if (item.device === "에어드레서")
                  return (
                    <Item key={item.id}>
                      <div className="imgarea">
                        <img src={item.img} alt={item.name} />
                      </div>
                      <div className="textarea">
                        <p className="message">
                          <span className="type">{item.device}</span>에
                          추가되었습니다.
                        </p>
                        <p className="name">{item.name}</p>
                        <p className="date">{item.date}</p>
                      </div>
                    </Item>
                  );
              })
            ) : (
              <p>없습니다</p>
            )}
          </SwiperSlide>
        </Swiper>
      </BasketContent>
    </>
  );
};

export default BasketState;

const BasketContent = styled.div`
  width: 100%;
  height: 73dvh;
  margin: 1rem auto;
  color: #000;

  .title {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    span {
      padding: 10px 0;
      font-size: 1rem;
      text-align: center;
    }
  }

  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    padding: 1rem 1rem;
    text-align: center;
    font-size: 18px;
    background: ${(props) => props.theme.colors.backgroundcolor};
    overflow-y: auto;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .mySwiper .swiper-scrollbar {
    top: 0; /* 스크롤바를 상단으로 이동 */
    bottom: auto; /* 기본 bottom 값 초기화 */
    height: 4px; /* 스크롤바의 높이 조정, 필요에 따라 수정 가능 */
  }
`;

const Item = styled.div`
  width: 100%;
  background-color: white;
  margin: 5px auto;
  padding: 5px 5px;
  border-radius: 10px;
  ${({ theme }) => theme.common.flexCenter};
  column-gap: 10px;

  .imgarea {
    flex: 3;
    background-color: aliceblue;
    border-radius: 10px;
  }

  .textarea {
    flex: 8;
    display: flex;
    flex-direction: column;
    align-items: baseline;
    row-gap: 4px;
  }

  .message {
    font-size: 0.9rem;
  }

  .type {
    color: ${(props) => props.theme.colors.pointcolor};
    font-size: 1rem;
    font-weight: 600;
  }

  .name {
    color: gray;
    font-size: 0.9rem;
  }

  .date {
    color: lightgray;

    font-size: 0.9rem;

    align-self: flex-end;
  }
`;
