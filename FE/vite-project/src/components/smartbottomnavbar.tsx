import styled from "styled-components";
import smartNavConfig from "./config-smartbottomnavbar";
import { useNavigate } from "react-router-dom";

function SmartBottomNavbar() {
  // const location = useLocation();
  const navigate = useNavigate();

  return (
    <NavContainer>
      {smartNavConfig.map(({ Icon, path, title, name }) => {
        const isActive = false;
        return (
          <NavMenu key={title} onClick={() => navigate(path)}>
            <Icon isactive={isActive} />
            <p className="name">{name}</p>
          </NavMenu>
        );
      })}
    </NavContainer>
  );
}

export default SmartBottomNavbar;

const NavContainer = styled.div`
  width: 100%;
  height: 12dvh;
  background-color: #94a1cb;
  position: absolute;
  bottom: 0;
  display: flex;
  box-sizing: border-box;
  justify-content: space-around;
  padding-bottom: 1.5rem;
`;

const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 0.5rem;

  .name {
    color: white;
    opacity: 0.7;
    font-size: 0.7rem;
  }
`;
// { navConfig.map(
//   (
//     (title, path, icon)
//   ) => {
//     const isActiveItem = item.path.includes(item.path); // 현재 path를 포함하는지 여부 확인
//     const isOnlyActive = activeIndex === index; // 무조건 하나만 active 상태인지 여부 확인
//     const isactive = !!(isActiveItem && isOnlyActive); // path 일치하고, 무조건 하나만 active인 경우에만 true

//     return (
//       <div
//         key={index}
//         onClick={() => handleItemClick(index)}
//         // isactive={isactive}
//       >
//         {item.icon({ isactive: isactive })}
//       </div>
//     );
//   }
// )}
