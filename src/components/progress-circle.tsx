type ProgressCircleProps = {
  className?: string;
  value?: number;
  strokeWidth?: number;
};

const SIZE = 44;

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  className,
  value = 20,
  strokeWidth = 3.6,
}) => {
  const radius = (SIZE - strokeWidth) / 2;
  const dashArray = 2 * Math.PI * radius;
  const dashOffset = ((100 - value) / 100) * (Math.PI * (radius * 2));

  return (
    <div
      className={className}
      role="progressbar"
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuemin={0}
    >
      <svg
        className="-rotate-90"
        width="1em"
        height="1em"
        viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}
      >
        <circle
          fill="none"
          cx={SIZE}
          cy={SIZE}
          r={(SIZE - strokeWidth) / 2}
          strokeWidth={strokeWidth}
          className="stroke-muted"
        ></circle>
        <circle
          fill="none"
          strokeLinecap="round"
          strokeDasharray={dashArray + "px"}
          strokeDashoffset={dashOffset}
          cx={SIZE}
          cy={SIZE}
          stroke="currentColor"
          r={(SIZE - strokeWidth) / 2}
          strokeWidth={strokeWidth}
        ></circle>
      </svg>
      <span className="sr-only">{value}%</span>
    </div>
  );
};
