# SSH Deploy Application Architecture

## 📐 Technology Stack

**Frontend:** React + Shadcn UI + Tailwind CSS  
**Backend:** Rust (Tauri)  
**Database:** SQLite

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐     │
│  │  Deploy    │  │  Profile   │  │  Connection Test   │     │
│  │  Form      │  │  Manager   │  │  Component         │     │
│  └─────┬──────┘  └─────┬──────┘  └───────────┬────────┘     │
│        │               │                     │              │
└────────┼───────────────┼─────────────────────┼──────────────┘
         │               │                     │
         ▼               ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Tauri Command Layer                       │
└─────────────────────────────────────────────────────────────┘
         │               │                     │
         ▼               ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Rust)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              sshLibrary Module                       │   │
│  │  - SSH Connection Management                         │   │
│  │  - SFTP File Transfer                                │   │
│  │  - Remote Command Execution                          │   │
│  │  - Real-time Log Streaming                           │   │
│  └───────────────┬──────────────────────────────────────┘   │
│                  │                                          │
│  ┌───────────────▼──────────────────────────────────────┐   │
│  │         profileRepository Module                     │   │
│  │  - CRUD operations for Profiles                      │   │
│  │  - SQLite persistence layer                          │   │
│  │  - Profile validation                                │   │
│  └───────────────┬──────────────────────────────────────┘   │
│                  │                                          │
│  ┌───────────────▼──────────────────────────────────────┐   │
│  │            Profile Model                             │   │
│  │  • id: String                                        │   │
│  │  • name: String                                      │   │
│  │  • destination_path: String                          │   │
│  │  • unzip_after_transfer: bool                        │   │
│  │  • execute_script: bool                              │   │
│  │  • script_path: Option<String>                       │   │
│  │  • script_name: Option<String>                       │   │
│  │  • remove_zip_after_unzip: bool                      │   │
│  │  • created_at: DateTime                              │   │
│  │  • updated_at: DateTime                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          remoteConfig Module                         │   │
│  │  - Predefined server configurations                  │   │
│  │  - Load default hosts (10.10.100.x)                  │   │
│  │  - host: String                                      │   │
│  │  - port: u16                                         │   │
│  │  - username: String                                  │   │
│  │  - Network status checking                           │   │
│  │  - Latest build detection                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Database (SQLite)                       │   │
│  │  Tables:                                             │   │
│  │  - profiles                                          │   │
│  │  - remoteConfig                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Module Definitions

### **Frontend Layer**

#### React Components

- **DeployForm**: Main deployment interface
- **ProfileManager**: CRUD operations for server profiles
- **ConnectionTest**: SSH connection validation
- **LogViewer**: Real-time log streaming display

**Dependencies:**

- `@tauri-apps/api` - Communication with Rust backend
- `react` - Frontend framework
- `shadcn/ui` - UI components

---

### **Backend Layer (Rust)**

#### 1. **sshLibrary Module** (`src-tauri/src/libs/ssh.rs`)

**Responsibilities:**

- Establish and maintain SSH connections
- Execute SFTP file transfers with progress tracking
- Run remote commands (bash scripts)
- Stream real-time logs back to frontend

**Key Functions:**

```rust
pub fn test_connection(config: &RemoteConfig) -> Result<bool>
pub fn transfer_file(config: &RemoteConfig, local_path: &str, remote_path: &str) -> Result<()>
pub fn execute_remote_command(config: &RemoteConfig, command: &str) -> Result<String>
pub fn stream_logs(config: &RemoteConfig, callback: impl Fn(String))
```

**Dependencies:**

- `ssh2` crate
- `remoteConfig` module

---

#### 2. **profileRepository Module** (`src-tauri/src/libs/persistence.rs`)

**Responsibilities:**

- CRUD operations for Profile entities
- SQLite database interactions
- Data validation and serialization

**Key Functions:**

```rust
pub fn create_profile(profile: Profile) -> Result<Profile>
pub fn get_profile(id: &str) -> Result<Profile>
pub fn list_profiles() -> Result<Vec<Profile>>
pub fn update_profile(id: &str, profile: Profile) -> Result<Profile>
pub fn delete_profile(id: &str) -> Result<()>
```

**Dependencies:**

- `rusqlite` crate
- `Profile` model
- SQLite database

---

#### 3. **Profile Model** (`src-tauri/src/models/profile.rs`)

**Data Structure:**

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Profile {
    pub id: String,
    pub name: String,
    pub host: String,
    pub port: u16,
    pub username: String,
    pub destination_path: String,
    pub unzip_after_transfer: bool,
    pub execute_script: bool,
    pub script_path: Option<String>,
    pub script_name: Option<String>,
    pub remove_zip_after_unzip: bool,
    pub created_at: String,
    pub updated_at: String,
}
```

**Dependencies:** None (Pure data model)

---

#### 4. **remoteConfig Module** (`src-tauri/src/libs/remote_config.rs`)

**Responsibilities:**

- Load predefined server configurations
- Provide default host list (10.10.100.33, .210, .211, .213, .214)
- Check network connectivity
- Detect latest build on Montreal server

**Key Functions:**

```rust
pub fn get_default_hosts() -> Vec<String>
pub fn check_network_status(host: &str) -> Result<bool>
pub fn get_latest_build(remote_path: &str) -> Result<FileMetadata>
```

**Dependencies:**

- Network libraries (`reqwest` or `ping`)

---

## 🔗 Module Dependencies

```
React Components
    ↓
Tauri Commands (bindings.ts)
    ↓
┌────────────────────────────────────────┐
│ sshLibrary  ← remoteConfig             │
│     ↕                                  │
│ profileRepository                      │
│     ↕                                  │
│ Profile (Model)                        │
│     ↕                                  │
│ SQLite Database                        │
└────────────────────────────────────────┘
```

**Dependency Rules:**

1. `sshLibrary` uses `remoteConfig` for connection parameters
2. `profileRepository` manages `Profile` entities
3. `profileRepository` interfaces with SQLite
4. Frontend never directly accesses the database
5. All backend operations flow through Tauri commands

---

## 🗄️ Database Schema

### **profiles** Table

```sql
CREATE TABLE profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    host TEXT NOT NULL,
    port INTEGER DEFAULT 22,
    username TEXT NOT NULL,
    destination_path TEXT NOT NULL,
    unzip_after_transfer INTEGER DEFAULT 0,
    execute_script INTEGER DEFAULT 0,
    script_path TEXT,
    script_name TEXT,
    remove_zip_after_unzip INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

### **deployment_history** Table

```sql
CREATE TABLE deployment_history (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    status TEXT NOT NULL,
    logs TEXT,
    deployed_at TEXT NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
);
```

---

## 🚀 Deployment Flow

1. **User selects Profile** → Frontend loads from `profileRepository`
2. **User selects ZIP file** → Frontend passes file path to Tauri
3. **Transfer initiated** → `sshLibrary.transfer_file()` executes
4. **If `unzip_after_transfer`** → `sshLibrary.execute_remote_command("unzip ...")`
5. **If `execute_script`** → `sshLibrary.execute_remote_command("bash script.sh")`
6. **Logs streamed** → Real-time updates via Tauri events
7. **History saved** → `profileRepository` records deployment
