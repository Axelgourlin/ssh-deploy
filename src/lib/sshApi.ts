// Plus besoin de définir l'interface à la main !
import { SshPayload, commands } from "./bindings";

export const copyOverSSH = async (payload: SshPayload) => {
    // Vous pouvez même utiliser l'objet 'commands' généré par specta
    // qui est typé de bout en bout
    await commands.copyOverSsh(payload);
}