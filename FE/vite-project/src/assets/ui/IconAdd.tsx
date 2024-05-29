import { IconProp } from "@/types/IconProp";

function IconAdd({ onClick }: IconProp) {
  return (
  <svg 
    width="26" 
    height="26" 
    viewBox="0 0 26 26" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
  <circle 
    cx="13" 
    cy="13" 
    r="13" 
    fill="#D9D9D9"
  />
  <path 
    fillRule="evenodd" 
    clipRule="evenodd"
    d="M14.5 7C14.5 6.17157 13.8284 5.5 13 5.5C12.1716 5.5 11.5 6.17157 11.5 7V12H6.5C5.67157 12 5 12.6716 5 13.5C5 14.3284 5.67157 15 6.5 15H11.5V20C11.5 20.8284 12.1716 21.5 13 21.5C13.8284 21.5 14.5 20.8284 14.5 20V15H19.5C20.3284 15 21 14.3284 21 13.5C21 12.6716 20.3284 12 19.5 12H14.5V7Z"
      fill="white"
      />
  </svg>
  );
}

export default IconAdd;
