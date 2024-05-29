import { NavbarUITypes } from "types/smartNavbarUi/smartNavbarUi";

export default function Menu({ isactive }: NavbarUITypes) {
  return (
    <svg
      fill="none"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={isactive ? 1 : 0.6}
      viewBox="0 0 24 24"
      height="2em"
      width="2em"
    >
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}
