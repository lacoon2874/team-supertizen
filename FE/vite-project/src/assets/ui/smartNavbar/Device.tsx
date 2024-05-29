import { NavbarUITypes } from "types/smartNavbarUi/smartNavbarUi";

export default function Device({ isactive }: NavbarUITypes) {
  return (
    <svg
      fill="none"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      height="2em"
      width="2em"
      opacity={isactive ? 1 : 0.6}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M5 4 H9 A1 1 0 0 1 10 5 V9 A1 1 0 0 1 9 10 H5 A1 1 0 0 1 4 9 V5 A1 1 0 0 1 5 4 z" />
      <path d="M15 4 H19 A1 1 0 0 1 20 5 V9 A1 1 0 0 1 19 10 H15 A1 1 0 0 1 14 9 V5 A1 1 0 0 1 15 4 z" />
      <path d="M5 14 H9 A1 1 0 0 1 10 15 V19 A1 1 0 0 1 9 20 H5 A1 1 0 0 1 4 19 V15 A1 1 0 0 1 5 14 z" />
      <path d="M14 17h6m-3-3v6" />
    </svg>
  );
}
