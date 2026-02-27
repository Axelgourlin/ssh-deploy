use sea_orm_migration::{prelude::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(SshConfig::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(SshConfig::Id).integer().not_null().auto_increment().primary_key())
                    .col(ColumnDef::new(SshConfig::Host).string().not_null())
                    .col(ColumnDef::new(SshConfig::Name).string().not_null())
                    .col(ColumnDef::new(SshConfig::Username).string().not_null())
                    .col(ColumnDef::new(SshConfig::Port).integer().not_null())
                    .col(ColumnDef::new(SshConfig::CreatedAt).date_time().not_null().default(Expr::current_timestamp()))
                    .col(ColumnDef::new(SshConfig::UpdatedAt).date_time().not_null().default(Expr::current_timestamp()))
                    .to_owned(),
            )
            .await?;

        manager.get_connection().execute_unprepared(
            r#"
            CREATE TRIGGER IF NOT EXISTS set_updated_at_ssh_config
            AFTER UPDATE ON ssh_config
            FOR EACH ROW
            BEGIN
                UPDATE ssh_config SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
            END;
            "#
        ).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(SshConfig::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum SshConfig {
    Table,
    Id,
    Name,
    Host,
    Username,
    Port,
    CreatedAt,
    UpdatedAt,
}