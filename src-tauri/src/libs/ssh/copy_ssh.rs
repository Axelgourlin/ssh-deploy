use std::process::Command;
use serde::Deserialize;
use specta::Type;


#[derive(Deserialize, Type)]
pub struct SshPayload {
    pub local_path: String,
    pub remote_path: String,
    pub host: String,
    pub user: String,
    pub password: String,
}

#[tauri::command]
#[specta::specta]
pub async fn copy_over_ssh(payload: SshPayload) -> Result<String, String> {
    // curl -u "user:password" -T "local_file" "sftp://host/remote_path"
    let output = Command::new("curl")
        .arg("--insecure")
        .arg("-u")
        .arg(format!("{}:{}", payload.user, payload.password))
        .arg("-T")
        .arg(&payload.local_path)
        .arg(format!("sftp://{}/{}", payload.host, payload.remote_path))
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok("Fichier envoyé avec succès via curl (SFTP)".into())
    } else {
        let error = String::from_utf8_lossy(&output.stderr);
        Err(format!("Erreur curl : {}", error))
    }
}


