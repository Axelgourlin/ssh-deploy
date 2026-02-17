use tauri::State;
use crate::{AppState, db::entities::ssh_config};
use sea_orm::Set;

#[tauri::command]
pub async fn create_ssh_config(
    state: State<'_, AppState>,
    // profile_id: i32,
    name: String,
    host: String,
    username: String,
    port: i32,
) -> Result<ssh_config::Model, String> {
    let now = chrono::Utc::now();
    
    let new_config = ssh_config::ActiveModel {
        // profile_id: Set(profile_id),
        name: Set(name),
        host: Set(host),
        username: Set(username),
        port: Set(port),
        created_at: Set(now.into()),
        updated_at: Set(now.into()),
        ..Default::default()
    };

    state.ssh_config_repo
        .create(new_config)
        .await
        .map_err(|e| e.to_string())
}