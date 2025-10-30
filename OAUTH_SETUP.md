# OAuth Sign-In Setup Guide

This guide will help you configure Google and Facebook sign-in for the signup modal.

## Prerequisites

1. A Clerk account (sign up at https://clerk.com)
2. Google OAuth credentials (for Google sign-in)
3. Facebook App credentials (for Facebook sign-in)

## Step 1: Configure Clerk

### 1.1 Create a Clerk Application

1. Go to https://dashboard.clerk.com
2. Create a new application or select your existing one
3. Copy your **Publishable Key** and **Secret Key**

### 1.2 Enable OAuth Providers

#### Enable Google Sign-In:
1. In Clerk Dashboard, go to **User & Authentication** → **Social Connections**
2. Click on **Google**
3. Toggle **Enable** to ON
4. You can use Clerk's development keys for testing, or add your own:
   - Go to https://console.cloud.google.com
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs from Clerk
   - Copy Client ID and Client Secret to Clerk

#### Enable Facebook Sign-In:
1. In Clerk Dashboard, go to **User & Authentication** → **Social Connections**
2. Click on **Facebook**
3. Toggle **Enable** to ON
4. You can use Clerk's development keys for testing, or add your own:
   - Go to https://developers.facebook.com
   - Create a new app or select existing
   - Add Facebook Login product
   - Copy App ID and App Secret to Clerk
   - Configure OAuth redirect URIs from Clerk

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in the `earnlabFrontend` directory:

```bash
# Frontend Environment Variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

2. Create/update `.env` file in the `earnlabbackend` directory:

```bash
# Backend Environment Variables
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
JWT_SECRET=your-secure-jwt-secret-here
JWT_EXPIRES=7d
```

**Important:** 
- Never commit `.env.local` or `.env` files to version control
- Use the `env.example` file as a template
- Restart your development servers after changing environment variables

## Step 3: Verify Configuration

### Frontend Verification:
1. Start the frontend dev server: `npm run dev`
2. Open the signup modal
3. Check browser console for any warnings about missing Clerk keys
4. If you see a red warning box at the bottom of the page, your Clerk key is not configured

### Backend Verification:
1. Check that `CLERK_SECRET_KEY` is set in your backend environment
2. The `/api/v1/auth/clerk-sync` endpoint needs this to validate OAuth users

## Step 4: Test OAuth Sign-In

1. Open the signup modal
2. Click "Google" or "Facebook" button
3. You should be redirected to the OAuth provider
4. After authentication, you'll be redirected back to `/home`
5. Check browser console for any errors

## Common Issues & Solutions

### Issue: "Authentication system is loading"
**Solution:** Wait a few seconds for Clerk to initialize, then try again.

### Issue: "Sign-in is not enabled"
**Solution:** 
- Verify OAuth provider is enabled in Clerk Dashboard
- Check that you're using the correct Clerk publishable key
- Ensure the provider name matches exactly (Google/Facebook)

### Issue: "Pop-up was blocked"
**Solution:** Allow pop-ups in your browser for this site.

### Issue: OAuth redirect fails
**Solution:**
- Check that redirect URLs are configured correctly in Clerk
- Verify `redirectUrl` and `redirectUrlComplete` in SignupModal.tsx
- Check browser console for detailed error messages

### Issue: User created in Clerk but not in backend
**Solution:**
- Verify backend `/api/v1/auth/clerk-sync` endpoint is working
- Check that `CLERK_SECRET_KEY` is set in backend environment
- Review backend logs for errors

## Testing in Development

Clerk provides development OAuth credentials that work out of the box for testing:
- These only work on `localhost`
- For production, you must configure your own OAuth credentials
- Test thoroughly before deploying to production

## Production Deployment

Before deploying to production:

1. **Configure Production OAuth Credentials:**
   - Set up production Google OAuth credentials
   - Set up production Facebook App credentials
   - Add production redirect URIs to both providers

2. **Update Environment Variables:**
   - Use production Clerk keys (pk_live_xxx and sk_live_xxx)
   - Update `NEXT_PUBLIC_API_URL` to your production backend URL
   - Ensure all secrets are stored securely (use environment variable management)

3. **Test Thoroughly:**
   - Test Google sign-in end-to-end
   - Test Facebook sign-in end-to-end
   - Verify user data syncs correctly to backend
   - Check that JWT tokens are issued correctly

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk OAuth Guide](https://clerk.com/docs/authentication/social-connections/overview)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Setup](https://developers.facebook.com/docs/facebook-login)
