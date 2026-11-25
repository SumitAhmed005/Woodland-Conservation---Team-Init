/**
 * ================================================================================
 * File: Footer.jsx
 * Author: ADM (Abhishek Darsh Manar) 2025 Fall - Software Engineering (CSCI-3428-1)
 * Modified by: Sumit Ahmed (Team Init) 2026 Fall - Connected text to translations,
 * fixed Natural Burial and Shop links, added labels to social icons
 * Description: Site footer component displaying navigation links, contact information,
 * and social media links with responsive grid layout.
 * ================================================================================
 */

import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useLanguage } from "../locales/LanguageContext";

// Footer page links - text comes from footer.links.<key>
const footerLinks = [
  { to: "/sitemap", key: "maps" },
  { to: "/about", key: "about" },
  { to: "/ecology", key: "ecology" },
  { to: "/gallery", key: "gallery" },
  { to: "/contact", key: "contact" },
  { to: "/natural-burial", key: "naturalBurial" },
  { to: "/shop", key: "shop" },
];

const socialLinks = [
  { icon: <FaFacebook />, href: "https://facebook.com", label: "Facebook" },
  { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
  { icon: <FaXTwitter />, href: "https://twitter.com", label: "X" },
];

/**
 * Footer Component - Site footer with links and contact information
 * @returns {JSX.Element}
 */
export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="rounded-3xl border border-white/40 bg-white/60 p-6 text-xs text-slate-500 shadow-lg shadow-slate-900/10 backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/55 dark:text-slate-300">
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <p className="font-semibold text-slate-700 dark:text-slate-200">{t("footer.planTitle")}</p>
          <ul className="space-y-1">
            {footerLinks.map(({ to, key }) => (
              <li key={to}>
                <Link to={to} className="hover:underline text-slate-500 dark:text-slate-300">
                  {t(`footer.links.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-slate-500 dark:text-slate-400">71 St Pauls Ln, French Village, NS B3Z 2Y1</p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-slate-700 dark:text-slate-200">{t("footer.exploreTitle")}</p>
          <p className="text-slate-500 dark:text-slate-300">{t("footer.exploreBody")}</p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-slate-700 dark:text-slate-200">{t("footer.connectTitle")}</p>
          <div className="flex gap-4 text-slate-500 dark:text-slate-300">
            {socialLinks.map(({ icon, href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/50 bg-white/70 text-emerald-600 shadow-inner shadow-slate-900/5 transition hover:bg-white dark:border-slate-600/60 dark:bg-slate-900/60 dark:text-emerald-200"
              >
                {icon}
              </a>
            ))}
          </div>
          <p className="text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}