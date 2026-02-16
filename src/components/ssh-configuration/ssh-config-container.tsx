import { useState } from "react";

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
import { TestConnectionBtn } from "./ssh-test-connexion";

const preRegisteredHosts = [
  "10.10.100.33",
  "10.10.100.210",
  "10.10.100.211",
  "10.10.100.213",
  "10.10.100.214",
];

export const SSHConfigContainer = () => {
  const [host, setHost] = useState("");
  const [port, setPort] = useState(22);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

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
              onChange={(e) => setPort(Number(e.target.value))}
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
            <TestConnectionBtn
              host={host}
              port={port}
              user={user}
              password={password}
            />
          </Field>
        </div>
      </FieldGroup>
    </CardContent>
  );
};
