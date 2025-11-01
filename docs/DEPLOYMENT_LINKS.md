# FactoryGuard AI Deployment Links

This document contains links to deployed versions of the FactoryGuard AI application.

## Current Deployments

### Development Environment
- **Local Development Server**: http://localhost:3000 (when running `npm run dev`)

### Production Deployments
- **Vercel**: [Add Vercel deployment link here when deployed]
- **Netlify**: [Add Netlify deployment link here when deployed]
- **Railway**: [Add Railway deployment link here when deployed]

## Deployment Instructions

### Vercel (Recommended for Next.js)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and deploy
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Any other required environment variables

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard

### Railway
1. Connect your GitHub repository to Railway
2. Railway will auto-detect Next.js
3. Add environment variables in Railway dashboard

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

## API Endpoints

Once deployed, the following endpoints will be available:
- **Main App**: [deployment-url]
- **API Routes**: [deployment-url]/api/*

## Monitoring and Logs

- Check deployment platform logs for any runtime errors
- Monitor API endpoints for proper functionality
- Test all dashboard features after deployment

## Notes

- Ensure all environment variables are properly set before deployment
- Test the application locally before deploying
- Consider setting up CI/CD for automatic deployments on code changes