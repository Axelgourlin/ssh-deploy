#[cfg(test)]
mod tests {
    use crate::db::connection::{DbConfig, establish_connection};
    use sea_orm::DatabaseConnection;
    use crate::db::repositories::ssh_config_repository::{SshConfigRepository, SshConfigRepositoryImpl};
    use crate::db::entities::ssh_config;
    use sea_orm::Set;

    async fn setup_test_db() -> DatabaseConnection {
        let db = establish_connection(&DbConfig::memory())
            .await
            .expect("Failed to create test database");
        
        // Exécuter les migrations pour créer les tables
        // migration::Migrator::up(&db, None).await.unwrap();
        
        db
    }

    #[tokio::test]
    async fn test_create_ssh_config() {
        let db = setup_test_db().await;
        let repo = SshConfigRepositoryImpl::new(db);
        
        let now = chrono::Utc::now();
        let config = ssh_config::ActiveModel {
            name: Set("test-config".to_string()),
            host: Set("test-host".to_string()),
            username: Set("testuser".to_string()),
            port: Set(22),
            created_at: Set(now.into()),
            updated_at: Set(now.into()),
            ..Default::default()
        };
        
        let result = repo.create(config).await.unwrap();
        
        assert_eq!(result.name, "test-config");
        assert_eq!(result.host, "test-host");
        assert_eq!(result.username, "testuser");
        assert_eq!(result.port, 22);
    }

    #[tokio::test]
    async fn test_find_by_id() {
        let db = setup_test_db().await;
        let repo = SshConfigRepositoryImpl::new(db);
        
        // Créer un config
        let now = chrono::Utc::now();
        let config = ssh_config::ActiveModel {
            name: Set("test-config".to_string()),
            host: Set("test.com".to_string()),
            username: Set("testuser".to_string()),
            port: Set(22),
            created_at: Set(now.into()),
            updated_at: Set(now.into()),
            ..Default::default()
        };
        
        let created = repo.create(config).await.unwrap();
        
        // Récupérer par ID
        let found = repo.find_by_id(created.id).await.unwrap();
        
        assert!(found.is_some());
        assert_eq!(found.unwrap().id, created.id);
    }

    #[tokio::test]
    async fn test_update_ssh_config() {
        let db = setup_test_db().await;
        let repo = SshConfigRepositoryImpl::new(db);
        
        // Créer
        let now = chrono::Utc::now();
        let config = ssh_config::ActiveModel {
            name: Set("original-config".to_string()),
            host: Set("original.com".to_string()),
            username: Set("originaluser".to_string()),
            port: Set(22),
            created_at: Set(now.into()),
            updated_at: Set(now.into()),
            ..Default::default()
        };
        
        let created = repo.create(config).await.unwrap();
        
        // Mettre à jour
        let mut updated_config: ssh_config::ActiveModel = created.into();
        updated_config.host = Set("updated".to_string());
        
        let result = repo.update(updated_config).await.unwrap();
        
        assert_eq!(result.host, "updated");
    }

    #[tokio::test]
    async fn test_delete_ssh_config() {
        let db = setup_test_db().await;
        let repo = SshConfigRepositoryImpl::new(db);
        
        // Créer
        let now = chrono::Utc::now();
        let config = ssh_config::ActiveModel {
            name: Set("delete-config".to_string()),
            host: Set("delete.com".to_string()),
            username: Set("deleteuser".to_string()),
            port: Set(22),
            created_at: Set(now.into()),
            updated_at: Set(now.into()),
            ..Default::default()
        };
        
        let created = repo.create(config).await.unwrap();
        let id = created.id;
        
        // Supprimer
        repo.delete(id).await.unwrap();
        
        // Vérifier que c'est supprimé
        let found = repo.find_by_id(id).await.unwrap();
        assert!(found.is_none());
    }
}