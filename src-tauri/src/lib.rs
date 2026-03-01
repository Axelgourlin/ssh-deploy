pub mod commands;
pub mod db;
pub mod error;

use migration::{Migrator, MigratorTrait};

use tauri::Manager;
use specta_typescript::Typescript;
use tauri_specta::{collect_commands, Builder};
use std::sync::Arc;
use crate::db::DbConfig;
use crate::db::establish_connection;
use crate::db::repositories::{SshConfigRepository, SshConfigRepositoryImpl};

pub struct AppState {
    pub ssh_config_repo: Arc<dyn SshConfigRepository>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {  // plus besoin de async
    let builder = Builder::<tauri::Wry>::new()
        .commands(collect_commands![
            commands::ssh_commands::copy_ssh::copy_over_ssh,
            commands::ssh_commands::test_ssh::test_ssh_connection,
            commands::persistence_commands::save_ssh_config::save_ssh_config,
            commands::persistence_commands::get_all_ssh_config::get_all_ssh_configs,
            commands::persistence_commands::delete_ssh_config::delete_ssh_config,
        ]);

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/lib/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);

            // ✅ app est disponible ici
            let app_data_dir = app.path().app_data_dir()
                .expect("Failed to get app data dir");

            std::fs::create_dir_all(&app_data_dir)?;

            let db_path = app_data_dir.join("database.sqlite");
            let db_config = DbConfig::from_app(app);
            println!("Database path: {:?}", db_path);

            // ✅ block_on pour exécuter de l'async dans le setup synchrone
            tauri::async_runtime::block_on(async {
                let db = establish_connection(&db_config)
                    .await
                    .expect("Failed to connect to database");

                Migrator::up(&db, None).await.unwrap();

                let ssh_config_repo = Arc::new(SshConfigRepositoryImpl::new(db.clone()));

                app.manage(AppState {
                    ssh_config_repo,
                });
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}