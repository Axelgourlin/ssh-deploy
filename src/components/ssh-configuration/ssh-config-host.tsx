import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SSHConfigType } from "./ssh-config";

const preRegisteredHosts = [
  "10.10.100.33",
  "10.10.100.210",
  "10.10.100.211",
  "10.10.100.213",
  "10.10.100.214",
];

interface SshConfigHostProps {
  onHostChange: (host: string) => void;
  sshConfig: SSHConfigType | null;
}

export const SshConfigHost = ({
  onHostChange,
  sshConfig,
}: SshConfigHostProps) => {
  const handleHostChange = useCallback(
    (newHost: string) => {
      onHostChange(newHost);
    },
    [onHostChange],
  );

  return (
    <div className="flex gap-2">
      <Select
        value={
          sshConfig && preRegisteredHosts.includes(sshConfig.host)
            ? sshConfig.host
            : "custom"
        }
        onValueChange={handleHostChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select host" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {preRegisteredHosts.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom...</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {sshConfig?.host === "custom" ||
      !preRegisteredHosts.includes(sshConfig?.host ?? "") ? (
        <Input
          placeholder="Enter custom host IP"
          value={sshConfig?.host === "custom" ? "" : (sshConfig?.host ?? "")}
          onChange={(e) => handleHostChange(e.target.value)}
        />
      ) : null}
    </div>
  );
};
