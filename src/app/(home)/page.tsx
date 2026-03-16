import Navbar from "../../components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutUs from "./components/AboutUs";
import AboutUsDetail from "./components/AboutUsDetail";
import DevicePreview from "./components/DevicePreview";
import PopularCollection from "../../components/card/PopularCollection";
import ArtworkCTA from "./components/ArtworkCTA";
import Newsletter from "./components/Newsletter";
import Footer from "../../components/Footer";
import BackgroundLayout from "../../components/BackgroundLayout";
import CustomCursor from "../../components/CustomCursor";
import { AgentProvider } from "../../components/agent/AgentContext";
import PromptAgentPanel from "../../components/agent/PromptAgentPanel";
import SectionWrapper from "../../components/SectionWrapper";

export default async function Home() {

  return (
    <AgentProvider>
      <main className="min-h-screen text-white selection:bg-neon-blue selection:text-white overflow-hidden relative">
        <BackgroundLayout />
        <CustomCursor />

        {/* Futuristic Frame Decorations */}
        <div className="futuristic-frame" />
        <div className="hud-line-v left" />
        <div className="hud-line-v right" />
        <div className="scanline" />

        <Navbar />

        <SectionWrapper id="home" className="bg-radial-[at_2%_8%]  from-[#547792]/20 via-[#000080]/40 to-[#000000]/80">
          <HeroSection />
        </SectionWrapper>

        <SectionWrapper id="about-us" className="bg-radial-[at_40%_80%] from-[#547792]/20 via-[#000080]/40 to-[#000000]/80">
          <AboutUs />
        </SectionWrapper>

        <SectionWrapper className="bg-radial-[at_40%_30%] from-[#547792]/20 via-[#000080]/40 to-[#000000]/80">
          <AboutUsDetail />
        </SectionWrapper>

        <SectionWrapper className="bg-radial-[at_40%_80%] from-[#547792]/20 via-[#000080]/40 to-[#000000]/80">
          <DevicePreview />
        </SectionWrapper>

        <SectionWrapper id="products" className="bg-radial-[at_40%_30%] from-[#547792]/20 via-[#000080]/40 to-[#000000]/80">
          <PopularCollection />
        </SectionWrapper>

        <SectionWrapper className="bg-radial-[at_40%_80%] from-[#547792]/20 via-[#000080]/40 to-[#000000]/80">
          <div className="glass-card rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden group border-white/10 shadow-3xl shadow-neon-blue/5">
            <div className="absolute inset-0  from-neon-blue/5 to-transparent opacity-40" />
            <ArtworkCTA />
          </div>
        </SectionWrapper>

        <SectionWrapper id="help" className="bg-radial-[at_40%_30%] from-[#547792]/20 via-[#000080]/40 to-[#000000]/80">
          <div className="glass-card rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden group border-white/10 shadow-3xl shadow-neon-purple/5">
            <div className="absolute inset-0  from-neon-purple/5 to-transparent opacity-40" />
            <Newsletter />
          </div>
        </SectionWrapper>

        <Footer />

        {/* AI Prompt Agent UI */}
        <PromptAgentPanel />
      </main>
    </AgentProvider>
  );
}
