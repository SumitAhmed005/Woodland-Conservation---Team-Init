/**
 * ================================================================================
 * File: Navigation.jsx
 * Author: ADM (Abhishek Darsh Manar) 2025 Fall - Software Engineering (CSCI-3428-1)
 * Modified by: Sumit Ahmed (Team Init) 2026 Fall - Added language dropdown, translations
 * and a "More" menu so the nav bar fits on laptop screens in English and French
 * Description: Responsive navigation component with mobile menu, dark mode toggle,
 * language selector and CSS custom property management for layout spacing.
 * ================================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { IoMoon, IoSunny, IoGlobeOutline, IoChevronDown } from "react-icons/io5";
import WeatherWidget from "../widgets/WeatherWidget";
import { useLanguage, LANGUAGES } from "../locales/LanguageContext";

// Links always shown in the nav bar (on laptop screens and up)
const primaryLinks = [
  { to: "/", key: "nav.home" },
  { to: "/about", key: "nav.about" },
  { to: "/sitemap", key: "nav.map" },
  { to: "/ecology", key: "nav.ecology" },
  { to: "/gallery", key: "nav.gallery" },
];

// Links tucked under the "More" dropdown
const moreLinks = [
  { to: "/natural-burial", key: "nav.naturalBurial" },
  { to: "/shop", key: "nav.shop" },
  { to: "/contact", key: "nav.contact" },
];

// The phone menu shows everything in one list
const allLinks = [...primaryLinks, ...moreLinks];

/**
 * Navigation Component - Responsive navigation bar with mobile menu
 * @param {Object} props
 * @param {Function} props.toggleDarkMode - Handler to toggle dark mode
 * @param {boolean} props.dark - Current dark mode state
 * @returns {JSX.Element}
 */
const Navigation = ({ toggleDarkMode, dark }) => {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false); // phone menu
  const [moreOpen, setMoreOpen] = useState(false); // "More" dropdown
  const navRef = useRef(null);
  const moreRef = useRef(null);

  // Prevent body scroll when the phone menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menus whenever the page changes
  useEffect(() => {
    setIsOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  // Close "More" when clicking outside it or pressing Escape
  useEffect(() => {
    if (!moreOpen) return;
    const onClick = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  // Update CSS custom properties for navigation height (other components use it for spacing)
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
    return () => window.removeEventListener("resize", updateNavMetrics);
  }, [isOpen, lang]);

  const toggleNav = () => setIsOpen(!isOpen);

  // Is a "More" page currently open? (highlights the More button)
  const moreActive = moreLinks.some(({ to }) => location.pathname === to);

  const linkBase =
    "whitespace-nowrap py-2 px-3 rounded-xl transition-colors duration-300 text-sm xl:text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-white/40 hover:text-emerald-700 dark:hover:text-emerald-300";

  const dropdownItem =
    "block whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white/70 hover:text-emerald-700 dark:text-slate-100 dark:hover:bg-slate-700/70 dark:hover:text-emerald-300";

  const mobileLinkClass =
    "block rounded-xl border border-white/30 bg-white/40 px-4 py-3 text-slate-800 shadow-inner shadow-slate-900/5 transition hover:bg-white/70 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:bg-slate-800/80";

  return (
    <>
      <nav
        ref={navRef}
        className="fixed left-0 right-0 top-4 z-50 flex justify-center px-4 sm:px-6 lg:px-12"
      >
        <div className="mx-auto w-full max-w-7xl rounded-2xl border border-white/40 bg-white/65 px-3 py-3 shadow-xl shadow-slate-900/15 backdrop-blur-2xl transition-colors duration-500 dark:border-slate-700/50 dark:bg-slate-900/70 sm:px-4 sm:py-4 lg:px-6">
          <div className="flex min-h-[3.5rem] items-center justify-between gap-3 sm:min-h-[4.5rem]">
            {/* Logo, site name, weather */}
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
                <img
                  src={logo}
                  alt={t("nav.logoAlt")}
                  className="h-10 w-10 rounded-xl border border-white/40 p-1 shadow-inner shadow-slate-900/10 sm:h-14 sm:w-14"
                />
                {/* Full name on wide screens, short name on smaller ones */}
                <span className="hidden whitespace-nowrap text-lg font-semibold text-slate-800 dark:text-slate-100 xl:block">
                  {t("nav.siteName")}
                </span>
                <span className="hidden whitespace-nowrap text-base font-semibold text-slate-800 dark:text-slate-100 sm:block xl:hidden">
                  {t("nav.siteNameShort")}
                </span>
              </Link>
              <div className="flex min-w-0 items-center text-xs sm:text-sm">
                <WeatherWidget />
              </div>
            </div>

            {/* Page links: shown from laptop size (1024px) up */}
            <div className="hidden items-center justify-center gap-1 lg:flex">
              {primaryLinks.map(({ to, key }) => (
                <Link key={to} to={to} className={linkBase}>
                  {t(key)}
                </Link>
              ))}

              {/* "More" dropdown */}
              <div className="relative" ref={moreRef}>
                <button
                  type="button"
                  onClick={() => setMoreOpen(!moreOpen)}
                  aria-haspopup="true"
                  aria-expanded={moreOpen}
                  className={`${linkBase} flex items-center gap-1 ${moreActive ? "text-emerald-700 dark:text-emerald-300" : ""}`}
                  data-testid="more-menu-button"
                >
                  {t("nav.more")}
                  <IoChevronDown
                    className={`text-sm transition-transform ${moreOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {moreOpen && (
                  <div className="absolute right-0 top-full mt-2 min-w-[12rem] rounded-2xl border border-white/40 bg-white/90 p-2 shadow-xl shadow-slate-900/15 backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/90">
                    {moreLinks.map(({ to, key }) => (
                      <Link key={to} to={to} className={dropdownItem} onClick={() => setMoreOpen(false)}>
                        {t(key)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dark mode, language, phone menu button */}
            <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
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
                className="block rounded-full border border-white/50 bg-white/70 p-2 text-slate-800 shadow-md shadow-slate-900/10 backdrop-blur-xl transition hover:bg-white/90 dark:border-slate-600/60 dark:bg-slate-800/70 dark:text-slate-100 lg:hidden"
                aria-label={t("nav.toggleMenu")}
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Phone menu overlay - only below 1024px */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-md lg:hidden" onClick={toggleNav} />
          <div className="fixed top-4 right-4 z-50 w-[86vw] max-w-sm rounded-3xl border border-white/40 bg-white/70 p-6 shadow-2xl shadow-slate-900/30 backdrop-blur-3xl transition-colors duration-300 dark:border-slate-700/60 dark:bg-slate-900/70 lg:hidden">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("nav.navigate")}</span>
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
              {allLinks.map(({ to, key }) => (
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