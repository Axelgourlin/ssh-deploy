use std::sync::Arc;
use std::net::ToSocketAddrs;
use serde::Serialize;
use serde::Deserialize;
use specta::Type;

use russh::*;
use async_trait::async_trait;
use russh::client::Handler;
use russh_keys::key;

struct SessionHandler;

#[async_trait]
impl Handler for SessionHandler {
    type Error = russh::Error;

    async fn check_server_key(
        self, // On consomme 'self' (pas de &)
        _server_public_key: &key::PublicKey,
    ) -> Result<(Self, bool), Self::Error> {
        // On renvoie un tuple contenant (le_handler_récupéré, le_résultat_du_test)
        // Ici, on accepte tout (true)
        Ok((self, true))
    }
}

#[derive(Debug, Serialize, Type)]
pub enum SshError {
    AddressError,
    AuthenticationFailed,
    ProtocolError(String),
}


#[derive(Deserialize, Type)]
pub struct TestSshConnectionPayload {
    pub host: String,
    pub port: u16,
    pub user: String,
    pub password: String,
}

#[tauri::command]
#[specta::specta]
pub async fn test_ssh_connection(
 payload: TestSshConnectionPayload
) -> Result<String, SshError> {
    
    // Configuration de la session
    let config = Arc::new(client::Config::default());
    let sh = SessionHandler;
    
    // Résolution de l'adresse
    let addr = format!("{}:{}", payload.host, payload.port)
        .to_socket_addrs()
        .map_err(|_| SshError::AddressError)?
        .next()
        .ok_or(SshError::AddressError)?;

    // 2. Tentative de connexion (Asynchrone)
    let mut session = client::connect(config, addr, sh)
        .await
        .map_err(|e| SshError::ProtocolError(e.to_string()))?;

    // 3. Authentification avec mot de passe
    let auth_res = session
        .authenticate_password(payload.user.clone(), payload.password.clone())
        .await
        .map_err(|e| SshError::ProtocolError(e.to_string()))?;

    if auth_res {
        Ok("Connexion et authentification réussies !".to_string())
    } else {
        Err(SshError::AuthenticationFailed)
    }
}