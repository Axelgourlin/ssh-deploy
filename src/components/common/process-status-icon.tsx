import { CheckIcon } from "../icons/check";
import { CancelIcon } from "../icons/cancel";
import { Spinner } from "../ui/spinner";
import { AccessPointIcon } from "../icons/access-point";

export const ProcessStatusIcon = ({
  testingIconStatus,
  customIdleIcon = null,
}: {
  testingIconStatus: "idle" | "loading" | "success" | "error";
  customIdleIcon?: React.ReactNode;
}) => {
  switch (testingIconStatus) {
    case "loading":
      return <Spinner />;
    case "success":
      return <CheckIcon className="text-green-500 animate-icon-pop" />;
    case "error":
      return <CancelIcon className="text-red-500 animate-icon-pop" />;
    default:
      return customIdleIcon ?? <AccessPointIcon />;
  }
};
