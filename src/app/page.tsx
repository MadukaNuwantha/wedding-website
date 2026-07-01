import Hero from "@/components/Hero";
import Invitation from "@/components/Invitation";
import Story from "@/components/Story";
import Details from "@/components/Details";
import Schedule from "@/components/Schedule";
import Rsvp from "@/components/Rsvp";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Film-grain overlay for cinematic texture */}
      <div className="grain" aria-hidden="true" />
      <main className="flex-1">
        <Hero />
        <Invitation />
        <Story />
        <Details />
        <Schedule />
        <Rsvp />
      </main>
      <Footer />
    </>
  );
}
