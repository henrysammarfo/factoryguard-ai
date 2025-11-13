# 🐳 supOS-CE Installation Guide - Step by Step

## 📋 **OVERVIEW**

This guide provides **detailed, copy-paste commands** for installing Docker Desktop and deploying supOS-CE Community Edition. Total time: **15-20 minutes**.

### **⚠️ IMPORTANT FOR WINDOWS USERS:**
- **Use Git Bash** (installed with Git) or **Windows Subsystem for Linux (WSL)** for bash commands
- **Avoid Windows CMD** for commands like `bash bin/install.sh` - they won't work
- Git Bash provides Unix-like commands (`cp`, `pwd`, `bash`) needed for supOS-CE

---

## 🚀 **PHASE 1: INSTALL DOCKER DESKTOP (5 minutes)**

### **Step 1.1: Download Docker Desktop**

#### **For Windows:**
1. Open your web browser
2. Go to: `https://www.docker.com/products/docker-desktop/`
3. Click **"Download for Windows"**
4. Download the **installer file** (Docker Desktop Installer.exe)

#### **For macOS:**
1. Open your web browser
2. Go to: `https://www.docker.com/products/docker-desktop/`
3. Click **"Download for Mac with Apple Chip"** or **"Download for Mac with Intel Chip"**
4. Download the **installer file** (.dmg)

#### **For Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

### **Step 1.2: Install Docker Desktop**

#### **Windows Installation:**
1. **Locate the downloaded file**: `Docker Desktop Installer.exe`
2. **Double-click** the installer
3. **Follow the installation wizard**:
   - Click **"OK"** to accept the default settings
   - Click **"Install"**
   - Click **"Finish"** when complete
4. **Restart your computer** if prompted

#### **macOS Installation:**
1. **Open the downloaded .dmg file**
2. **Drag Docker Desktop** to your Applications folder
3. **Open Docker Desktop** from Applications
4. **Grant permissions** when prompted

### **Step 1.3: Start and Configure Docker Desktop**

1. **Launch Docker Desktop** from your desktop or applications menu
2. **Wait for Docker to start** (whale icon in system tray)
3. **Sign in** (optional, but recommended):
   - Click the **gear icon** (Settings)
   - Go to **"General"** tab
   - Check **"Start Docker Desktop when you log in"**
4. **Verify installation**:
   ```bash
   docker --version
   # Expected: Docker version 27.x.x, build xxxxxxx

   docker compose version
   # Expected: Docker Compose version v2.x.x
   ```

### **Step 1.4: Enable Required Features**

#### **Windows - Enable WSL 2 (if not already enabled):**
```bash
# Open PowerShell as Administrator
wsl --set-default-version 2
wsl --list --verbose
```

#### **Windows - Enable Virtualization:**
1. **Restart your computer**
2. **Enter BIOS** (usually F2, F10, or Del key during boot)
3. **Enable Intel VT-x or AMD-V** (virtualization technology)
4. **Save and exit BIOS**

---

## 🚀 **PHASE 2: DEPLOY SUPOS-CE (10 minutes)**

### **Step 2.1: Open Terminal/Command Prompt**

#### **Windows:**
- Press `Win + R`, type `cmd`, press Enter
- Or search for "Command Prompt" in Start menu

#### **macOS:**
- Press `Cmd + Space`, type "Terminal", press Enter

#### **Linux:**
- Use your preferred terminal application

### **Step 2.2: Navigate to Your Projects Directory**

```bash
# Windows
cd C:\Users\YourUsername\Desktop
# Replace "YourUsername" with your actual Windows username

# macOS/Linux
cd ~/Desktop

# Create a directory for supOS projects (optional)
mkdir supos-projects
cd supos-projects
```

### **Step 2.3: Clone supOS-CE Repository**

```bash
# Clone the repository
git clone https://github.com/FREEZONEX/supOS-CE.git

# Expected output:
# Cloning into 'supOS-CE'...
# remote: Enumerating objects: XXXX, done.
# remote: Counting objects: 100% (XXXX/XXXX), done.
# ...
# Receiving objects: 100% (XXXX/XXXX), 100% (XXXX MiB | XXXX KiB/s), done.

# Navigate into the cloned directory
cd supOS-CE

# Verify you're in the right directory
pwd
# Should show: /path/to/supos-projects/supOS-CE (or similar)
```

### **Step 2.4: Configure supOS-CE Environment**

#### **Windows CMD:**
```cmd
REM Copy the environment template
copy .env.example .env

REM Edit the .env file
notepad .env
```

#### **Windows PowerShell:**
```powershell
# Copy the environment template
Copy-Item .env.example .env

# Edit the .env file
notepad .env
# Or use VSCode: code .env
```

#### **macOS/Linux:**
```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file
nano .env
# Or use VSCode: code .env
```

### **Step 2.5: Edit Environment Configuration**

**Update these values in the `.env` file:**

```env
# Operating System (required for Windows)
OS_PLATFORM_TYPE=windows

# Data storage location (change to your preferred path)
VOLUMES_PATH=/c/Users/jessi/supos-data

# Frontend access settings
ENTRANCE_DOMAIN=localhost
ENTRANCE_PORT=3001

# Database settings (keep defaults)
POSTGRES_DB=supos
POSTGRES_USER=supos
POSTGRES_PASSWORD=supos

# MQTT settings (keep defaults)
MQTT_USERNAME=supos
MQTT_PASSWORD=supos

# Other settings can remain as defaults
```

**Save and close the file.**

### **Step 2.6: Install and Start supOS-CE**

#### **Windows (using Git Bash or WSL):**
```bash
# Make sure you're in the supOS-CE directory
pwd
# Should end with: /supOS-CE

# Run the installation script
bash bin/install.sh
```

#### **macOS/Linux:**
```bash
# Make sure you're in the supOS-CE directory
pwd
# Should end with: /supOS-CE

# Run the installation script
bash bin/install.sh
```

**Expected output (this will take 5-10 minutes):**
```
[+] Running 15/15
 ⠿ Network supos_default              Created
 ⠿ Volume "supos_postgres_data"       Created
 ⠿ Volume "supos_timescaledb_data"    Created
 ⠿ Container supos-mqtt               Started
 ⠿ Container supos-postgres            Started
 ⠿ Container supos-timescaledb         Started
 ⠿ Container supos-nodered             Started
 ⠿ Container supos-grafana             Started
 ⠿ Container supos-supos-ce            Started

supOS-CE installation completed successfully!
```

#### **Windows PowerShell Alternative:**
If bash doesn't work in PowerShell, you have several options:

**Option 1: Install WSL (Recommended)**
```powershell
# Install WSL
wsl --install

# Restart PowerShell, then:
cd C:\Users\jessi\Desktop\supos-projects\supOS-CE
bash bin/install.sh
```

**Option 2: Use Git Bash**
```powershell
# Open Git Bash from PowerShell
& "C:\Program Files\Git\bin\bash.exe" --login -i -c "cd /c/Users/jessi/Desktop/supos-projects/supOS-CE && bash bin/install.sh"
```

**Option 3: Check what's in the install script and run manually**
```powershell
# Check the install script contents
Get-Content bin/install.sh

# If it's a docker-compose command, run it directly:
docker compose -f docker-compose-4c8g.yml up -d
```

### **Step 2.7: Verify supOS-CE Installation**

```bash
# Check that all containers are running
docker ps

# Expected output (should show 5 containers):
# CONTAINER ID   IMAGE                           COMMAND                  CREATED         STATUS         PORTS                              NAMES
# xxxxxxxxxxxx   freezonex/supos-ce:latest       "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:3001->3000/tcp             supos-supos-ce
# xxxxxxxxxxxx   eclipse-mosquitto:2             "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:1883->1883/tcp             supos-mqtt
# xxxxxxxxxxxx   nodered/node-red:latest         "npm start"              2 minutes ago   Up 2 minutes   0.0.0.0:1880->1880/tcp             supos-nodered
# xxxxxxxxxxxx   grafana/grafana:latest          "/run.sh"                2 minutes ago   Up 2 minutes   0.0.0.0:3001->3000/tcp             supos-grafana
# xxxxxxxxxxxx   timescale/timescaledb:latest    "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:2345->5432/tcp             supos-timescaledb
# xxxxxxxxxxxx   postgres:15                     "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:5432->5432/tcp             supos-postgres
```

### **Step 2.8: Access supOS-CE Interfaces**

```bash
# supOS-CE Main Interface
# URL: http://localhost:3001
# Default login: supos / supos

# Node-RED (Data Flow Editor)
# URL: http://localhost:1880
# Default login: admin / password

# Grafana (Dashboards)
# URL: http://localhost:3001 (same as main interface)
# Default login: admin / admin

# PostgreSQL Database
# Host: localhost
# Port: 5432
# Database: supos
# Username: supos
# Password: supos

# TimescaleDB (Time-series Database)
# Host: localhost
# Port: 2345
# Database: supos
# Username: supos
# Password: supos

# MQTT Broker
# Host: localhost
# Port: 1883
# Username: supos
# Password: supos
```

### **Step 2.9: Test MQTT Connection**

```bash
# Test MQTT broker connection
docker exec -it supos-mqtt mosquitto_sub -h localhost -t "test" -u supos -P supos

# In another terminal, publish a test message
docker exec -it supos-mqtt mosquitto_pub -h localhost -t "test" -m "Hello supOS!" -u supos -P supos
```

---

## 🚀 **PHASE 3: START FACTORYGUARD AI (2 minutes)**

### **Step 3.1: Open New Terminal**

```bash
# Navigate to FactoryGuard AI directory
cd /path/to/factoryguard-ai

# Install dependencies (if not already done)
npm install

# Start the application
npm run dev

# Expected output:
# ▲ Next.js 14.2.33
# - Local:        http://localhost:3000
# - Environments: .env.local
# ✓ Ready in 2.1s
```

### **Step 3.2: Verify Integration**

```bash
# Check supOS connection status
curl http://localhost:3000/api/supos/status

# Expected response:
{
  "success": true,
  "supos_connected": true,
  "eventflow_connected": true,
  "authenticated": true,
  "timestamp": "2025-11-11T..."
}
```

### **Step 3.3: Access Dashboard**

1. **Open browser**: `http://localhost:3000`
2. **Go to supOS Integration**: `http://localhost:3000/dashboard/supos`
3. **Verify status**: Should show "Connected" for all components

---

## 🔧 **TROUBLESHOOTING**

### **Issue: Docker Desktop won't start**
```bash
# Windows: Enable Hyper-V and Containers
dism.exe /Online /Enable-Feature:Microsoft-Hyper-V /All
dism.exe /Online /Enable-Feature:Containers /All

# Restart computer
shutdown /r /t 0
```

### **Issue: supOS-CE installation fails**
```bash
# Check Docker resources
docker system info

# Free up disk space (need at least 5GB)
docker system prune -a

# Restart Docker Desktop
# Then retry: bash bin/install.sh
```

### **Issue: Port conflicts**
```bash
# Check what's using ports
netstat -ano | findstr :3001
netstat -ano | findstr :1883
netstat -ano | findstr :1880

# Kill conflicting processes or change ports in .env
```

### **Issue: Permission denied on Windows**
```bash
# Run Command Prompt as Administrator
# Or use Git Bash which has proper permissions
```

### **Issue: supOS-CE containers not starting**
```bash
# Check logs
docker logs supos-supos-ce
docker logs supos-mqtt

# Restart specific container
docker restart supos-mqtt

# Rebuild if needed
docker compose down
docker compose up -d
```

---

## ✅ **SUCCESS CHECKLIST**

- [ ] Docker Desktop installed and running
- [ ] `docker --version` works
- [ ] supOS-CE repository cloned
- [ ] `.env` file configured
- [ ] `bash bin/install.sh` completed successfully
- [ ] `docker ps` shows 5 running containers
- [ ] All supOS interfaces accessible
- [ ] FactoryGuard AI starts without errors
- [ ] supOS dashboard shows "Connected"
- [ ] MQTT test messages work

---

## 🎯 **WHAT'S RUNNING NOW**

```
🌐 supOS-CE Main UI:     http://localhost:3001
🔧 Node-RED Editor:      http://localhost:1880
📊 Grafana Dashboards:   http://localhost:3001
🤖 FactoryGuard AI:      http://localhost:3000
📡 MQTT Broker:          localhost:1883
🗄️ PostgreSQL:           localhost:5432
⏰ TimescaleDB:          localhost:2345
```

**Total setup time: 15-20 minutes**

**Ready for demo and judging!** 🚀