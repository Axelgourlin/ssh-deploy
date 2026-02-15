import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckIcon } from "../icons/check";
import { CancelIcon } from "../icons/cancel";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";
import { AccessPointIcon } from "../icons/access-point";

const preRegisteredHosts = [
  "10.10.100.33",
  "10.10.100.210",
  "10.10.100.211",
  "10.10.100.213",
  "10.10.100.214",
];

export const SSHConfigContainer = () => {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("22");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [testingIconStatus, setTestingIconStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleTestConnection = () => {
    console.log("Testing connection to", host);
    setTestingIconStatus("loading");
    setTimeout(() => {
      const isSuccess = Math.random() > 0.5; // Simulate success or failure
      setTestingIconStatus(isSuccess ? "success" : "error");
    }, 1000);
  };

  return (
    <CardContent>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="host">Host</FieldLabel>
          <div className="flex gap-2">
            <Select value={host} onValueChange={setHost}>
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
            {host === "custom" || !preRegisteredHosts.includes(host) ? (
              <Input
                placeholder="Enter custom host IP"
                value={host === "custom" ? "" : host}
                onChange={(e) => setHost(e.target.value)}
              />
            ) : null}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="user">User</FieldLabel>
            <Input
              id="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="username"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="port">Port</FieldLabel>
            <Input
              id="port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="22"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          <Field className="justify-end w-2/3">
            <Button
              variant="outline"
              onClick={handleTestConnection}
              className="flex justify-between"
            >
              <p className="w-3/4"> Test Connection</p>
              <Separator orientation="vertical" />
              <div className="w-1/10">
                <TestingIconHandler testingIconStatus={testingIconStatus} />
              </div>
            </Button>
          </Field>
        </div>
      </FieldGroup>
    </CardContent>
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
