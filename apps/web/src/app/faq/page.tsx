import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import Link from "next/link";

export const metadata = {
  title: "FAQ | The Owner's Box",
};

const faqs = [
  {
    q: "What are your hours?",
    a: "Sun – Thu: 11AM – 11PM. Fri – Sat: 11AM – 1AM. Kitchen hours may vary on holidays — call ahead or check our locations page.",
  },
  {
    q: "Where are you located?",
    a: "1757 Woodruff Rd. STE A, Greenville, SC 29607. One location for dine-in and pickup.",
  },
  {
    q: "Can I order online?",
    a: "Browse the full menu on our website. For takeout, use the Order Takeout button to checkout on our Heartland online ordering site. We do not offer in-browser checkout on the web.",
  },
  {
    q: "Do you offer delivery?",
    a: "Yes — order delivery through DoorDash using the Order on DoorDash button on our site.",
  },
  {
    q: "Are mobile apps available?",
    a: "iOS and Android apps are coming soon. Live game schedules and more features will launch with the apps.",
  },
  {
    q: "What is curbside pickup?",
    a: "Order takeout through our online ordering site, then pick up at the restaurant. Call if you need help finding us when you arrive.",
  },
  {
    q: "Can I order alcohol for pickup?",
    a: "No. Alcohol cannot be ordered for pickup or takeout. Beer and wine are available for dine-in only, with ID checks at the bar.",
  },
  {
    q: "How do I see what games are on?",
    a: "We run major national matchups on 14 HD screens. Full TV schedules will be available in our mobile apps when they launch.",
  },
  {
    q: "Do you host private events?",
    a: "Yes — groups and watch parties. Visit our Private Events page or contact us through the location page form.",
  },
  {
    q: "Is there a dress code?",
    a: "Come as you are — game-day casual. We ask for respectful behavior so every guest enjoys the atmosphere.",
  },
  {
    q: "Do you accommodate dietary needs?",
    a: "Many items can be customized; ask your server or add special instructions when ordering. Major allergens are noted where available.",
  },
  {
    q: "How do I contact the restaurant?",
    a: "Use the contact form on our Locations page, email support@ownersboxgvl.com, or call (864) 555-0123 during business hours.",
  },
];

export default function FaqPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Header />
      <section className="container mx-auto px-4 py-24 max-w-2xl">
        <span className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">
          Help Center
        </span>
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-12">
          FAQ
        </h1>
        <div className="space-y-6">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="premium-card p-6 border-white/10 group"
            >
              <summary className="text-white font-black uppercase tracking-tight text-sm cursor-pointer list-none flex justify-between gap-4">
                {item.q}
                <span className="text-[#D4AF37] group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-400 text-sm font-medium leading-relaxed mt-4">
                {item.a}
              </p>
            </details>
          ))}
        </div>
        <p className="text-gray-500 text-sm mt-12">
          Still stuck?{" "}
          <Link href="/locations#contact" className="text-[#D4AF37] font-bold hover:underline">
            Contact us
          </Link>
        </p>
      </section>
      <Footer />
    </main>
  );
}
