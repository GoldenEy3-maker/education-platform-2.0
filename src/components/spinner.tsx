import React from "react";

type SpinnerProps = {
  strokeWidth?: number;
};

const SIZE = 44;

export const Spinner: React.FC<SpinnerProps> = ({ strokeWidth = 3.6 }) => {
  return (
    <svg
      className="block animate-rotate-spinner"
      width="1em"
      height="1em"
      viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="animate-rotate-spinner-circle"
        fill="none"
        strokeDasharray="80px 200px"
        strokeDashoffset={0}
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
