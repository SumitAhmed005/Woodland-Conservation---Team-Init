/**
 * ================================================================================
 * File: Navigation.jsx
 * Author: ADM (Abhishek Darsh Manar) 2025 Fall - Software Engineering (CSCI-3428-1)
 * Modified by: Sumit Ahmed (Team Init) 2026 Fall - Added language dropdown and translations
 * Description: Responsive navigation component with mobile menu, dark mode toggle,
 * language selector and CSS custom property management for layout spacing.
 * ================================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { IoMoon, IoSunny, IoGlobeOutline } from "react-icons/io5";
import WeatherWidget from "../widgets/WeatherWidget";
import { useLanguage, LANGUAGES } from "../locales/LanguageContext";

// ============================================================================
// Navigation Component
// ============================================================================

/**
 * Navigation Component - Responsive navigation bar with mobile menu
 * @param {Object} props
 * @param {Function} props.toggleDarkMode - Handler to toggle dark mode
 * @param {boolean} props.dark - Current dark mode state
 * @returns {JSX.Element}
 */
const Navigation = ({ toggleDarkMode, dark }) => {
  const { lang, setLang, t } = useLanguage();

  // Track mobile menu open/closed state
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  // Page links, shared by the desktop bar and the mobile menu
  const links = [
    { to: "/", key: "nav.home" },
    { to: "/about", key: "nav.about" },
    { to: "/sitemap", key: "nav.map" },
    { to: "/gallery", key: "nav.gallery" },
    { to: "/ecology", key: "nav.ecology" },
    { to: "/natural-burial", key: "nav.naturalBurial" },
    { to: "/shop", key: "nav.shop" },
    { to: "/contact", key: "nav.contact" },
  ];

  /**
   * Prevent body scroll when mobile menu is open
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  /**
   * Update CSS custom properties for navigation height
   * Allows other components to calculate spacing based on nav height
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateNavMetrics = () => {
      if (!navRef.current) return;
      const root = document.documentElement;
      const { offsetHeight } = navRef.current;
      const computedStyles = window.getComputedStyle(navRef.current);

      root.style.setProperty("--nav-height", `${offsetHeight}px`);
      root.style.setProperty("--nav-spacing", computedStyles.top || "16px");
    };

    updateNavMetrics();
    window.addEventListener("resize", updateNavMetrics);

    return () => {
      window.removeEventListener("resize", updateNavMetrics);
    };
  }, [isOpen, lang]); // Re-measure when menu, window size or language changes

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  // Reusable link styling for consistent navigation appearance
  const linkBase =
    "whitespace-nowrap py-2 px-4 rounded-xl transition-colors duration-300 text-sm lg:text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-white/40 hover:text-emerald-700 dark:hover:text-emerald-300";

  const mobileLinkClass =
    "block rounded-xl border border-white/30 bg-white/40 px-4 py-3 text-slate-800 shadow-inner shadow-slate-900/5 transition hover:bg-white/70 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:bg-slate-800/80";

  return (
    <>
      <nav
        ref={navRef}
        className="fixed left-0 right-0 top-4 z-50 flex justify-center px-4 sm:px-6 lg:px-12"
      >
        <div className="mx-auto w-full max-w-7xl rounded-2xl border border-white/40 bg-white/65 px-3 py-3 shadow-xl shadow-slate-900/15 backdrop-blur-2xl transition-colors duration-500 dark:border-slate-700/50 dark:bg-slate-900/70 sm:px-4 sm:py-4 lg:px-6">
          <div className="flex min-h-[3.5rem] flex-wrap items-center justify-between gap-3 sm:min-h-[4.5rem]">
            <div className="order-1 flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <img
                  src={logo}
                  alt={t("nav.logoAlt")}
                  className="h-10 w-10 rounded-xl border border-white/40 p-1 shadow-inner shadow-slate-900/10 sm:h-14 sm:w-14"
                />
                <span className="hidden truncate text-base font-semibold text-slate-800 dark:text-slate-100 sm:block sm:text-lg">
                  {t("nav.siteName")}
                </span>
              </div>
              <div className="flex min-w-0 items-center text-xs sm:text-sm">
                <WeatherWidget />
              </div>
            </div>

            <div className="order-3 hidden w-full items-center justify-center gap-1 md:order-2 md:flex md:flex-1 md:w-auto md:gap-2">
              {links.map(({ to, key }) => (
                <Link key={to} to={to} className={linkBase}>
                  {t(key)}
                </Link>
              ))}
            </div>

            <div className="order-2 flex items-center gap-2 sm:gap-3 md:order-3">
              <button
                onClick={toggleDarkMode}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/70 text-xl text-amber-500 shadow-md shadow-slate-900/10 backdrop-blur-xl transition hover:bg-white/90 dark:border-slate-600/60 dark:bg-slate-800/70 sm:h-12 sm:w-12 sm:text-2xl"
                aria-label={t("nav.toggleDark")}
              >
                {dark ? <IoSunny /> : <IoMoon />}
              </button>

              {/* Language selector */}
              <label className="flex h-10 items-center gap-1 rounded-full border border-white/50 bg-white/70 px-2 text-xs font-semibold text-slate-800 shadow-md shadow-slate-900/10 backdrop-blur-xl dark:border-slate-600/60 dark:bg-slate-800/70 dark:text-slate-100">
                <IoGlobeOutline className="hidden text-lg lg:block" aria-hidden="true" />
                <span className="sr-only">Language</span>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="cursor-pointer bg-transparent py-1 pr-1 focus:outline-none"
                  data-testid="language-select"
                >
                  {LANGUAGES.map(({ code, label }) => (
                    <option key={code} value={code} className="text-slate-800">
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                onClick={toggleNav}
                className="block rounded-full border border-white/50 bg-white/70 p-2 text-slate-800 shadow-md shadow-slate-900/10 backdrop-blur-xl transition hover:bg-white/90 dark:border-slate-600/60 dark:bg-slate-800/70 dark:text-slate-100 md:hidden"
                aria-label={t("nav.toggleMenu")}
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay - only visible on mobile devices */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-md md:hidden" onClick={toggleNav} />
          <div className="fixed top-4 right-4 z-50 w-[86vw] max-w-sm rounded-3xl border border-white/40 bg-white/70 p-6 shadow-2xl shadow-slate-900/30 backdrop-blur-3xl transition-colors duration-300 dark:border-slate-700/60 dark:bg-slate-900/70 md:hidden">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {t("nav.navigate")}
              </span>
              <button
                onClick={toggleNav}
                aria-label={t("nav.closeMenu")}
                className="rounded-full border border-white/50 bg-white/80 p-2 text-slate-700 hover:bg-white dark:border-slate-600/60 dark:bg-slate-800/80 dark:text-slate-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col space-y-2 text-base">
              {links.map(({ to, key }) => (
                <Link key={to} to={to} onClick={toggleNav} className={mobileLinkClass}>
                  {t(key)}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Navigation;