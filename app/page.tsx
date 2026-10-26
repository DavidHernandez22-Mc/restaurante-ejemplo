import { OrderProvider } from "@/components/OrderProvider";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import StickyNav from "@/components/StickyNav";
import DemoBar from "@/components/DemoBar";
import Hero from "@/components/Hero";
import TapeBand from "@/components/TapeBand";
import Menu from "@/components/Menu";
import Combos from "@/components/Combos";
import WhyUs from "@/components/WhyUs";
import Reviews from "@/components/Reviews";
import Location from "@/components/Location";
import Footer from "@/components/Footer";
import OrderTicket from "@/components/OrderTicket";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <OrderProvider>
      <Loader />
      <Cursor />
      <DemoBar />
      <StickyNav />
      <main>
        <Hero />
        <TapeBand />
        <Menu />
        <Combos />
        <WhyUs />
        <Reviews />
        <Location />
      </main>
      <Footer />
      <OrderTicket />
      <WhatsAppButton />
      <div className="grain" aria-hidden="true" />
    </OrderProvider>
  );
}
