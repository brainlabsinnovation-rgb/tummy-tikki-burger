import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhyTummyTikki from '@/components/WhyTummyTikki';
import MenuGrid from '@/components/MenuGrid';
import Availability24x7 from '@/components/Availability24x7';
import ComboDeals from '@/components/ComboDeals';
import CustomerReviews from '@/components/CustomerReviews';
import OrderNow from '@/components/OrderNow';
import Location from '@/components/Location';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <WhyTummyTikki />
        <MenuGrid />
        <Availability24x7 />
        <ComboDeals />
        <CustomerReviews />
        <OrderNow />
        <Location />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
