/**
 * ================================================================================
 * File: NaturalBurial.jsx
 * Author: ADM (Abhishek Darsh Manar) 2025 Fall - Software Engineering (CSCI-3428-1)
 * Modified by: Sumit Ahmed (Team Init) 2026 Fall - Connected all text to translations
 * Description: Natural burial information page displaying benefits, process,
 * and environmental impact with Azure text-to-speech for accessibility.
 * ================================================================================
 */

import React, { useState, useRef, useEffect } from "react";
import {
  FaLeaf,
  FaTree,
  FaFeatherAlt,
  FaCloudSun,
  FaHandsHelping,
  FaPeace,
} from "react-icons/fa";
import { IoClose, IoWarningOutline } from "react-icons/io5";
import Footer from "../layout/Footer";
import { useLanguage } from "../locales/LanguageContext";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

// ============================================================================
// Constants
// ============================================================================

// Reusable glass morphism styling
const glassPanel =
  "rounded-3xl border border-white/40 bg-white/60 p-6 shadow-lg shadow-slate-900/10 backdrop-blur-2xl transition-colors duration-300 dark:border-slate-700/60 dark:bg-slate-900/55";

// ============================================================================
// NaturalBurial Component
// ============================================================================

/**
 * NaturalBurial Component - Information about natural burial practices
 * @returns {JSX.Element}
 */
export default function NaturalBurial() {
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
   * Play header audio narration
   * Note: This component doesn't have try-catch alerts like others
   * Consider adding error handling for consistency
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
        "Natural burial is a simple, Earth friendly way to be laid to rest. " +
        "There is no concrete, no metal casket, and no heavy use of chemicals. " +
        "The body returns to the land in a natural way. " +
        "The burial space looks and feels like part of the forest, not like a normal city cemetery. " +
        "The goal is to protect the land and keep it alive for the future. " +
        "At the Saint Margaret's Bay Woodland Conservation Site, the idea is to make a calm place " +
        "that respects people, and also respects nature.";

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

  const stopHeaderAudio = () => {
    const player = playerRef.current;

    if (player) player.pause();

    setIsSpeaking(false);
  };

  // ============================================================================
  // Data Configuration
  // ============================================================================
  
  // Information cards displayed on page
  const cards = [
    {
      title: t("burial.cards.nature.title"),
      icon: <FaLeaf className="text-emerald-500 text-3xl" />,
      img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
      description: t("burial.cards.nature.description"),
      extraNote: t("burial.cards.nature.note"),
    },
    {
      title: t("burial.cards.forest.title"),
      icon: <FaTree className="text-emerald-500 text-3xl" />,
      img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop",
      description: t("burial.cards.forest.description"),
      extraNote: t("burial.cards.forest.note"),
    },
    {
      title: t("burial.cards.peaceful.title"),
      icon: <FaFeatherAlt className="text-emerald-500 text-3xl" />,
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
      description: t("burial.cards.peaceful.description"),
      extraNote: t("burial.cards.peaceful.note"),
    },
  ];

  const benefits = [
    {
      title: t("burial.benefits.earth.title"),
      icon: <FaCloudSun className="text-emerald-500 text-3xl" />,
      text: t("burial.benefits.earth.text"),
    },
    {
      title: t("burial.benefits.simple.title"),
      icon: <FaPeace className="text-emerald-500 text-3xl" />,
      text: t("burial.benefits.simple.text"),
    },
    {
      title: t("burial.benefits.community.title"),
      icon: <FaHandsHelping className="text-emerald-500 text-3xl" />,
      text: t("burial.benefits.community.text"),
    },
  ];

  return (
    <div className="flex flex-col gap-8 text-slate-800 dark:text-slate-100">
      {/* HEADER SECTION */}
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
            <h1 className="text-2xl font-semibold md:text-3xl">
              {t("burial.title")}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              {t("burial.intro")}
          </p>

          {/* AUDIO BUTTONS */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={playHeaderAudio}
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-emerald-600 text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
                {t("audio.play")}
              </button>

            <button
              type="button"
              onClick={stopHeaderAudio}
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-red-600 text-white shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
                {t("audio.stop")}
              </button>
          </div>
          </div>
        </div>
      </header>

      {/* IMAGE CARDS SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <article key={idx} className={`${glassPanel} flex flex-col gap-4`}>
            <div className="relative w-full h-48 rounded-xl overflow-hidden">
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x600/16a34a/ffffff?text=" +
                    encodeURIComponent(card.title);
                }}
              />
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/50 bg-white/70 shadow-inner shadow-slate-900/10 dark:border-slate-600/60 dark:bg-slate-900/60">
              {card.icon}
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {card.description.trim()}
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-auto">
              {card.extraNote}
            </p>
          </article>
        ))}
      </section>

      {/* BENEFITS SECTION */}
      <section className={`${glassPanel}`}>
        <h2 className="text-2xl font-semibold mb-6">
          {t("burial.whyTitle")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="text-center flex flex-col items-center px-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/50 bg-white/70 shadow-inner shadow-slate-900/10 dark:border-slate-600/60 dark:bg-slate-900/60 mb-3">
                {b.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                {b.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {b.text}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-8">
          {t("burial.closing")}
        </p>
      </section>

      <Footer />
    </div>
  );
}
