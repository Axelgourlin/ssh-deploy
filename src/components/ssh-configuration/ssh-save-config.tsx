import { useCallback, useState } from "react";
import { SSHConfigType } from "./ssh-config";
import { Button } from "../ui/button";
import { TypographyP } from "../ui/typography-p";
import { Separator } from "../ui/separator";
import { ProcessStatusIcon } from "../common/process-status-icon";
import { FileDownloadOutlineIcon } from "../icons/file-download-outline";
import { toast } from "sonner";

interface SaveConfigBtnProps {
  config: SSHConfigType;
  isNewConfig: boolean;
  setIsNewConfig: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SaveConfigBtn = ({
  config,
  isNewConfig,
  setIsNewConfig,
}: SaveConfigBtnProps) => {
  const [testingIconStatus, setTestingIconStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // TODO: This is a mock implementation. In a real app, you would replace this with invoke tauri method.
  const handleSaveConfig = useCallback(() => {
    setTestingIconStatus("loading");
    if (isNewConfig) {
      // Here you would typically save the new config to a backend or local storage
      setIsNewConfig(false);
    }
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // Simulate success or failure
      if (!isSuccess) {
        setTestingIconStatus("error");
        toast.error("Failed to save SSH configuration. Please try again.");
        return;
      }
      setTestingIconStatus("success");
      toast.success("SSH configuration saved successfully!");
    }, 1000);
  }, [config, isNewConfig, setIsNewConfig]);

  return (
    <Button
      variant="outline"
      onClick={() => handleSaveConfig()}
      className="flex justify-between"
    >
      <TypographyP className="w-3/4">
        {isNewConfig ? "Save Config" : "Update Config"}
      </TypographyP>
      <Separator orientation="vertical" />
      <div className="w-1/10">
        <ProcessStatusIcon
          customIdleIcon={<FileDownloadOutlineIcon />}
          testingIconStatus={testingIconStatus}
        />
      </div>
    </Button>
  );
};
