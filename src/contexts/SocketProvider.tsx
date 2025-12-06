"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextValue = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextValue>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Vercel serverless doesn't support WebSockets - only connect in development
    // or if explicitly configured with a socket-capable backend
    const isVercelProduction = typeof window !== "undefined" && 
      window.location.hostname.includes("vercel.app");
    
    // Skip socket connection on Vercel production unless a dedicated socket URL is provided
    if (isVercelProduction && !process.env.NEXT_PUBLIC_SOCKET_URL) {
      console.log("[socket] Skipping WebSocket connection on Vercel (not supported)");
      return;
    }

    // Prefer a dedicated socket URL if provided. Fallback order:
    // 1) NEXT_PUBLIC_SOCKET_URL, 2) NEXT_PUBLIC_API_URL, 3) localhost:5000 (dev)
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL
      || process.env.NEXT_PUBLIC_API_URL
      || (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://earnlabbackend.vercel.app");

    // Read token early so we can include it as auth during the handshake.
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Allow both websocket and polling transports (polling can help behind proxies).
    // Provide the token via `auth` so the server can validate during handshake.
    const s = io(socketUrl, {
      path: "/socket.io",
      autoConnect: true,
      transports: ["websocket", "polling"],
      auth: token ? { token } : undefined,
      reconnection: true,
      reconnectionAttempts: 5, // Limit attempts to avoid spam
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // basic logging for connection lifecycle to help debugging
    s.on("connect", () => {
      // eslint-disable-next-line no-console
      console.log("[socket] connected", s.id);
    });
    s.on("disconnect", (reason) => {
      // eslint-disable-next-line no-console
      console.log("[socket] disconnected", reason);
    });
    s.on("connect_error", (err: any) => {
      // eslint-disable-next-line no-console
      console.error("[socket] connect_error", err && err.message ? err.message : err);
      // Helpful debug: also log the engine.io transport error if present
      try {
        // @ts-ignore - engine internals
        const engineError = (err && err.data) || (s && (s as any).io && (s as any).io.engine && (s as any).io.engine.transport && (s as any).io.engine.transport.error);
        if (engineError) console.error("[socket] engine error:", engineError);
      } catch (e) {}
    });

    s.on("error", (e: any) => {
      // generic socket error
      // eslint-disable-next-line no-console
      console.error("[socket] error", e);
    });

    setSocket(s);

    // send identify if token exists now
    const sendIdentify = () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
          s.emit("identify", token);
          // eslint-disable-next-line no-console
          console.log("[socket] identify emitted");
        }
      } catch (e) {
        // ignore
      }
    };

    sendIdentify();

    // listen for token set in other tabs (storage event) and identify
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === "token") {
        sendIdentify();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      try {
        s.disconnect();
      } catch {}
      setSocket(null);
    };
  }, []);

  const value = useMemo(() => ({ socket }), [socket]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
