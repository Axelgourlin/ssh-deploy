import * as React from "react";
import { GearIcon, PlayIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SSHConfigContainer } from "./ssh-configuration/ssh-config-container";

export function DeployForm() {
  // Optional options state
  const [options, setOptions] = React.useState({
    cleanDest: false,
    unzip: true,
    removeZip: true,
    bashScriptPath: "",
    sudoPassword: "",
    latestBuildPath: "",
  });

  const handleDeploy = () => {
    console.log("Starting deployment with options:", options);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>SSH Configuration</CardTitle>
          <CardDescription>Setup your remote server connection</CardDescription>
        </CardHeader>
        <SSHConfigContainer />
        <CardFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary">
                <GearIcon data-icon="inline-start" />
                Optional Options
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>Optional Settings</AlertDialogTitle>
                <AlertDialogDescription>
                  Configure additional steps for the deployment process.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="py-4 flex flex-col gap-4">
                <Field orientation="horizontal">
                  <FieldLabel>Clean Destination</FieldLabel>
                  <Select
                    value={options.cleanDest ? "yes" : "no"}
                    onValueChange={(v) =>
                      setOptions({ ...options, cleanDest: v === "yes" })
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field orientation="horizontal">
                  <FieldLabel>Unzip Files</FieldLabel>
                  <Select
                    value={options.unzip ? "yes" : "no"}
                    onValueChange={(v) =>
                      setOptions({ ...options, unzip: v === "yes" })
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                {options.unzip && (
                  <Field orientation="horizontal">
                    <FieldLabel>Remove ZIP after</FieldLabel>
                    <Select
                      value={options.removeZip ? "yes" : "no"}
                      onValueChange={(v) =>
                        setOptions({ ...options, removeZip: v === "yes" })
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}

                <Field>
                  <FieldLabel>Bash Script Path (Optional)</FieldLabel>
                  <Input
                    placeholder="/path/to/script.sh"
                    value={options.bashScriptPath}
                    onChange={(e) =>
                      setOptions({ ...options, bashScriptPath: e.target.value })
                    }
                  />
                </Field>

                {options.bashScriptPath && (
                  <Field>
                    <FieldLabel>Sudo Password (if needed)</FieldLabel>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={options.sudoPassword}
                      onChange={(e) =>
                        setOptions({ ...options, sudoPassword: e.target.value })
                      }
                    />
                  </Field>
                )}

                <Field>
                  <FieldLabel>
                    Latest Build Path (&lt;define path&gt;)
                  </FieldLabel>
                  <Input
                    placeholder="/path/to/builds"
                    value={options.latestBuildPath}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        latestBuildPath: e.target.value,
                      })
                    }
                  />
                </Field>
              </div>

              <AlertDialogFooter>
                <AlertDialogAction>Save Options</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" className="w-full sm:w-auto" onClick={handleDeploy}>
          <PlayIcon data-icon="inline-start" />
          Deploy Now
        </Button>
      </div>
    </div>
  );
}
