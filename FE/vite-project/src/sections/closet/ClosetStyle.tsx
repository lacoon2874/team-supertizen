// ${(props) => props.theme.colors.pointcolor};
import styled from "styled-components";

export const Filter = styled.div`
  position: absolute;
  top: 6dvh;
  left: 0;

  select {
    margin: 5px 5px;
    padding: 5px 5px;
    border-radius: 4px;
    outline: 0 none;
  }

  select option {
    background: ${(props) => props.theme.colors.backgroundcolor};
    color: grey;
    padding: 3px 0px;
    font-size: 12px;
    border: 1px solid grey;
  }
`;

export const ClosetContent = styled.div`
  padding-top: 2rem;
  padding-bottom: 12dvh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background-color: ${(props) => props.theme.colors.backgroundcolor};
`;

export const Item = styled.div`
  width: 100%;
  padding: 5px 5px;

  .imgarea {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    aspect-ratio: 1/1;
    height: auto;
    border-radius: 10px;
    background-color: ${(props) =>
      `${props.theme.colors.pointcolor
        .replace("rgb", "rgba")
        .replace(")", ", 0.2)")}`};

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      object-position: center;
    }
  }

  .keyword {
    margin-top: 4px;
    text-align: center;
  }
`;

export const Header = styled.div`
  width: 100%;
  height: 6dvh;
  position: sticky;
  top: 0;
  ${({ theme }) => theme.common.flexCenter};
  background-color: white;
  padding: 10px 8px 0 8px;
  max-width: 450px;
  min-width: 320px;

  .title {
    font-weight: bold;
    margin-left: auto;
    margin-right: auto;
  }
`;

export const DetailContent = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  padding-top: 1rem;
  padding-bottom: 13dvh;
  width: 100%;
  background-color: ${(props) => props.theme.colors.backgroundcolor};

  .imgarea {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    aspect-ratio: 1/1;
    height: auto;
    border-radius: 10px;
    background-color: #9bceb4;
    padding: 10px 10px;

    img {
      width: 100%;
      object-fit: fill;
    }
  }

  .textarea {
    margin-top: 1rem;
    padding: 1rem 1rem 0 1rem;
    width: 90%;
    background-color: white;
    border-radius: 10px;
    ${({ theme }) => theme.common.flexCenterColumn};
  }

  .line {
    width: 95%;
    border-bottom: 1px solid #45ba8c3d;
    padding-bottom: 7px;
    margin-bottom: 1rem;
    display: flex;
  }

  .label {
    flex: 4;
    color: ${(props) => props.theme.colors.pointcolor};
    font-size: 1rem;
    line-height: 1.5;
  }

  .value {
    padding: 0 0;
    flex: 6;
    color: grey;
    font-size: 1rem;
    line-height: 1.5;
  }

  .btnarea {
    width: 100%;
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .btn {
    border: none;
    width: 40%;
    height: 3rem;
    color: white;
    padding: 0.7rem 1rem;
    border-radius: 40px;
  }

  .edit {
    background-color: ${(props) => props.theme.colors.pointcolor};
  }

  .delete {
    background-color: #cab0ae;
  }
`;

export const UpdateContent = styled.div`
  background-color: white;
  overflow-y: scroll;
  padding: 1rem 1rem 13dvh 1rem;
  margin: 1rem auto;
  width: 98%;
  border-radius: 10px;
  ${({ theme }) => theme.common.flexCenterColumn};

  .titlearea {
    width: 100%;
    border-bottom: 1px solid black;
    padding-bottom: 9px;
    font-weight: bold;
  }

  .tag {
    font-size: 1rem;
    box-sizing: border-box;
    margin-left: 10px;
    position: relative;
    font-weight: 400;
    padding: 7px 10px;
    opacity: 0.6;
    border-radius: 8px;
    line-height: 1.5rem;
    background-color: ${(props) => props.theme.colors.pointcolor};
  }

  input {
    outline: none;
    border: none;
    background-color: ${(props) => props.theme.colors.backgroundcolor};
    font-size: large;
    margin: 8px 0px 1.8rem 0px;
    box-sizing: border-box;
    padding: 0px 10px 0px 10px;
    width: 100%;
    height: 3rem;
    border-radius: 15px;
    font-size: 1.1rem;
    position: relative;

    .texture {
      margin-bottom: 0;
    }
  }

  .input {
    outline: none;
    border: none;
    background-color: ${(props) => props.theme.colors.backgroundcolor};
    font-size: large;
    margin: 8px 0px 1.6rem 0px;
    box-sizing: border-box;
    padding: 0px 10px 0px 10px;
    width: 100%;
    height: 3rem;
    border-radius: 15px;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  .category-dropdown {
    position: absolute;
    top: 100%;
    left: 0; /* 왼쪽 정렬을 위해 설정 */
    width: 95%; /* 너비를 부모 컨테이너와 동일하게 설정 */
    background: white; /* 배경색 설정, 필요에 따라 수정 */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 드롭다운에 그림자 효과 추가 */
    z-index: 1000; /* 다른 요소들 위에 표시되도록 z-index 설정 */
    border-radius: 10px;
    max-height: 20dvh;
    overflow-y: scroll;

    li {
      height: 45px;
      font-size: 1rem;
      padding: 10px 0px 10px 15px;
      border-bottom: 1px solid lightgray;
    }
  }

  input:focus {
    border: 1px solid ${(props) => props.theme.colors.pointcolor};
  }

  .month {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    width: 100%;
    margin: 10px 0 20px 0;
  }

  .month-tag {
    border: none;
    background-color: aliceblue;
    padding: 13px 10px;
    margin: 4px 4px;
    border-radius: 5px;
    font-size: 1rem;
  }

  .finish {
    width: 80%;
    height: 3rem;
    ${({ theme }) => theme.common.PointButton};
  }

  .texture {
    margin-bottom: 0;
  }
`;
