# 🔧 FactoryGuard AI - Complete Troubleshooting & Setup Guide

## 🚨 Critical Issues Identified & Fixed

### Issue 1: "Failed to fetch" Authentication Errors
**Problem**: Supabase authentication failing with network errors
**Root Cause**: Incorrect Supabase configuration and missing error handling

### Issue 2: supOS Integration Not Working
**Problem**: Code claimed supOS integration but used fake cloud URLs
**Root Cause**: Implemented with incorrect URLs and API patterns

### Issue 3: Missing supOS-CE Environment
**Problem**: No actual supOS-CE instance running
**Root Cause**: Docker not available in current environment

---

## 🛠️ Step-by-Step Fix Process

### Phase 1: Fix Supabase Authentication Issues

#### Step 1.1: Verify Supabase Configuration
```bash
# Check if Supabase credentials are set
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### Step 1.2: Test Supabase Connection
```bash
# Create a test file to verify Supabase connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.auth.getSession().then(result => {
  console.log('Supabase connection:', result.error ? 'FAILED' : 'SUCCESS');
  if (result.error) console.log('Error:', result.error.message);
}).catch(err => console.log('Connection error:', err.message));
"
```

#### Step 1.3: Fix CORS Issues (If Needed)
If you get CORS errors, add these to your Supabase project settings:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: `http://localhost:3000/auth/callback`

#### Step 1.4: Create Test User Account
```bash
# In Supabase Dashboard > Authentication > Users
# Create a test user:
# Email: test@factoryguard.com
# Password: TestPass123!
```

#### Step 1.5: Test Authentication Flow
```bash
# Start the app and try logging in with test credentials
npm run dev
# Then visit http://localhost:3000/login
```

### Phase 2: Fix supOS-CE Integration

#### Step 2.1: Install Docker Desktop
**Required for supOS-CE**
```bash
# Download and install Docker Desktop from:
# https://www.docker.com/products/docker-desktop/

# Verify installation
docker --version
docker compose version
```

#### Step 2.2: Install supOS-CE
```bash
# Clone the supOS-CE repository
git clone https://github.com/FREEZONEX/supOS-CE.git
cd supOS-CE

# Create environment configuration
cp .env.example .env

# Edit .env file with your settings
nano .env
# Set:
# OS_PLATFORM=windows  # or linux/macos
# VOLUMES_PATH=/c/Users/YourName/supos-data
# ENTRANCE_DOMAIN=localhost
# ENTRANCE_PORT=3001
```

#### Step 2.3: Start supOS-CE
```bash
# Install and start supOS-CE
bash bin/install.sh

# This will start:
# - Node-RED (port 1880)
# - Grafana (port 3001)
# - PostgreSQL (port 5432)
# - TimescaleDB (port 2345)
# - MQTT Broker (port 1883)
```

#### Step 2.4: Verify supOS-CE is Running
```bash
# Check if services are running
docker ps

# Test MQTT broker
npm test:mqtt

# Check Grafana
curl http://localhost:3001

# Check Node-RED
curl http://localhost:1880
```

#### Step 2.5: Configure UNS Data Model
```bash
# Access Node-RED at http://localhost:1880
# Default credentials: admin/password

# Create factory data structure:
# factory/
#   ├── workshopA/
#   │   ├── productionLine1/
#   │   │   ├── cnc_machine_001/
#   │   │   ├── sensor_temp/
#   │   │   ├── sensor_vibration/
#   │   │   └── sensor_pressure/
#   └── workshopB/
#       └── productionLine2/
```

### Phase 3: Test Complete Integration

#### Step 3.1: Start FactoryGuard AI
```bash
# In a separate terminal
cd /path/to/factoryguard-ai
npm run dev
```

#### Step 3.2: Test supOS Connection
```bash
# Check API status
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

#### Step 3.3: Test Data Flow
```bash
# Access supOS dashboard
# URL: http://localhost:3000/dashboard/supos

# Should show:
# ✅ supOS Connection: Connected
# ✅ EventFlow: Connected
# ✅ SourceFlow: Active
# ✅ Equipment Data: X items loaded
```

#### Step 3.4: Test AI Predictions
```bash
# Send test sensor data via MQTT
mosquitto_pub -h localhost -p 1883 -t "factory/workshopA/productionLine1/sensor_temp" -m '{"value": 75.5, "unit": "celsius", "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'

# Check if prediction is generated
# View in FactoryGuard dashboard
```

### Phase 4: Demo Preparation

#### Step 4.1: Record Demo Video
```bash
# Use screen recording software (OBS, Camtasia, etc.)
# Record 12-15 minute demo following the script in:
# docs/TECHNICAL_PRESENTATION.md
```

#### Step 4.2: Prepare Supporting Materials
- **Demo Setup Guide**: `DEMO_SETUP_README.md`
- **Technical Slides**: `docs/TECHNICAL_PRESENTATION.md`
- **Integration Proof**: `SUPOS_INTEGRATION_PROOF.md`
- **Architecture Diagrams**: `docs/DEMO_MATERIALS.md`

#### Step 4.3: Test Complete Demo Flow
1. Start supOS-CE
2. Start FactoryGuard AI
3. Show MQTT data flow
4. Demonstrate AI predictions
5. Display Grafana integration
6. Show alert notifications

---

## 🔧 Quick Fix Commands

### For Supabase Issues:
```bash
# Check environment variables
echo "URL: $NEXT_PUBLIC_SUPABASE_URL"
echo "KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:20}..."

# Test connection
npm run dev
curl http://localhost:3000/api/health
```

### For supOS-CE Issues:
```bash
# Check if running
docker ps | grep supos

# Restart services
cd supOS-CE
docker compose restart

# Check logs
docker logs supos-mqtt
docker logs supos-nodered
```

### For Integration Issues:
```bash
# Test MQTT connection
node test-mqtt.js

# Check FactoryGuard logs
npm run dev 2>&1 | grep -i "supos\|mqtt"

# Test API endpoints
curl http://localhost:3000/api/supos/status
```

---

## 🚨 Common Error Solutions

### Error: "Failed to fetch" on Login
**Solution**:
1. Check Supabase URL and key in `.env.local`
2. Verify Supabase project is active
3. Check browser network tab for CORS errors
4. Ensure Supabase site URL includes `localhost:3000`

### Error: "supOS MQTT connection error"
**Solution**:
1. Ensure supOS-CE is running: `docker ps`
2. Check MQTT port: `netstat -an | grep 1883`
3. Verify credentials in `.env.local`
4. Restart supOS-CE: `docker compose restart`

### Error: "ECONNREFUSED 127.0.0.1:1883"
**Solution**:
1. supOS-CE is not running
2. Install Docker Desktop
3. Run `bash bin/install.sh` in supOS-CE directory
4. Wait for all services to start (5-10 minutes)

### Error: "Grafana check failed"
**Solution**:
1. Check if Grafana is running: `curl http://localhost:3001`
2. Restart Grafana: `docker restart supos-grafana`
3. Check Grafana logs: `docker logs supos-grafana`

---

## 📞 Emergency Support

If all else fails:

1. **Check Logs**: `npm run dev 2>&1 | tee factoryguard.log`
2. **Supabase Status**: Visit your Supabase dashboard
3. **supOS-CE Logs**: `docker logs -f supos-mqtt`
4. **Network Issues**: Check firewall/antivirus blocking ports

### Contact Information:
- **GitHub Issues**: https://github.com/henrysammarfo/factoryguard-ai/issues
- **supOS-CE**: https://github.com/FREEZONEX/supOS-CE/issues
- **Demo Requirements**: 15 minutes setup, stable internet, Docker installed

---

## ✅ Success Checklist

- [ ] Docker Desktop installed and running
- [ ] supOS-CE cloned and installed
- [ ] All supOS services running (MQTT, Node-RED, Grafana)
- [ ] FactoryGuard AI starts without errors
- [ ] Supabase authentication working
- [ ] supOS dashboard shows "Connected" status
- [ ] MQTT data flow working
- [ ] AI predictions generating
- [ ] Demo video recorded (12-15 minutes)
- [ ] All supporting materials prepared

**Once all checks pass, your FactoryGuard AI supOS integration is ready for hackathon judging!** 🎉