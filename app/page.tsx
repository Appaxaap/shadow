"use client";

import dynamic from "next/dynamic";
import Hero from "../components/landing/Hero";
import FormatStrip from "../components/landing/FormatStrip";
import HowItWorks from "../components/landing/HowItWorks";
import FeatureBento from "../components/landing/FeatureBento";
import Comparison from "../components/landing/Comparison";
import OpenSource from "../components/landing/OpenSource";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";

const SmoothScroll = dynamic(
  () => import("../components/landing/SmoothScroll"),
  { ssr: false },
);

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div
        style={{
          background: "#0E0F11",
          fontFamily: "Satoshi, system-ui, sans-serif",
        }}
      >
        <Hero />
        <FormatStrip />
        <HowItWorks />
        <FeatureBento />
        <Comparison />
        <OpenSource />
        <FinalCTA />
        <Footer />
      </div>
    </SmoothScroll>
  );
}
