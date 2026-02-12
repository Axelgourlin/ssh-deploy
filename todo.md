# Project Roadmap: CC Auto Deploy

## 📜 Context

**Application Purpose:** Copy a ZIP file to a remote server, unzip it, run a bash script, and monitor the script's logs in real-time.

### 🚀 Key Features

- **SSH Configuration:** A form to define remote server information and test the SSH connection.
- **Server Management:** CRUD operations for managing remote server profiles.
- **File Transfer:** Securely copy ZIP files via SSH/SFTP.
- **Remote Execution:** Optional unzip and execute bash scripts on remote servers.
- **Live Logs:** Real-time terminal output streaming.
- **Optional Settings:** A dedicated form section to configure optional deployment steps (unzip, cleanup, scripts).

---

## 🛠 User Stories & Acceptance Criteria

### 1. SSH Server Configuration

> **As a user,** I want a form to define remote server information and test the SSH connection.

- [ ] Select from a list of pre-registered hosts:
  - `10.10.100.33`
  - `10.10.100.210`
  - `10.10.100.211`
  - `10.10.100.213`
  - `10.10.100.214`
- [ ] Define remote server details (Host, Port, User) manually if needed.
- [ ] Set SSH port (default to `22`).
- [ ] Securely input SSH password.
- [ ] Dedicated "Test Connection" functionality to verify credentials.

### 2. Server Management (CRUD)

> **As a user,** I want to manage (Create, Read, Update, Delete) remote server profiles.

- [ ] Save server information (excluding the password for security).
- [ ] Load and list saved server profiles.
- [ ] Edit/Update existing server information.
- [ ] Remove/Delete server profiles.

### 3. ZIP Deployment

> **As a user,** I want to copy a ZIP file to a remote server.

- [ ] Select a local ZIP file path for deployment.
- [ ] Perform file transfer using SSH/SFTP.
- [ ] Deploy to a configurable or default path on the remote server.
- [ ] Stream transfer progress and logs in real-time.

### 5. Path Management

> **As a user,** I want to set the destination folder path explicitly.

- [ ] Specify a custom destination path on the remote server.
- [ ] Save the destination path in profile.
- [ ] Automatically create the destination path if it doesn't exist.
- [ ] Recursively create any missing parent/child directories.

### 6. "Latest Build" Intel

> **As a user,** I want an option to automatically fetch the latest build.

- [ ] Toggle "Latest ZIP File" option.
- [ ] Identify the latest `develop` build on the Montreal remote server in path `<define path>`.
- [ ] Display file metadata (Name, Creation Date, Size, etc.).
- [ ] Real-time network status indicator (Icon/Badge).
- [ ] Gracefully disable the option if the network is unavailable.

### 7. Remote Extraction

> **As a user,** I want to unzip the deployment file on the remote server.

- [ ] Toggle "Unzip after transfer" option.
- [ ] Execute remote extraction of the ZIP file.
- [ ] Remove the ZIP file after extraction.
- [ ] Create a new folder with the same name as the ZIP file (with timestamp) and move extracted contents there.
- [ ] Follow the extraction process in real-time.

### 8. Script Execution

> **As a user,** I want to run a bash script on the remote server.

- [ ] Toggle "Execute Script" option.
- [ ] Have an option to define path or name of the bash script on the remote server.
- [ ] Define the path of the bash script on the remote server.
- [ ] Define the name of the remote bash script.
- [ ] Validate the script's existence before execution.
- [ ] Ensure the script is executable (set permissions if necessary).
- [ ] Trigger script execution on the remote host.
- [ ] Handle script execution errors gracefully and display them in real-time logs.
- [ ] Support for commands requiring `sudo` (password handling).

### 9. Monitoring & Notifications

> **As a user,** I want to follow the logs and be notified when the process finishes.

- [ ] Persistent log window (do not auto-close when the script finishes).
- [ ] Native desktop notification upon successful (or failed) completion.
