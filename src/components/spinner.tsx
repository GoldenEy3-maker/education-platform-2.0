import React from "react";

type SpinnerProps = {
  strokeWidth?: number;
};

const SIZE = 44;

export const Spinner: React.FC<SpinnerProps> = ({ strokeWidth = 3.6 }) => {
  return (
    <svg
      className="animate-rotate-spinner block"
      width="1em"
      height="1em"
      viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="animate-rotate-spinner-circle [stroke-dasharray:80px,200px] [stroke-dashoffset:0]"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        cx={SIZE}
        cy={SIZE}
        r={(SIZE - strokeWidth) / 2}
        strokeWidth={strokeWidth}
      ></circle>
    </svg>
  );
};
