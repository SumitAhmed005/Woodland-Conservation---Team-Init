/**
 * File: useDarkMode.js
 * Description: Dark and light theme logic. Tracks the current theme, toggles
 * Tailwind's "dark" class on <body>, and picks the matching background image.
 * Moved out of App.jsx (originally written by Group 26G) so everything about
 * appearance lives in src/appearance/.
 */

import { useState } from "react";
import lightModeBackdrop from "./backgrounds/lightmode.jpg";
import darkModeBackdrop from "./backgrounds/darkmode.jpg";

export default function useDarkMode() {
  const [dark, setDark] = useState(false);

  // Body class is required for Tailwind's dark: variant to work globally
  const toggleDarkMode = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };

  const backgroundImage = dark ? darkModeBackdrop : lightModeBackdrop;

  return { dark, toggleDarkMode, backgroundImage };
}
