"use client";

import React, { useEffect, useState } from "react";
import type { ToastContainerProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Load `react-toastify` dynamically on the client during mount.
 * This prevents any server/client interop or bundler timing issues
 * where the imported module or its named exports may be undefined
 * at module-evaluation time. We only render the container after the
 * import resolves to a usable component.
 */
export default function ToastClient(props: ToastContainerProps) {
  const [Container, setContainer] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    let mounted = true;
    // Dynamic import only on client
    import("react-toastify")
      .then((mod) => {
        // handle different possible export shapes
        // Common possibilities:
        // - mod.ToastContainer (named ESM export)
        // - mod.default.ToastContainer (CJS interop)
        // - mod.default (module itself is the component)
        let c: any = (mod as any).ToastContainer ?? (mod as any).default?.ToastContainer ?? (mod as any).default ?? null;

        // If the resolved value looks like a React component type, accept it.
        // We must reject React elements (which also contain a $$typeof symbol)
        // because an element is an instance, not a component type.
        const isReactElement = (x: any) => {
          try {
            return Boolean(x && typeof x === "object" && x.$$typeof === Symbol.for("react.element"));
          } catch {
            return false;
          }
        };

        const isComponentType = (x: any) => {
          if (!x) return false;
          const t = typeof x;
          if (t === "function") return true; // function or class component
          if (t === "object") {
            try {
              const sym = x.$$typeof;
              // Accept forward_ref, memo, lazy, etc. but reject plain element
              if (sym === Symbol.for("react.forward_ref") || sym === Symbol.for("react.memo") || sym === Symbol.for("react.lazy") || sym === Symbol.for("react.provider") || sym === Symbol.for("react.context")) return true;
              return false;
            } catch {
              return false;
            }
          }
          return false;
        };

        if (isReactElement(c) || !isComponentType(c)) {
          // Log the module shape to help debugging in dev mode
          // eslint-disable-next-line no-console
          console.error("react-toastify: unexpected import shape (not a component type)", { resolved: c, module: mod });
          c = null;
        }

        // Instead of setting the resolved export directly (which might accidentally
        // be a non-component value and crash React), always register a small
        // wrapper function component. The wrapper will attempt to resolve the
        // actual ToastContainer at render time and render it only if valid.
        if (mounted) {
          const Wrapper: React.FC<any> = (p) => {
            try {
              const Real = (mod as any).ToastContainer ?? (mod as any).default?.ToastContainer ?? (mod as any).default ?? null;
              if (!isComponentType(Real) || isReactElement(Real)) {
                return null;
              }
              // Render the actual ToastContainer with incoming props
              return React.createElement(Real as any, { position: "bottom-right", ...p });
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error("react-toastify: error rendering ToastContainer", e);
              return null;
            }
          };
          setContainer(() => Wrapper as React.ComponentType<any>);
        }
      })
      .catch(() => {
        // swallow - we'll render null
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!Container) return null;
  const Comp = Container;
  return <Comp position="bottom-right" {...props} />;
}
