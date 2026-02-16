import {
  SshPayload,
  TestSshConnectionPayload,
  SshError,
  Result,
  commands,
} from "./bindings";

export const copyOverSSH = async (
  payload: SshPayload,
): Promise<Result<string, string>> => {
  return await commands.copyOverSsh(payload);
};

export const testSshConnection = async (
  payload: TestSshConnectionPayload,
): Promise<Result<string, SshError>> => {
  return await commands.testSshConnection(payload);
};
