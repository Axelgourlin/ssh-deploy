use sea_orm::{Database, DatabaseConnection, DbErr, ConnectionTrait};
use std::path::PathBuf;
use tauri::Manager;


pub struct DbConfig {
    pub path: PathBuf,
    pub memory: bool,
}

impl DbConfig {
    pub fn from_app(app: &tauri::App) -> Self {
            let path = app.path().app_data_dir()
                .expect("Could not resolve app data dir")
                .join("database.sqlite");
            
            // On s'assure que le dossier parent existe ici
            if let Some(parent) = path.parent() {
                std::fs::create_dir_all(parent).expect("Could not create db directory");
            }

            Self { path, memory: false }
        }

    pub fn memory() -> Self {
        Self {
            path: PathBuf::from(":memory:"),
            memory: true,
        }
    }
}

pub async fn establish_connection(config: &DbConfig) -> Result<DatabaseConnection, DbErr> {
    let database_url = if config.memory {
        "sqlite::memory:".to_string()
    } else {
        format!("sqlite://{}?mode=rwc", config.path.display())
    };

    let db = Database::connect(&database_url).await?;
    
    // Enable foreign keys for SQLite
    db.execute_unprepared("PRAGMA foreign_keys = ON;").await?;
    
    Ok(db)
}