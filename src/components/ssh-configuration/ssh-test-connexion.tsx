import { useState } from "react";

import { TestSshConnectionPayload } from "@/lib/bindings";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { testSshConnection } from "@/lib/sshApi";
import { ProcessStatusIcon } from "../common/process-status-icon";

export const TestConnectionBtn = ({
  host,
  port,
  username,
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
        username,
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
        <ProcessStatusIcon testingIconStatus={testingIconStatus} />
      </div>
    </Button>
  );
};
