/**
 * ================================================================================
 * File: About.jsx
 * Author: ADM (Abhishek Darsh Manar) 2025 Fall - Software Engineering (CSCI-3428-1)
 * Modified by: Sumit Ahmed (Team Init) 2026 Fall - Connected all text to translations, fixed Natural Burial link
 * Description: About page displaying site history, mission highlights, timeline,
 * and photo stories with integrated Azure text-to-speech for accessibility.
 * ================================================================================
 */

import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import lakeshoreImage from "../assets/about/brinelakelookout.jpg";
import exerciseImage from "../assets/about/exercise.jpg";
import labyrinthImage from "../assets/about/labrynth.jpg";
import telephoneImage from "../assets/about/restingandphone.jpg";
import farmhouseImage from "../assets/about/farmhousefoundation.jpg";
import historicWellImage from "../assets/about/historicwell.jpg";
import donationImage from "../assets/about/BrineGravestone.jpg";
import churchSketchImage from "../assets/about/stpaulchurchskech old.png";
import ecologyImage from "../assets/about/neighbour.JPG";
import {
  FaTree,
  FaWater,
  FaHandsHelping,
  FaMapMarkedAlt,
  FaLeaf,
  FaRoute,
  FaCompass,
} from "react-icons/fa";
import { BsArrowUpRight } from "react-icons/bs";
import { IoClose, IoWarningOutline } from "react-icons/io5";
import Footer from "../layout/Footer";
import { useLanguage } from "../locales/LanguageContext";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

// ============================================================================
// Constants & Configuration
// ============================================================================

// Reusable glass morphism styling
const glassPanel =
  "rounded-3xl border border-white/40 bg-white/60 p-6 shadow-lg shadow-slate-900/10 backdrop-blur-2xl transition-colors duration-300 dark:border-slate-700/60 dark:bg-slate-900/55";

// Mission highlight cards - title/text are translation keys (see about.mission in the locale files)
const missionHighlights = [
  {
    icon: <FaTree className="text-emerald-500 text-3xl" />,
    title: "about.mission.gifted.title",
    text: "about.mission.gifted.text",
  },
  {
    icon: <FaWater className="text-sky-500 text-3xl" />,
    title: "about.mission.lake.title",
    text: "about.mission.lake.text",
  },
  {
    icon: <FaHandsHelping className="text-rose-500 text-3xl" />,
    title: "about.mission.volunteer.title",
    text: "about.mission.volunteer.text",
  },
  {
    icon: <FaMapMarkedAlt className="text-amber-500 text-3xl" />,
    title: "about.mission.explore.title",
    text: "about.mission.explore.text",
  },
];

// Interactive discovery prompts - translation keys (see about.prompts)
const trailDiscoveryIdeas = [
  "about.prompts.rings",
  "about.prompts.birch",
  "about.prompts.telephone",
  "about.prompts.lookout",
];

const timeline = [
  {
    year: "about.timeline.roots.year",
    title: "about.timeline.roots.title",
    body: "about.timeline.roots.body",
  },
  {
    year: "about.timeline.donation.year",
    title: "about.timeline.donation.title",
    body: "about.timeline.donation.body",
  },
  {
    year: "about.timeline.motion.year",
    title: "about.timeline.motion.title",
    body: "about.timeline.motion.body",
  },
  {
    year: "about.timeline.report.year",
    title: "about.timeline.report.title",
    body: "about.timeline.report.body",
  },
  {
    year: "about.timeline.today.year",
    title: "about.timeline.today.title",
    body: "about.timeline.today.body",
  },
];

// Photo story cards - title/caption are translation keys; link picks which button to show
const photoStories = [
  {
    image: exerciseImage,
    title: "about.stories.warmup.title",
    link: "map",
    caption: "about.stories.warmup.caption",
  },
  {
    image: labyrinthImage,
    title: "about.stories.labyrinth.title",
    link: "map",
    caption: "about.stories.labyrinth.caption",
  },
  {
    image: telephoneImage,
    title: "about.stories.telephone.title",
    link: "map",
    caption: "about.stories.telephone.caption",
  },
  {
    image: farmhouseImage,
    title: "about.stories.farmhouse.title",
    link: "map",
    caption: "about.stories.farmhouse.caption",
  },
  {
    image: historicWellImage,
    title: "about.stories.wells.title",
    link: "map",
    caption: "about.stories.wells.caption",
  },
  {
    image: ecologyImage,
    title: "about.stories.neighbours.title",
    link: "ecology",
    caption: "about.stories.neighbours.caption",
  },
];

// ============================================================================
// About Component
// ============================================================================

/**
 * About Component - Displays site information, history, and mission
 * @returns {JSX.Element}
 */
export default function About() {
  const { t } = useLanguage();
  // ============================================================================
  // State Management
  // ============================================================================
  
  // Text-to-speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const synthesizerRef = useRef(null);
  // Controllable player allows pause/resume for instant stop
  const playerRef = useRef(null);

  // ============================================================================
  // Azure Text-to-Speech Initialization
  // ============================================================================
  
  /**
   * Initialize Azure Speech SDK on component mount
   * Empty dependency array ensures initialization runs once
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
   * Speak text using Azure Speech SDK
   * Used by multiple sections (hero, mission highlights, timeline)
   * @param {string} text - Text to synthesize and speak
   */
  const speakText = (text) => {
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
      if (!synthesizer || !text) {
        setAlertMessage(t("audio.notInitialized"));
        setTimeout(() => setAlertMessage(null), 8000);
        return;
      }

      if (player) {
        player.resume();
      }

      setIsSpeaking(true);
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

  const stopSpeech = () => {
    const player = playerRef.current;

    if (player) {
      player.pause(); // immediate local stop
    }

    setIsSpeaking(false);
  };

  // ============================================================================
  // Render
  // ============================================================================
  
  return (
    <div className="flex flex-col gap-8 text-slate-800 dark:text-slate-100">
      {/* HERO SECTION */}
      <section
        className={`${glassPanel} flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between`}
      >
        <div className="flex-1 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
            {t("about.eyebrow")}
          </p>
          <h1 className="text-2xl font-semibold md:text-3xl">
            {t("about.title")}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t("about.intro")}
          </p>
          <div className="grid gap-2 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-2">
            <div>
              <strong>{t("about.trailheadLabel")}</strong> {t("about.trailheadText")}
            </div>
          </div>

          {/* AUDIO CONTROLS: HERO SECTION */}
          <div className="space-y-2 pt-2">
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
                onClick={() =>
                  speakText(
                    "About the Conservation Woodland. " +
                      "French Village Conservation Woodland is the forest family behind Saint Paul's Church. " +
                      "Step off Saint Paul's Lane and you are instantly on land gifted by Saint Paul's Anglican Church for the whole community. " +
                      "The twenty-seven acres stretch almost two kilometres from the heritage churchyard to Brine Lake, " +
                      "with wetlands, yellow birch groves, and trail stops that invite curious visitors and lifelong nature lovers alike. " +
                      "Trailhead: behind Saint Paul's Anglican Church, seventy one Saint Pauls Lane, French Village."
                  )
                }
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-emerald-600 text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                {t("audio.play")}
              </button>

              <button
                type="button"
                onClick={stopSpeech}
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-red-600 text-white shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                {t("audio.stop")}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/sitemap"
              className="flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-5 py-2 text-xs font-semibold text-slate-700 shadow-md shadow-slate-900/10 transition hover:bg-white/90 dark:border-slate-600/60 dark:bg-slate-900/60 dark:text-slate-200"
            >
              {t("about.links.trailMap")}
              <FaMapMarkedAlt />
            </Link>
            <Link
              to="/ecology"
              className="flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-5 py-2 text-xs font-semibold text-slate-700 shadow-md shadow-slate-900/10 transition hover:bg-white/90 dark:border-slate-600/60 dark:bg-slate-900/60 dark:text-slate-200"
            >
              {t("about.links.ecology")}
              <BsArrowUpRight />
            </Link>
            <Link
              to="/gallery"
              className="flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-5 py-2 text-xs font-semibold text-slate-700 shadow-md shadow-slate-900/10 transition hover:bg-white/90 dark:border-slate-600/60 dark:bg-slate-900/60 dark:text-slate-200"
            >
              {t("about.links.gallery")}
              <BsArrowUpRight />
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-5 py-2 text-xs font-semibold text-slate-700 shadow-md shadow-slate-900/10 transition hover:bg-white/90 dark:border-slate-600/60 dark:bg-slate-900/60 dark:text-slate-200"
            >
              {t("about.links.contact")}
              <BsArrowUpRight />
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4 lg:flex-col">
          <figure className="mt-6 w-full overflow-hidden rounded-3xl border border-white/40 shadow-inner shadow-slate-900/10 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-slate-700/60 sm:mx-auto md:mt-8 lg:mt-0 lg:w-[28rem] xl:w-[32rem]">
            <img
              src={churchSketchImage}
              alt={t("about.churchAlt")}
              className="h-full w-full object-cover"
            />
          </figure>
        </div>
      </section>

      <section className={`${glassPanel} grid gap-4 md:grid-cols-4`}>
        {missionHighlights.map(({ icon, title, text }) => (
          <article
            key={title}
            className="rounded-2xl border border-white/40 bg-white/70 p-4 shadow-inner shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 dark:border-slate-700/60 dark:bg-slate-900/55"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/60 bg-white/80 shadow-inner shadow-slate-900/5 dark:border-slate-600/60 dark:bg-slate-900/60">
              {icon}
            </div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {t(title)}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t(text)}
            </p>
          </article>
        ))}
      </section>

      {/* WHY THIS WOODLAND MATTERS */}
      <section className={`${glassPanel} grid gap-6 md:grid-cols-2`}>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{t("about.why.title")}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t("about.why.p1")}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t("about.why.p2")}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t("about.why.p3")}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t("about.why.p4")}
          </p>

          {/* AUDIO CONTROLS: WHY THIS WOODLAND MATTERS */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() =>
                speakText(
                  "Why this woodland matters. " +
                    "The French Village Conservation Woodland is a living classroom, a playground without swings, and a peaceful memorial all at once. " +
                    "Volunteers care for the forest so neighbours can learn about lichens, families can walk together, and elders can find quiet remembering spaces. " +
                    "A memorial stone beside the shoreline honours the Brine family, whose name lives on through Brine Lake and the traditions they helped establish in French Village. " +
                    "Halifax Regional Council's Item 4 Information Report, May ninth twenty twenty-three, celebrated the site's ecological value " +
                    "and supported the request to include the woodland in Nova Scotia's Protected Areas Registry. " +
                    "It confirmed the path toward a conservation easement that honours the church's donation. " +
                    "With partners like local schools, nature trusts, and the Green Burial Society of Canada, " +
                    "the woodland is preparing to become the first urban certified green burial conservation cemetery in Canada, " +
                    "while still welcoming everyday adventures."
                )
              }
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-emerald-600 text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              {t("audio.playSection")}
            </button>

            <button
              type="button"
              onClick={stopSpeech}
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-red-600 text-white shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
                {t("audio.stop")}
              </button>
          </div>

          <div className="pt-2">
            <Link
              to="/natural-burial"
              className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-5 py-2 text-xs font-semibold text-slate-700 shadow-md shadow-slate-900/10 transition hover:bg-white/90 dark:border-slate-600/60 dark:bg-slate-900/60 dark:text-slate-200"
            >
              {t("about.links.naturalBurial")}
              <BsArrowUpRight />
            </Link>
          </div>
        </div>
        <figure className="overflow-hidden rounded-2xl border border-white/40 shadow-inner shadow-slate-900/10 dark:border-slate-700/60">
          <img
            src={donationImage}
            alt={t("about.donationAlt")}
            className="h-full w-full object-cover"
          />
        </figure>
      </section>

      <section className={`${glassPanel} space-y-4`}>
        <h2 className="text-2xl font-semibold">{t("about.timelineTitle")}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t("about.timelineIntro")}
        </p>
        <div className="grid gap-4 md:grid-cols-5">
          {timeline.map(({ year, title, body }) => (
            <article
              key={year}
              className="group rounded-2xl border border-white/40 bg-white/70 p-4 shadow-inner shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/10 dark:border-slate-700/60 dark:bg-slate-900/55"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500 dark:text-emerald-300">
                {t(year)}
              </p>
              <h3 className="mt-2 text-base font-semibold text-slate-800 dark:text-slate-100">
                {t(title)}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {t(body)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${glassPanel} space-y-6`}>
        <h2 className="text-2xl font-semibold">
          {t("about.storiesTitle")}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t("about.storiesIntro")}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {photoStories.map(({ image, title, caption, link }) => (
            <figure
              key={title}
              className="overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-inner shadow-slate-900/10 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10 dark:border-slate-700/60 dark:bg-slate-900/55"
            >
              <img
                src={image}
                alt={t(title)}
                className="h-56 w-full object-cover sm:h-64"
              />
              <figcaption className="space-y-3 px-5 py-4">
                <div>
                  <h3 className="text-lg font-semibold">{t(title)}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {t(caption)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {link === "map" ? (
                    <Link
                      to="/sitemap"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 transition hover:underline dark:text-slate-200"
                    >
                      {t("about.links.trailMap")}
                      <FaMapMarkedAlt className="text-sm" />
                    </Link>
                  ) : null}
                  {link === "ecology" ? (
                    <Link
                      to="/ecology"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 transition hover:underline dark:text-slate-200"
                    >
                      {t("about.links.ecology")}
                      <BsArrowUpRight />
                    </Link>
                  ) : null}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={`${glassPanel} space-y-4`}>
        <h2 className="text-2xl font-semibold">{t("about.promptsTitle")}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t("about.promptsIntro")}
        </p>
        <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
          {trailDiscoveryIdeas.map((idea) => (
            <div
              key={idea}
              className="flex items-start gap-2 rounded-2xl border border-white/40 bg-white/65 p-3 shadow-inner shadow-slate-900/5 dark:border-slate-700/60 dark:bg-slate-900/55"
            >
              <FaCompass className="mt-1 text-emerald-500" />
              <span>{t(idea)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={`${glassPanel} grid gap-6 md:grid-cols-2`}>
        <figure className="order-last overflow-hidden rounded-2xl border border-white/40 shadow-inner shadow-slate-900/10 dark:border-slate-700/60 md:order-first">
          <img
            src={lakeshoreImage}
            alt={t("about.lakeAlt")}
            className="h-full w-full object-cover"
          />
        </figure>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{t("about.promise.title")}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t("about.promise.p1")}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t("about.promise.p2")}
          </p>
          <div className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-2">
              <FaLeaf className="mt-1 text-emerald-500" />
              <span>
                {t("about.promise.contactLead")}{" "}
                <Link
                  to="/contact"
                  className="underline decoration-emerald-400 decoration-2 underline-offset-4"
                >
                  {t("about.promise.contactLink")}
                </Link>
                .
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
