import { Brands } from "@/components/brands/Brands";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/hero/Hero";
import { Insights } from "@/components/insights/Insights";
import { Marquee } from "@/components/marquee/Marquee";
import { Numbers } from "@/components/numbers/Numbers";
import { Packages } from "@/components/packages/Packages";
import { Reels } from "@/components/reels/Reels";
import { Services } from "@/components/services/Services";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Marquee />
        <Numbers />
        <Reels />
        <Insights />
        <Services />
        <Brands />
        <Packages />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
