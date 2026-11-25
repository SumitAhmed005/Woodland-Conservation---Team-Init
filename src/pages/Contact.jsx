/**
 * ================================================================================
 * File: Contact.jsx
 * Author: ADM (Abhishek Darsh Manar) 2025 Fall - Software Engineering (CSCI-3428-1)
 * Modified by: Sumit Ahmed (Team Init) 2026 Fall - Connected all text to translations
 * Description: Contact page with form, address information, and social media links.
 * Includes Azure text-to-speech for header narration and accessibility.
 * ================================================================================
 */

import React, { useState, useRef, useEffect } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoClose, IoWarningOutline } from "react-icons/io5";
import Footer from "../layout/Footer";
import { useLanguage } from "../locales/LanguageContext";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

// ============================================================================
// Contact Component
// ============================================================================

/**
 * Contact Component - Contact form and information page
 * @returns {JSX.Element}
 */
const Contact = () => {
  const { t } = useLanguage();
  // ============================================================================
  // State Management
  // ============================================================================
  
  // Selected contact reason from dropdown
  const [contactReason, setContactReason] = useState("");

  // Reusable glass morphism styling
  const glassPanel =
    "rounded-3xl border border-white/40 bg-white/60 p-6 shadow-lg shadow-slate-900/10 backdrop-blur-2xl transition-colors duration-300 dark:border-slate-700/60 dark:bg-slate-900/55";

  // Text-to-speech state and refs
  const [isSpeaking, setIsSpeaking] = useState(false);
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
    } catch (error) {
      console.error("Failed to initialize Azure Speech:", error);
    }

    return () => {
      if (synthesizerRef.current) synthesizerRef.current.close();
      synthesizerRef.current = null;
      playerRef.current = null;
    };
  }, []); // Initialize once on mount

  // ============================================================================
  // Event Handlers
  // ============================================================================
  
  /**
   * Play header audio narration with error handling
   * Displays alert if API keys are missing or initialization failed
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
      if (!synthesizer) {
        setAlertMessage(t("audio.notInitialized"));
        setTimeout(() => setAlertMessage(null), 8000);
        return;
      }

      const text =
        "Get in touch. We would love to hear from you. " +
        "Use the form below or connect with us through our social channels " +
        "to share feedback, volunteer, or plan a visit.";

      if (player) {
        player.resume();
      }

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
  // Render
  // ============================================================================
  
  return (
    <div className="flex flex-col gap-8 text-slate-800 dark:text-slate-100">
      <header className={`${glassPanel} flex flex-col gap-5 md:flex-row md:items-center md:justify-between`}>
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">{t("contact.title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            {t("contact.intro")}
          </p>

          {/* AUDIO BUTTONS */}
          <div className="space-y-2 mt-4">
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
            <div className="flex gap-3">
              <button
                type="button"
                onClick={playHeaderAudio}
                className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-medium shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                {t("audio.play")}
              </button>
              <button
                type="button"
                onClick={stopHeaderAudio}
                className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                {t("audio.stop")}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className={`${glassPanel} p-6`}>
        <form className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                label: t("contact.form.name"),
                id: "name",
                type: "text",
                placeholder: t("contact.form.namePlaceholder"),
              },
              {
                label: t("contact.form.email"),
                id: "email",
                type: "email",
                placeholder: t("contact.form.emailPlaceholder"),
              },
            ].map(({ label, id, type, placeholder }) => (
              <div key={id} className="space-y-2">
                <label
                  htmlFor={id}
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"
                >
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  className="w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm shadow-inner shadow-slate-900/5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-700/60 dark:bg-slate-900/70"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="reason"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"
            >
              {t("contact.form.reason")}
            </label>
            <select
              id="reason"
              value={contactReason}
              onChange={(e) => setContactReason(e.target.value)}
              className="w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm shadow-inner shadow-slate-900/5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-700/60 dark:bg-slate-900/70"
            >
              <option value="">{t("contact.reasons.reasonPlaceholder")}</option>
              <option value="volunteering">{t("contact.reasons.volunteering")}</option>
              <option value="natural-burial">{t("contact.reasons.naturalBurial")}</option>
              <option value="shop">{t("contact.reasons.shop")}</option>
              <option value="visit">{t("contact.reasons.visit")}</option>
              <option value="general">{t("contact.reasons.general")}</option>
              <option value="other">{t("contact.reasons.other")}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"
            >
              {t("contact.form.message")}
            </label>
            <textarea
              id="message"
              rows="5"
              placeholder={t("contact.form.messagePlaceholder")}
              className="w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm shadow-inner shadow-slate-900/5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-700/60 dark:bg-slate-900/70"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-full border border-emerald-500 bg-emerald-500/90 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-500"
            onClick={(e) => {
              e.preventDefault();
              alert(t("contact.form.thanks"));
            }}
          >
            {t("contact.form.send")}
          </button>
        </form>
      </section>

      <section className={`${glassPanel} grid gap-6 p-6 md:grid-cols-2`}>
        <div>
          <h2 className="text-2xl font-semibold">{t("contact.directTitle")}</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <FaPhone className="text-emerald-500" />
              <span>+1 (123) 456-7890</span>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-emerald-500" />
              <span>info@woodlandconservation.ca</span>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-emerald-500" />
              <span>Halifax, Nova Scotia</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{t("contact.followTitle")}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {t("contact.followBody")}
          </p>
          <div className="mt-4 flex gap-4">
            {[
              { icon: <FaFacebook />, href: "https://facebook.com", label: "Facebook" },
              { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
              { icon: <FaXTwitter />, href: "https://twitter.com", label: "X" },
            ].map(({ icon, href, label }) => (
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
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
