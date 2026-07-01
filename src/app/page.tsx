import Hero from "@/components/Hero";
import Invitation from "@/components/Invitation";
import Story from "@/components/Story";
import Details from "@/components/Details";
import Schedule from "@/components/Schedule";
import Rsvp from "@/components/Rsvp";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import Cover from "@/components/Cover";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <Invitation />
        <SectionDivider />
        <Story />
        <SectionDivider />
        <Details />
        <SectionDivider />
        <Schedule />
        <SectionDivider />
        <Rsvp />
      </main>
      <Footer />
      <Cover />
    </>
  );
}
