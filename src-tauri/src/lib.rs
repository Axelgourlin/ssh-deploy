// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::Command;
use specta_typescript::Typescript;
use tauri_specta::{collect_commands, Builder};


#[derive(serde::Deserialize, specta::Type)]
struct SshPayload {
    local_path: String,
    remote_path: String,
    host: String,
    user: String,
    password: String,
}

#[tauri::command]
#[specta::specta]
async fn copy_over_ssh(payload: SshPayload) -> Result<String, String> {
    // curl -u "user:password" -T "local_file" "sftp://host/remote_path"
    // Note: SFTP est généralement disponible sur tous les serveurs SSH
    let output = Command::new("curl")
        .arg("--insecure") // Pour ignorer les problèmes de certificat/clés si nécessaire
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


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Génération des types TypeScript
    let builder = Builder::<tauri::Wry>::new()
        .commands(collect_commands![copy_over_ssh,]);

    #[cfg(debug_assertions)] // Optionnel : ne génère qu'en mode dev
    builder
        .export(Typescript::default(), "../src/lib/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
