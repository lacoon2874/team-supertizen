import styled from "styled-components";
import { hashtagOptions } from "../config-schedule";
import { useState } from "react";

type selectedHashtagType = string[];

const HashTag = () => {
  const [selectedHashtag, setSelectedHashtag] = useState<selectedHashtagType>(
    []
  );

  const handleButtonClick = (itemName: string) => {
    if (selectedHashtag.includes(itemName)) {
      setSelectedHashtag(selectedHashtag.filter((item) => item !== itemName));
    } else {
      setSelectedHashtag([...selectedHashtag, itemName]);
    }
  };

  return (
    <Wrapper>
      {selectedHashtag.length ? (
        <p className="title">선택된 태그</p>
      ) : (
        <p className="title">태그를 선택해주세요</p>
      )}

      {selectedHashtag.map((item) => {
        return (
          <button
            className="selected"
            key={item}
            onClick={() => handleButtonClick(item)}
          >
            # {item}
          </button>
        );
      })}
      <p className="title">코디 태그</p>
      {hashtagOptions.map((item) => {
        return (
          <button
            className="options"
            key={item.name}
            onClick={() => handleButtonClick(item.name)}
          >
            # {item.name}
          </button>
        );
      })}
    </Wrapper>
  );
};

export default HashTag;

const Wrapper = styled.div`
  align-self: self-start;

  .title {
    margin-top: 1rem;
  }

  button {
    border: none;
    padding: 6px 8px;
    margin: 5px 4px;
    border-radius: 3px;
  }

  .selected {
    background-color: grey;
    color: white;
  }

  .options {
    background-color: white;
    color: grey;
  }
`;
