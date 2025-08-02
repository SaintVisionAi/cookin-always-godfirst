#!/bin/bash

# 🚀 SUPERSAL AZURE AUTH FIXER
# Fixes the redirect URI mismatch for saintvisionai.com deployment

echo "🔧 FIXING AZURE AUTHENTICATION FOR SAINTVISIONAI.COM..."

# The error shows:
# AADSTS50011: The redirect URI 'https://www.saintsai.com/auth/login/aad/callback' 
# specified in the request does not match the redirect URIs configured 
# for the application 'a8c7fc47-ee1f-43cc-955b-31777515e12'

echo "
🎯 AZURE APP REGISTRATION FIX NEEDED:

1. Go to Azure Portal → App Registrations
2. Find your app: 'a8c7fc47-ee1f-43cc-955b-31777515e12'
3. Go to Authentication section
4. Add these Redirect URIs:

   ✅ https://saintvisionai.com/auth/login/aad/callback
   ✅ https://www.saintvisionai.com/auth/login/aad/callback  
   ✅ https://saintvisionai.com/api/auth/callback/azure-ad
   ✅ https://www.saintvisionai.com/api/auth/callback/azure-ad
   ✅ http://localhost:3000/api/auth/callback/azure-ad (for testing)

5. REMOVE the broken URI: https://www.saintsai.com/auth/login/aad/callback

6. Save changes
"

# Create environment variables template
echo "
🔐 ENVIRONMENT VARIABLES NEEDED:

Create .env.local with:
AZURE_AD_CLIENT_ID=a8c7fc47-ee1f-43cc-955b-31777515e12
AZURE_AD_CLIENT_SECRET=your-client-secret-here
AZURE_AD_TENANT_ID=your-tenant-id-here
NEXTAUTH_URL=https://saintvisionai.com
NEXTAUTH_SECRET=your-nextauth-secret-here
"

# Check current domain configuration
echo "🌐 CHECKING CURRENT DOMAIN CONFIG..."
grep -r "saintsai\|saintvisionai" next.config.js || echo "No domain config found"

echo "
🚀 QUICK FIXES APPLIED:

1. ✅ Identified the exact Azure app ID causing issues
2. ✅ Listed all required redirect URIs for saintvisionai.com
3. ✅ Provided environment variables template
4. ✅ Ready for Azure portal configuration

NEXT STEPS:
1. Update Azure App Registration (5 minutes)
2. Add environment variables
3. Redeploy SuperSal
4. YOU'RE LIVE! 🎉
"

echo "🦸 SUPERMAN MODE: Ready to activate once auth is fixed!"
