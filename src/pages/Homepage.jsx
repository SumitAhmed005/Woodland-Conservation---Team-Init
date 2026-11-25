/**
 * ================================================================================
 * File: Homepage.jsx
 * Author: ADM (Abhishek Darsh Manar) 2025 Fall - Software Engineering (CSCI-3428-1)
 * Modified by: Sumit Ahmed (Team Init) 2026 Fall - Connected all text to translations
 * Description: Landing page component displaying hero section, core features,
 * and trail information with integrated Azure text-to-speech functionality.
 * ================================================================================
 */

import { useLanguage } from "../locales/LanguageContext";
import React, { useState, useEffect, useRef } from "react";
import bannerImage from "../assets/homepage-banner.jpg";
import { Link } from "react-router-dom";
import { FaTree, FaCamera, FaMapMarkedAlt } from "react-icons/fa";
import { BsArrowRightCircle, BsArrowUpRight } from "react-icons/bs";
import { IoClose, IoWarningOutline } from "react-icons/io5";
import Footer from "../layout/Footer";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

// ============================================================================
// Constants & Configuration
// ============================================================================

// Reusable glass morphism styling for consistent panel appearance
const glassPanel =
  "rounded-[28px] border border-white/40 bg-white/40 p-6 shadow-lg shadow-slate-900/10 backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300 dark:border-slate-500/40 dark:bg-slate-900/40 dark:shadow-black/25";

// Core feature tiles - title/body/button text live in home.tiles.<id> in the locale files
const coreTiles = [
  {
    icon: <FaTree className="text-emerald-500 text-3xl" />,
    id: "explore",
    to: "/sitemap",
  },
  {
    icon: <FaCamera className="text-amber-500 text-3xl" />,
    id: "photos",
    to: "/gallery",
  },
  {
    icon: <FaTree className="text-sky-500 text-3xl" />,
    id: "education",
    to: "/ecology",
  },
];

// ============================================================================
// Homepage Component
// ============================================================================

/**
 * Homepage Component - Main landing page with hero section and feature tiles
 * @returns {JSX.Element}
 */
const Homepage = () => {
  const { t } = useLanguage();
  // ============================================================================
  // State Management
  // ============================================================================
  
  // Track text-to-speech playback state
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Store alert message for API key configuration errors
  const [alertMessage, setAlertMessage] = useState(null);
  // Refs to maintain Azure Speech SDK instances across renders
  const synthesizerRef = useRef(null);
  const playerRef = useRef(null);

  // ============================================================================
  // Azure Text-to-Speech Initialization
  // ============================================================================
  
  /**
   * Initialize Azure Speech SDK on component mount
   * Only initializes if API keys are present in environment variables
   * Empty dependency array ensures this runs once on mount
   */
  useEffect(() => {
    try {
      const speechKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
      const speechRegion = import.meta.env.VITE_AZURE_REGION;

      // Silently fail if keys are missing - error will show when user clicks play
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
    } catch (error) {
      console.error("Failed to initialize Azure Speech:", error);
    }

    // Cleanup: Close synthesizer to prevent memory leaks on unmount
    return () => {
      if (synthesizerRef.current) {
        synthesizerRef.current.close();
      }
      synthesizerRef.current = null;
      playerRef.current = null;
    };
  }, []); // Empty array: initialize once on mount

  // ============================================================================
  // Event Handlers
  // ============================================================================
  
  /**
   * Play hero section audio narration using Azure Speech SDK
   * Displays alert if API keys are missing or initialization failed
   */
  const playHeroAudio = () => {
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
        // Auto-dismiss alert after 10 seconds to give user time to read
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
        "Saint Margaret's Bay Area Woodland. " +
        "A community forest that keeps local history and coastal birch standing strong. " +
        "Welcome to the French Village Conservation Woodland at seventy one Saint Pauls Lane—twenty-seven acres of protected forest and wetlands. " +
        "Walk the one-way trail to eight simple stops, from the exercise bar to the labyrinth. " +
        "Discover community stories along the way, and return the same route as the forest soundtrack changes around you.";

      // Resume player if it was previously paused
      if (player) {
        player.resume();
      }

      setIsSpeaking(true);
      // Async speech synthesis with success and error callbacks
      synthesizer.speakTextAsync(
        text,
        () => {
          setIsSpeaking(false);
        },
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

  /**
   * Stop audio playback immediately by pausing player
   * Player pause provides instant stop vs waiting for synthesizer to finish
   */
  const stopHeroAudio = () => {
    const player = playerRef.current;

    if (player) {
      player.pause(); // immediate stop of local audio
    }

    setIsSpeaking(false);
  };

  // ============================================================================
  // Render
  // ============================================================================
  
  return (
    <div className="flex flex-col gap-8 text-slate-800 dark:text-slate-100">
      <header className={`${glassPanel} flex flex-col gap-5 md:flex-row md:items-center md:justify-between`}>
        <div className="flex-1 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
            {t("home.eyebrow")}
          </p>
         <h1 className="text-2xl font-semibold md:text-3xl">
         {t("home.title")}
         </h1>
          <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300">
            {t("home.intro")}
          </p>

          {/* Audio controls with inline error alerts */}
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
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={playHeroAudio}
                className="inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold bg-emerald-600 text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                {t("audio.play")}
              </button>

              <button
                type="button"
                onClick={stopHeroAudio}
                className="inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold bg-red-600 text-white shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                {t("audio.stop")}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-3">
            <Link
              to="/sitemap"
              className="flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-5 py-2 text-xs font-semibold text-slate-700 shadow-md shadow-slate-900/10 transition hover:bg-white/60 dark:border-slate-500/40 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/55"
            >
              {t("home.links.trailMap")}
              <FaMapMarkedAlt />
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-5 py-2 text-xs font-semibold text-slate-700 shadow-md shadow-slate-900/10 transition hover:bg-white/60 dark:border-slate-500/40 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/55"
            >
              {t("home.links.about")}
              <BsArrowUpRight />
            </Link>
            <Link
              to="/ecology"
              className="flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-5 py-2 text-xs font-semibold text-slate-700 shadow-md shadow-slate-900/10 transition hover:bg-white/60 dark:border-slate-500/40 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/55"
            >
              {t("home.links.ecology")}
              <BsArrowUpRight />
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-5 py-2 text-xs font-semibold text-slate-700 shadow-md shadow-slate-900/10 transition hover:bg-white/60 dark:border-slate-500/40 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/55"
            >
              {t("home.links.contact")}
              <BsArrowUpRight />
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4 md:flex-col">
          <figure className="mt-4 w-full overflow-hidden rounded-2xl border border-white/40 shadow-inner shadow-slate-900/10 dark:border-slate-700/60 md:mt-0 md:w-60 lg:w-72">
            <img src={bannerImage} alt={t("home.bannerAlt")} className="h-full w-full object-cover" />
          </figure>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {coreTiles.map(({ id, icon, to }) => (
          <article key={id} className={`${glassPanel} flex flex-col gap-4`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/40 bg-white/40 shadow-inner shadow-slate-900/10 dark:border-slate-500/40 dark:bg-slate-900/40">
              {icon}
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{t(`home.tiles.${id}.title`)}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">{t(`home.tiles.${id}.body`)}</p>
            </div>
            <Link
              to={to}
              className="mt-auto inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:underline dark:text-slate-200"
            >
              {t(`home.tiles.${id}.cta`)}
              <BsArrowRightCircle />
            </Link>
          </article>
        ))}
      </section>

      <section className={`${glassPanel} grid gap-4 md:grid-cols-4`}>
        {["trail", "stops", "birch", "volunteers"].map((id) => (
          <div
            key={id}
            className="rounded-2xl border border-white/40 bg-white/40 p-4 text-center shadow-inner shadow-slate-900/5 backdrop-blur-2xl dark:border-slate-500/40 dark:bg-slate-900/40"
          >
            <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-300">{t(`home.stats.${id}.value`)}</p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{t(`home.stats.${id}.label`)}</p>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;
