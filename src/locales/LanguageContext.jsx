/**
 * File: LanguageContext.jsx
 * Author: Sumit Ahmed (Team Init) 2026 Fall - Software Engineering (CSCI-3428)
 * Description: Holds the site's current language (English, French or Mi'kmaq)
 * and gives every component a t("key") function to look up text.
 * Missing text falls back to English. The choice is saved in localStorage.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./en.json";
import fr from "./fr.json";
import mic from "./mic.json";

const translations = { en, fr, mic };
export const LANGUAGES = [
{ code: "en", label: "EN" },
{ code: "fr", label: "FR" },
{ code: "mic", label: "MI'K" },
];

const LanguageContext = createContext(null);

// Find "home.tiles.explore.title" inside a nested object
const lookup = (obj, key) =>
  key.split(".").reduce((part, k) => (part && part[k] !== undefined ? part[k] : undefined), obj);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("lang");
      return translations[saved] ? saved : "en";
    } catch {
      return "en";
    }
  });

  // Remember the choice and tell the browser / screen readers
  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {
      // storage blocked (private mode) - language still works for this visit
    }
    document.documentElement.lang = lang;
  }, [lang]);

  // Current language -> English -> the key itself (so missing text is easy to spot)
  const t = (key) => lookup(translations[lang], key) ?? lookup(translations.en, key) ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return context;
};