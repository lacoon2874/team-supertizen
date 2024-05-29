import styled from "styled-components";
import { NavbarUITypes } from "types/smartNavbarUi/smartNavbarUi";
import { theme } from "@/styles/theme";

export default function IconCalendar({ isactive }: NavbarUITypes) {
  return (
    <NavMenu>
      <svg
        viewBox="0 0 16 16"
        fill={isactive ? theme.colors.pointcolor : theme.colors.grey}
        height="1.7em"
        width="1.7em"
        opacity={isactive ? 1 : 0.6}
      >
        <path
          fill={isactive ? theme.colors.pointcolor : theme.colors.grey}
          d="M5 6h2v2H5zm3 0h2v2H8zm3 0h2v2h-2zm-9 6h2v2H2zm3 0h2v2H5zm3 0h2v2H8zM5 9h2v2H5zm3 0h2v2H8zm3 0h2v2h-2zM2 9h2v2H2zm11-9v1h-2V0H4v1H2V0H0v16h15V0h-2zm1 15H1V4h13v11z"
        />
      </svg>
      <div
        className="name"
        style={{
          color: isactive ? theme.colors.pointcolor : theme.colors.grey,
        }}
      >
        캘린더
      </div>
    </NavMenu>
  );
}

const NavMenu = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  row-gap: 0.7rem;

  .name {
    opacity: 0.7;
    font-size: 0.7rem;
  }
`;
