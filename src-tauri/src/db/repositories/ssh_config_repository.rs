use async_trait::async_trait;
use sea_orm::{
    ActiveModelTrait, DatabaseConnection, DbErr, EntityTrait
};
use crate::db::entities::{ssh_config};

#[async_trait]
pub trait SshConfigRepository: Send + Sync {
    async fn create(&self, config: ssh_config::ActiveModel) -> Result<ssh_config::Model, DbErr>;
    async fn find_by_id(&self, id: i32) -> Result<Option<ssh_config::Model>, DbErr>;
    // async fn find_by_profile(&self, profile_id: i32) -> Result<Vec<ssh_config::Model>, DbErr>;
    async fn find_all(&self) -> Result<Vec<ssh_config::Model>, DbErr>;
    async fn update(&self, config: ssh_config::ActiveModel) -> Result<ssh_config::Model, DbErr>;
    async fn delete(&self, id: i32) -> Result<(), DbErr>;
}

pub struct SshConfigRepositoryImpl {
    db: DatabaseConnection,
}

impl SshConfigRepositoryImpl {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }
}

#[async_trait]
impl SshConfigRepository for SshConfigRepositoryImpl {
    async fn create(&self, config: ssh_config::ActiveModel) -> Result<ssh_config::Model, DbErr> {
        config.insert(&self.db).await
    }

    async fn find_by_id(&self, id: i32) -> Result<Option<ssh_config::Model>, DbErr> {
        ssh_config::Entity::find_by_id(id).one(&self.db).await
    }

    // async fn find_by_profile(&self, profile_id: i32) -> Result<Vec<ssh_config::Model>, DbErr> {
    //     ssh_config::Entity::find()
    //         .filter(ssh_config::Column::ProfileId.eq(profile_id))
    //         .all(&self.db)
    //         .await
    // }

    async fn find_all(&self) -> Result<Vec<ssh_config::Model>, DbErr> {
        ssh_config::Entity::find().all(&self.db).await
    }

    async fn update(&self, config: ssh_config::ActiveModel) -> Result<ssh_config::Model, DbErr> {
        config.update(&self.db).await
    }

    async fn delete(&self, id: i32) -> Result<(), DbErr> {
        ssh_config::Entity::delete_by_id(id).exec(&self.db).await?;
        Ok(())
    }
}