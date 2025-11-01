# FactoryGuard AI - Testing and Deployment Guide

## Prerequisites

Before running or deploying FactoryGuard AI, ensure you have:

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **Git** for version control
- **Environment variables** configured (see below)

## Environment Variables Setup

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI/ML Services
OPENAI_API_KEY=your_openai_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Optional: MQTT Broker (for production)
MQTT_BROKER_URL=mqtt://your-broker-url
MQTT_USERNAME=your_mqtt_username
MQTT_PASSWORD=your_mqtt_password
```

## Step-by-Step Testing Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Test Frontend Functionality

#### Landing Page Tests
- [ ] Visit `http://localhost:3000`
- [ ] Verify all sections load (Hero, Stats, Features, ROI, Integrations, CTA)
- [ ] Test navigation links (Features, ROI, Integrations)
- [ ] Test "Get Started" and "Sign In" buttons
- [ ] Verify responsive design on mobile/desktop

#### Authentication Tests
- [ ] Click "Sign In" → should redirect to `/login`
- [ ] Click "Get Started" → should redirect to `/signup`
- [ ] Test login form validation
- [ ] Test signup form validation

#### Dashboard Tests
- [ ] Navigate to `/dashboard` (may require authentication)
- [ ] Verify real-time data updates (equipment status, alerts)
- [ ] Test equipment cards - click to view details
- [ ] Test alert interactions
- [ ] Verify charts load and update
- [ ] Test export functionality

#### Equipment Management Tests
- [ ] Navigate to `/dashboard/equipment`
- [ ] Test equipment filtering and search
- [ ] Click equipment cards to view detailed pages
- [ ] Test equipment detail pages (`/dashboard/equipment/[id]`)
- [ ] Verify sensor data charts
- [ ] Test maintenance history display

### 4. Test Backend Services

#### Start Backend Services

```bash
# Terminal 1: WebSocket Server
npm run server:ws

# Terminal 2: MQTT Listener
npm run server:mqtt

# Terminal 3: AI Predictor
npm run server:ai

# Or run all services concurrently:
npm run server:all
```

#### Backend Tests
- [ ] WebSocket server starts on port 8080
- [ ] MQTT listener connects to broker
- [ ] AI predictor service initializes
- [ ] Check server logs for errors

### 5. Test Sensor Simulation

```bash
# Start sensor simulator
cd simulator && npm run simulate
```

- [ ] Simulator connects to MQTT broker
- [ ] Sensor data is published to topics
- [ ] Dashboard shows live sensor updates

### 6. Integration Tests

#### API Endpoints
- [ ] Test `/api/equipment` - should return equipment data
- [ ] Test `/api/supos/connect` - should handle supOS connections
- [ ] Test `/api/supos/status` - should return connection status

#### Database Tests
- [ ] Verify Supabase connection
- [ ] Test data persistence
- [ ] Check schema integrity

## Deployment Instructions

### Vercel Deployment (Recommended)

#### Step 1: Prepare for Deployment
```bash
# Build the application
npm run build

# Test the build locally (optional)
npm run start
```

#### Step 2: Deploy to Vercel

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: `Next.js`
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build`
   - Output Directory: `.next` (leave default)

3. **Environment Variables**
   Add all required environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `HUGGINGFACE_API_KEY`

4. **Deploy**
   - Click "Deploy"
   - Wait for build completion
   - Your app will be available at `your-project.vercel.app`

#### Step 3: Post-Deployment Verification
- [ ] Visit deployed URL
- [ ] Test all frontend functionality
- [ ] Verify API endpoints work
- [ ] Check environment variables are loaded

### Alternative Deployment Options

#### Railway
1. Connect GitHub repository to Railway
2. Railway auto-detects Next.js
3. Add environment variables
4. Deploy

#### Netlify
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy

## Production Backend Services

For production, you'll need to deploy backend services separately:

### WebSocket Server
```bash
# Build and deploy to Railway/Heroku/etc
npm run server:ws
```

### MQTT Listener
```bash
npm run server:mqtt
```

### AI Predictor
```bash
npm run server:ai
```

## Troubleshooting

### Common Issues

#### Build Errors
- Check Node.js version (must be 18+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check environment variables are set

#### Runtime Errors
- Verify Supabase credentials
- Check API keys are valid
- Ensure database schema is up to date

#### Performance Issues
- Enable caching in production
- Optimize images and assets
- Monitor server resources

### Logs and Monitoring

#### Development Logs
```bash
# View Next.js logs
npm run dev

# View backend service logs
npm run server:all
```

#### Production Monitoring
- Vercel dashboard for frontend metrics
- Supabase dashboard for database metrics
- Application logging for custom metrics

## Security Checklist

Before going live:

- [ ] Environment variables are set correctly
- [ ] API keys are not exposed in client-side code
- [ ] Database connections are secure
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place

## Performance Optimization

- [ ] Enable Next.js caching
- [ ] Optimize images with next/image
- [ ] Implement code splitting
- [ ] Use CDN for static assets
- [ ] Monitor Core Web Vitals

## Support and Maintenance

- Regular dependency updates
- Security patches application
- Database backups
- Monitoring alerts setup
- User feedback collection