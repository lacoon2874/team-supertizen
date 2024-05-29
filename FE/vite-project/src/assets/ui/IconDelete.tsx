type IconProp = {
  onClick: () => void;
};

function IconDelete({ onClick }: IconProp) {
    return (
      <svg 
      width="25" 
      height="25" 
      viewBox="0 0 13 13" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}>
      <circle 
      cx="6.5" 
      cy="6.5" 
      r="6.5" 
      fill="#FB7171"
      />
      <rect 
      x="2" 
      y="5" 
      width="9" 
      height="3" 
      fill="white"
      />
      </svg>
    );
  }
  
  export default IconDelete;
  