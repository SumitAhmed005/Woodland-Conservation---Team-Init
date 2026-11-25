/**
 * ================================================================================
 * File: Shop.jsx
 * Author: ADM (Abhishek Darsh Manar) 2025 Fall - Software Engineering (CSCI-3428-1)
 * Modified by: Sumit Ahmed (Team Init) 2026 Fall - Connected all text to translations
 * Description: Shop page displaying seasonal produce and handmade products from
 * the conservation area with Azure text-to-speech for accessibility.
 * ================================================================================
 */

import React, { useState, useRef, useEffect } from "react";
import { FaApple, FaLeaf } from "react-icons/fa";
import { FaJar } from "react-icons/fa6";
import { IoClose, IoWarningOutline } from "react-icons/io5";
import Footer from "../layout/Footer";
import { useLanguage } from "../locales/LanguageContext";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import appleTreesImage from "../assets/Shop/Appletrees.jpg";
import pinCherryImage from "../assets/Shop/Pin Cherry.jpg";
import jamsImage from "../assets/Shop/Jams.jpg";
import wildPearTreeImage from "../assets/Shop/wild pear tree.jpg";

// ============================================================================
// Constants & Configuration
// ============================================================================

// Reusable glass morphism styling
const glassPanel =
  "rounded-3xl border border-white/40 bg-white/60 p-6 shadow-lg shadow-slate-900/10 backdrop-blur-2xl transition-colors duration-300 dark:border-slate-700/60 dark:bg-slate-900/55";

// Shop items - title, description, price and season text live in shop.items.<id> in the translation files
const shopItems = [
  {
    id: "apple-picking", 
    icon: <FaApple className="text-emerald-500 text-3xl" />,
    image: appleTreesImage,
  },
  {
    id: "berry-picking", 
    icon: <FaLeaf className="text-emerald-500 text-3xl" />,
    image: pinCherryImage,
  },
  {
    id: "pear-picking", 
    icon: <FaApple className="text-emerald-500 text-3xl" />,
    image: wildPearTreeImage,
  },
  {
    id: "homemade-jam", 
    icon: <FaJar className="text-emerald-500 text-3xl" />,
    image: jamsImage,
  },
];

// ============================================================================
// Shop Component
// ============================================================================

/**
 * Shop Component - Display seasonal produce and products
 * @returns {JSX.Element}
 */
export default function Shop() {
  const { t } = useLanguage();
  // ============================================================================
  // State Management
  // ============================================================================
  
  // Text-to-speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Store alert message for API key configuration errors
  const [alertMessage, setAlertMessage] = useState(null);
  const synthesizerRef = useRef(null);
  const playerRef = useRef(null);

  // ============================================================================
  // Azure Text-to-Speech Initialization
  // ============================================================================
  
  /**
   * Initialize Azure Speech SDK on component mount
   * Only initializes if API keys are present
   */
  useEffect(() => {
    try {
      const speechKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
      const speechRegion = import.meta.env.VITE_AZURE_REGION;

      // Silently fail if keys missing - error shown when user clicks play
      if (!speechKey || !speechRegion) {
        return;
      }

      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
        speechKey,
        speechRegion
      );
      speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

      const player = new SpeechSDK.SpeakerAudioDestination();
      const audioConfig = SpeechSDK.AudioConfig.fromSpeakerOutput(player);

      const synthesizer = new SpeechSDK.SpeechSynthesizer(
        speechConfig,
        audioConfig
      );

      synthesizerRef.current = synthesizer;
      playerRef.current = player;

      return () => {
        if (synthesizerRef.current) synthesizerRef.current.close();
        synthesizerRef.current = null;
        playerRef.current = null;
      };
    } catch (error) {
      // Silently fail on initialization error - error shown when user clicks play
      console.error('Failed to initialize Azure Speech SDK:', error);
    }
  }, []); // Initialize once on mount

  // ============================================================================
  // Event Handlers
  // ============================================================================
  
  /**
   * Play header audio narration with error handling
   */
  const playHeaderAudio = () => {
    try {
      const speechKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
      const speechRegion = import.meta.env.VITE_AZURE_REGION;

      // ============================================================================
      // TODO: REMOVE THIS SECTION ONCE API KEYS ARE CONFIGURED
      // This alert check can be removed after VITE_AZURE_SPEECH_KEY and VITE_AZURE_REGION
      // are properly set in environment variables (Netlify/Azure dashboard or .env file)
      // ============================================================================
      // Check if keys are missing or contain placeholder values
      const hasPlaceholderKeys = !speechKey || !speechRegion || 
        speechKey.toLowerCase().includes('keyhere') || 
        speechKey.toLowerCase().includes('your_azure') ||
        speechRegion.toLowerCase().includes('regionhere') ||
        speechRegion.toLowerCase().includes('your_azure');
      
      if (hasPlaceholderKeys) {
        setAlertMessage(t("audio.keysMissing"));
        setTimeout(() => setAlertMessage(null), 10000);
        return;
      }
      // ============================================================================
      // END OF SECTION TO REMOVE ONCE API KEYS ARE CONFIGURED
      // ============================================================================

      const synthesizer = synthesizerRef.current;
      const player = playerRef.current;
      // Verify synthesizer was initialized successfully
      if (!synthesizer) {
        setAlertMessage(t("audio.notInitialized"));
        setTimeout(() => setAlertMessage(null), 8000);
        return;
      }

      const text =
        "Welcome to the shop. Explore fresh produce and homemade goods from our conservation area. " +
        "Pick your own apples, berries, and pears, or enjoy our handcrafted jams.";

      if (player) player.resume();

      setIsSpeaking(true);

      synthesizer.speakTextAsync(
        text,
        () => setIsSpeaking(false),
        (err) => {
          console.error("Speech error:", err);
          // Show alert immediately when WebSocket/API error occurs
          setAlertMessage(t("audio.playFailed"));
          setTimeout(() => setAlertMessage(null), 10000);
          setIsSpeaking(false);
        }
      );
    } catch (error) {
      console.error("Error playing audio:", error);
      setAlertMessage(t("audio.genericError"));
      setTimeout(() => setAlertMessage(null), 8000);
    }
  };

  // STOP AUDIO
  const stopHeaderAudio = () => {
    const player = playerRef.current;

    if (player) player.pause();

    setIsSpeaking(false);
  };

  return (
    <div className="flex flex-col gap-8 text-slate-800 dark:text-slate-100">
      {/* HEADER WITH AUDIO */}
      <header
        className={`${glassPanel} flex flex-col gap-5 md:flex-row md:items-center md:justify-between`}
      >
        <div className="space-y-2 pt-1">
          {/* Display alert when API keys are missing or errors occur */}
          {alertMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-400/50 bg-amber-50/90 p-3 text-xs text-amber-800 dark:border-amber-500/50 dark:bg-amber-900/90 dark:text-amber-200">
              <IoWarningOutline className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{t("audio.keysRequiredTitle")}</p>
                <p className="mt-1">{alertMessage}</p>
                <p className="mt-2 text-xs">{t("audio.configureHint")}</p>
              </div>
              <button
                onClick={() => setAlertMessage(null)}
                className="flex-shrink-0 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
                aria-label={t("audio.dismiss")}
              >
                <IoClose className="h-4 w-4" />
              </button>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">{t("shop.title")}</h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              {t("shop.intro")}
            </p>

            {/* AUDIO BUTTONS */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={playHeaderAudio}
                className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-medium shadow hover:bg-emerald-700"
              >
                {t("audio.play")}
              </button>

              <button
                type="button"
                onClick={stopHeaderAudio}
                className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700"
              >
                {t("audio.stop")}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* SHOP GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shopItems.map((item) => (
          <article key={item.id} className={`${glassPanel} flex flex-col gap-4`}>
            <div className="relative w-full h-48 rounded-xl overflow-hidden">
              <img
                src={item.image}
                alt={t(`shop.items.${item.id}.title`)}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{t(`shop.items.${item.id}.title`)}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t(`shop.items.${item.id}.description`)}
              </p>
            </div>

            <div className="mt-auto space-y-2 pt-2 border-t border-white/40 dark:border-slate-700/60">
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                {t(`shop.items.${item.id}.price`)}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t(`shop.items.${item.id}.season`)}
              </p>
            </div>
          </article>
        ))}
      </section>

      {/* INFO SECTION */}
      <section className={`${glassPanel}`}>
        <h2 className="text-2xl font-semibold mb-4">{t("shop.aboutTitle")}</h2>
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            {t("shop.aboutBody1")}
          </p>
          <p>
            {t("shop.aboutBody2")}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
