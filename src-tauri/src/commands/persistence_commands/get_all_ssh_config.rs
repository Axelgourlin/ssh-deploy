use tauri::State;
use crate::{AppState, db::entities::ssh_config};

#[tauri::command]
pub async fn get_all_ssh_configs(
    state: State<'_, AppState>,
) -> Result<Vec<ssh_config::Model>, String> {
    state.ssh_config_repo
        .find_all()
        .await
        .map_err(|e| e.to_string())
}
