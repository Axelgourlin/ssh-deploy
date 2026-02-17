use sea_orm::{Database, DatabaseConnection, DbErr};
use std::path::PathBuf;

pub struct DbConfig {
    pub path: PathBuf,
    pub memory: bool,
}

impl DbConfig {
    pub fn new(path: PathBuf) -> Self {
        Self {
            path,
            memory: false,
        }
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
    sea_orm::Statement::from_string(
        sea_orm::DatabaseBackend::Sqlite,
        "PRAGMA foreign_keys = ON;".to_string(),
    );
    
    Ok(db)
}