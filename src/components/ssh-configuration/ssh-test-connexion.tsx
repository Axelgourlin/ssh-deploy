import { useState } from "react";

import { TestSshConnectionPayload } from "@/lib/bindings";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { CheckIcon } from "../icons/check";
import { CancelIcon } from "../icons/cancel";
import { Spinner } from "../ui/spinner";
import { AccessPointIcon } from "../icons/access-point";
import { testSshConnection } from "@/lib/sshApi";

export const TestConnectionBtn = ({
  host,
  port,
  user,
  password,
}: TestSshConnectionPayload) => {
  const [testingIconStatus, setTestingIconStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleTestConnection = async (): Promise<void> => {
    console.log("Testing connection to", host);
    setTestingIconStatus("loading");
    try {
      const result = await testSshConnection({
        host,
        port,
        user,
        password,
      });
      if (result.status === "ok") {
        setTestingIconStatus("success");
      } else {
        setTestingIconStatus("error");
        console.error("SSH Connection Error:", result.error);
      }
    } catch (error) {
      console.error("Erreur SSH:", error);
      setTestingIconStatus("error");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={() => void handleTestConnection()}
      className="flex justify-between"
    >
      <p className="w-3/4"> Test Connection</p>
      <Separator orientation="vertical" />
      <div className="w-1/10">
        <TestingIconHandler testingIconStatus={testingIconStatus} />
      </div>
    </Button>
  );
};

const TestingIconHandler = ({
  testingIconStatus,
}: {
  testingIconStatus: "idle" | "loading" | "success" | "error";
}) => {
  switch (testingIconStatus) {
    case "loading":
      return <Spinner />;
    case "success":
      return <CheckIcon className="text-green-500 animate-icon-pop" />;
    case "error":
      return <CancelIcon className="text-red-500 animate-icon-pop" />;
    default:
      return <AccessPointIcon />;
  }
};
