/**
 * File: GlassPanels.jsx
 * Description: The frosted-glass panels every page sits inside (light and dark
 * styles). Moved out of App.jsx (originally written by Group 26G).
 */

import React from "react";

/** GlassPage - glass panel with padding, used for normal content pages */
export const GlassPage = ({ children }) => (
  <section className="mx-auto w-full max-w-7xl rounded-[32px] border border-white/40 bg-white/40 p-8 shadow-lg shadow-slate-900/10 backdrop-blur-2xl backdrop-saturate-150 transition duration-500 dark:border-slate-500/40 dark:bg-slate-900/40 dark:shadow-black/30">
    {children}
  </section>
);

/** FullBleedGlass - glass panel without padding, used for the edge-to-edge map */
export const FullBleedGlass = ({ children }) => (
  <section className="mx-auto w-full max-w-7xl overflow-hidden rounded-[32px] border border-white/40 bg-white/40 shadow-lg shadow-slate-900/10 backdrop-blur-2xl backdrop-saturate-150 transition duration-500 dark:border-slate-500/40 dark:bg-slate-900/40 dark:shadow-black/30">
    {children}
  </section>
);
