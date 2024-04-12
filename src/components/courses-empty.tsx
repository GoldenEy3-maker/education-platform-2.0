import { type Role } from "@prisma/client";
import { useSession } from "next-auth/react";

type CoursesEmptyProps =
  | {
      icon: React.ReactNode;
      text: React.ReactNode;
      textBasedOnRole: false;
    }
  | {
      icon: React.ReactNode;
      text: Record<Exclude<Role, "Admin">, React.ReactNode>;
      textBasedOnRole: true;
    };

export const CoursesEmpty: React.FC<CoursesEmptyProps> = ({
  icon,
  text,
  textBasedOnRole,
}) => {
  const { data: session } = useSession();

  const excludeUserRole = (role: Role | undefined) => {
    if (role === "Teacher") return "Teacher";

    return "Student";
  };

  const role = excludeUserRole(session?.user.role);

  return (
    <div className="col-span-4 mx-auto flex max-w-[40rem] flex-col items-center justify-center p-6">
      {icon}
      {textBasedOnRole ? text[role] : text}
    </div>
  );
};
