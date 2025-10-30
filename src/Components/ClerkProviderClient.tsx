"use client";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from 'react-redux';
import { store } from '@/store/store';

export default function ClerkProviderClient({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <Provider store={store}>
        {children}
        {/* Visible warning in dev when publishable key is missing so it's easy to spot misconfiguration */}
        {typeof window !== 'undefined' && !publishableKey ? (
          <div style={{position:'fixed',left:12,bottom:12,zIndex:9999,background:'#fee2e2',color:'#7f1d1d',padding:8,borderRadius:6,fontSize:12}}>
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set — social sign-in will not work. Please add it to <code>.env.local</code> and restart the dev server.
          </div>
        ) : null}
      </Provider>
    </ClerkProvider>
  );
}
