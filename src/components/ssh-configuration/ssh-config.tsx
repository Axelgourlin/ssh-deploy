import { useCallback, useReducer, useState } from "react";

import { CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TestConnectionBtn } from "./ssh-test-connexion";
import { SshConfigHost } from "./ssh-config-host";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SaveConfigBtn } from "./ssh-save-config";

export interface SSHConfigType {
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
}

const preRegisteredConfigs: SSHConfigType[] = [
  { name: "Super Syno", host: "10.10.100.214", port: 22, username: "mofa" },
  { name: "Syno Test", host: "10.10.100.213", port: 22, username: "mofa" },
];

export const SSHConfig = () => {
  const [state, dispatch] = useReducer(sshConfigReducer, {
    name: "",
    host: "",
    port: 22,
    username: "",
    password: undefined,
  });

  const [isNewConfig, setIsNewConfig] = useState(true);

  const handleChange = useCallback(
    (field: keyof SSHConfigType, value: SSHConfigType[keyof SSHConfigType]) => {
      dispatch({ type: field, value });
      setIsNewConfig(true);
    },
    [],
  );

  const handleSelectSshConfig = useCallback((value: string) => {
    const config = preRegisteredConfigs.find((c) => c.name === value);
    if (config) {
      (Object.keys(config) as (keyof SSHConfigType)[]).forEach((field) => {
        dispatch({ type: field, value: config[field] });
      });
      setIsNewConfig(false);
    }
  }, []);

  return (
    <CardContent>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="name">Configuration Name</FieldLabel>
            <Input
              id="name"
              placeholder="e.g. My Server"
              value={state.name ?? ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="ssh-config-select">
              Select Configuration
            </FieldLabel>
            <Select
              value={isNewConfig ? "New Config" : state.name}
              onValueChange={handleSelectSshConfig}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select host" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {preRegisteredConfigs.map((config) => (
                    <SelectItem key={config.name} value={config.name}>
                      {config.name}
                    </SelectItem>
                  ))}
                  {isNewConfig && (
                    <SelectItem value="New Config">New Config</SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="host">Host</FieldLabel>
            <SshConfigHost
              onHostChange={(newHost) => handleChange("host", newHost)}
              sshConfig={state}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="port">Port</FieldLabel>
            <Input
              id="port"
              value={state.port}
              onChange={(e) => handleChange("port", Number(e.target.value))}
              placeholder="22"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="user">User</FieldLabel>
            <Input
              id="username"
              value={state.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="username"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              value={state.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="••••••••"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4 align-between">
          <Field className="w-[200px]">
            <TestConnectionBtn
              host={state.host}
              port={state.port}
              username={state.username}
              password={state.password ?? ""}
            />
          </Field>
          <Field className="w-[200px]  justify-end">
            <SaveConfigBtn
              config={state}
              isNewConfig={isNewConfig}
              setIsNewConfig={setIsNewConfig}
            />
          </Field>
        </div>
      </FieldGroup>
    </CardContent>
  );
};

const sshConfigReducer = <T extends Partial<SSHConfigType>>(
  state: T,
  action: {
    type: keyof SSHConfigType;
    value: SSHConfigType[keyof SSHConfigType];
  },
) => {
  switch (action.type) {
    case "name":
      return { ...state, name: action.value ?? state.name };
    case "host":
      return { ...state, host: action.value ?? state.host };
    case "port":
      return { ...state, port: action.value ?? state.port };
    case "username":
      return { ...state, username: action.value ?? state.user };
    case "password":
      return { ...state, password: action.value ?? state.password };
    default:
      return state;
  }
};
