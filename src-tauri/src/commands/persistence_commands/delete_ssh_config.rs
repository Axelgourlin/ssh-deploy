use tauri::State;
use crate::{AppState};


#[tauri::command]
#[specta::specta]
pub async fn delete_ssh_config(
    state: State<'_, AppState>,
    id: i32,
) -> Result<(), String> {
    state.ssh_config_repo
        .delete(id)
        .await
        .map_err(|e| e.to_string())
}