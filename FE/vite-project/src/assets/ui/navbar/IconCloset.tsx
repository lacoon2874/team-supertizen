import styled from "styled-components";
import { NavbarUITypes } from "types/smartNavbarUi/smartNavbarUi";
import { theme } from "@/styles/theme";

export default function IconCloset({ isactive }: NavbarUITypes) {
  return (
    <NavMenu>
      <svg
        viewBox="0 0 24 24"
        fill={isactive ? theme.colors.pointcolor : theme.colors.grey}
        height="2em"
        width="2em"
        opacity={isactive ? 1 : 0.6}
      >
        <path d="M13 10.551v-.678A4.005 4.005 0 0016 6c0-2.206-1.794-4-4-4S8 3.794 8 6h2c0-1.103.897-2 2-2s2 .897 2 2-.897 2-2 2a1 1 0 00-1 1v1.551l-8.665 7.702A1.001 1.001 0 003 20h18a1.001 1.001 0 00.664-1.748L13 10.551zM5.63 18L12 12.338 18.37 18H5.63z" />
      </svg>
      <div
        className="name"
        style={{
          color: isactive ? theme.colors.pointcolor : theme.colors.grey,
        }}
      >
        옷장
      </div>
    </NavMenu>
  );
}

const NavMenu = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  row-gap: 0.5rem;

  .name {
    opacity: 0.7;
    font-size: 0.7rem;
  }
`;
