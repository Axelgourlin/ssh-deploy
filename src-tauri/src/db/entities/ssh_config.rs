use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize, Type)]
#[sea_orm(table_name = "ssh_config")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    // pub profile_id: i32,
    pub name: String,
    pub host: String,
    pub username: String,
    pub port: i32,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

// #[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
// pub enum Relation {
//     #[sea_orm(
//         belongs_to = "super::profile::Entity",
//         from = "Column::ProfileId",
//         to = "super::profile::Column::Id"
//     )]
//     Profile,
// }

// impl Related<super::profile::Entity> for Entity {
//     fn to() -> RelationDef {
//         Relation::Profile.def()
//     }
// }

impl ActiveModelBehavior for ActiveModel {}