type CourseEmptyTabProps = {
  icon: React.ReactNode;
  text: React.ReactNode;
};

export const CourseEmptyTab: React.FC<CourseEmptyTabProps> = ({
  text,
  icon,
}) => {
  return (
    <div className="mx-auto flex max-w-[40rem] flex-col items-center justify-center p-6">
      {icon}
      <div className="mt-2 text-center">{text}</div>
    </div>
  );
};
