import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { cities } from './LocationInfo'
import { useLocateStore } from '@/store/LocateStore';


interface SelectProps {
  onClick: () => void;
}


const ScrollableComponent = ({ onClick }: SelectProps) => {
  
  const { Sido, Sigungu, ChangeLocateInfo } = useLocateStore()

  const [selectedSiDo, setSelectedSiDo] = useState<string>(Sido);
  const [selectedSiGunGu, setSelectedSiGunGu] = useState<string>(Sigungu);
  const [selectedLocateInfo, setSelectedLocateInfo] = useState<number>(cities[selectedSiDo][selectedSiGunGu])
  
  const SiDoList: string[] = Object.keys(cities)
  let SiGunGuList: string[] = Object.keys(cities[selectedSiDo])
  

  const handleSiDo = (sido: string) => {
    SiGunGuList =  Object.keys(cities[sido])
    setSelectedSiDo(sido);
  };

  const handleSiGunGu = (sigungu: string) => {
    setSelectedSiGunGu(sigungu);
    setSelectedLocateInfo(cities[selectedSiDo][sigungu])
  };

  const mounted = useRef<boolean>(false)

  useEffect(() => {
    if (mounted.current) {
      ChangeLocateInfo(selectedSiDo, selectedSiGunGu, selectedLocateInfo)
      onClick()
    }
    mounted.current = true
  }, [selectedLocateInfo]);
  
  return (
    <CustomSelects>
      <CustomScrollBar>
        {SiDoList.map((sido, index) => {
          return (
            <SiDoSelectBox 
            key={index} 
            onClick={() => handleSiDo(sido)} 
            selected={selectedSiDo === sido}>
              {sido}
            </SiDoSelectBox>
          )
        })}
      </CustomScrollBar>
      <CustomScrollBar>
        {SiGunGuList.map((sigungu, index) => {
          return (
            <SiGunGuSelectBox 
            key={index} 
            onClick={() => {
              handleSiGunGu(sigungu)
            }} 
            selected={selectedLocateInfo == cities[selectedSiDo][sigungu]}>
              {sigungu}
            </SiGunGuSelectBox>
          )
        })}
      </CustomScrollBar>
    </CustomSelects>
  );
};

export default ScrollableComponent;


const CustomScrollBar = styled.div`
  max-height: 200px;
  overflow-y: auto;
  width: 100%;

`;

const CustomSelects = styled.div`
  background: #ffffff;
  display: flex;
`;

const SiDoSelectBox = styled.div<{ selected: boolean }>`
background: ${props => (props.selected ? 'lightblue' : 'transparent')};
padding: 0.5rem;
border-radius: 6px;

`;

const SiGunGuSelectBox = styled.div<{ selected: boolean }>`
background: ${props => (props.selected ? 'lightblue' : 'transparent')};
padding: 0.5rem;
border-radius: 6px;

`;