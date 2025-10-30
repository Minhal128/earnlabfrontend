'use client';

import { useEffect } from 'react';

export default function FacebookFragmentFix() {
  useEffect(() => {
    if (window.location.hash === '#_=_') {
      try {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
      } catch (e) {
        try { window.location.hash = ''; } catch (e) { /* ignore */ }
      }
    }
  }, []);

  return null;
}
