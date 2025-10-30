"use client";

import React from "react";
import { toast as rt, ToastOptions } from "react-toastify";

// Lightweight wrapper around react-toastify's `toast` helpers that
// protects against attempts to render an invalid React element
// (element.type === undefined) which would cause the runtime error
// observed. It logs problematic values to the console for diagnostics
// and falls back to stringifying the payload when possible.

function sanitizeContent(content: any) {
  if (React.isValidElement(content) && (content as any).type === undefined) {
    console.error("Invalid toast element detected:", content);
    // fallback to a safe string message
    return String((content as any)?.props?.children ?? "(invalid content)");
  }
  return content;
}

export const toast = {
  success: (content: any, opts?: ToastOptions) => rt.success(sanitizeContent(content), opts),
  error: (content: any, opts?: ToastOptions) => rt.error(sanitizeContent(content), opts),
  warn: (content: any, opts?: ToastOptions) => rt.warn(sanitizeContent(content), opts),
  info: (content: any, opts?: ToastOptions) => rt.info(sanitizeContent(content), opts),
  // expose the raw toast in case callers need it
  raw: rt,
};

export default toast;
