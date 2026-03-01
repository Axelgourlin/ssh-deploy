use tauri::State;
use crate::{AppState, db::entities::ssh_config};
use sea_orm::Set;


#[tauri::command]
#[specta::specta]
pub async fn save_ssh_config(
    state: State<'_, AppState>,
    // profile_id: i32,
    name: String,
    host: String,
    username: String,
    port: i32,
    id: Option<i32>,
) -> Result<ssh_config::Model, String> {
    let now = chrono::Utc::now();

    if let Some(id) = id {
        update_ssh_config(&state, id, name, host, username, port, now).await
    } else {
        create_ssh_config(&state, name, host, username, port, now).await
    }

}

async fn create_ssh_config(
    state: &AppState,
    // profile_id: i32,
    name: String,
    host: String,
    username: String,
    port: i32,
    now: chrono::DateTime<chrono::Utc>,
) -> Result<ssh_config::Model, String> {
    let new_config = ssh_config::ActiveModel {
        // profile_id: Set(profile_id),
        name: Set(name),
        host: Set(host),
        username: Set(username),
        port: Set(port),
        updated_at: Set(now.into()),
        ..Default::default()
    };

    state.ssh_config_repo
        .create(new_config)
        .await
        .map_err(|e| e.to_string())
}

async fn update_ssh_config(
    state: &AppState,
    id: i32,
    name: String,
    host: String,
    username: String,
    port: i32,
    now: chrono::DateTime<chrono::Utc>,
) -> Result<ssh_config::Model, String> {
    let mut existing_config = state.ssh_config_repo.find_by_id(id).await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "SSH config not found".to_string())?;
    
    existing_config.name = name;
    existing_config.host = host;
    existing_config.username = username;
    existing_config.port = port;
    existing_config.updated_at = now.into();

    state.ssh_config_repo
        .update(existing_config.into())
        .await
        .map_err(|e| e.to_string())
} 