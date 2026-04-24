import Image from "next/image";
import Link from "next/link";

const foodHighlights = [
  {
    id: "pizza",
    title: "Craft Pizza",
    description: "House-made dough, aged for 48 hours. Topped with artisan mozzarella and premium local ingredients.",
    image: "/images/food/pizza.png",
    tag: "Signature"
  },
  {
    id: "wings",
    title: "The Wings",
    description: "Smoked in-house then flash-fried for the perfect crunch. Choose your signature OB rub.",
    image: "/images/food/wings.png",
    tag: "Local Favorite"
  },
  {
    id: "sides",
    title: "Signature Sides",
    description: "From OB Mac to Truffle Fries, we don't do 'standard' sides. Everything is built from scratch.",
    image: "/images/food/crab_dip.png",
    tag: "Hand-crafted"
  },
  {
    id: "drafts",
    title: "Cold Drafts",
    description: "A curated rotation of Greenville's best craft brews and classic game-day favorites.",
    image: "/images/food/beer.png",
    tag: "Crafted"
  },
];

const Menu = () => {
  return (
    <section id="menu" className="bg-[#0A0A0A] py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-sm mb-4 block">
            The Lineup
          </span>
          <h2 className="text-white text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6">
            Signature Food Spotlight
          </h2>
          <p className="text-gray-400 text-lg font-medium leading-relaxed">
            We’ve taken your favorite game-day staples and dialed them in. No shortcuts, just better ingredients and a kitchen that cares.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {foodHighlights.map((item) => (
            <div 
              key={item.id} 
              className="group relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden border border-white/10"
            >
              <Image 
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="absolute top-6 left-6">
                <span className="px-3 py-1 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                  {item.tag}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 transform group-hover:translate-y-[-10px] transition-transform duration-500">
                <h3 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base font-medium leading-relaxed max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {item.description}
                </p>
                <div className="mt-6">
                  <Link href="/menu" className="inline-flex items-center gap-2 text-[#D4AF37] font-black uppercase tracking-widest text-xs">
                    View Full Lineup 
                    <span className="text-xl leading-none">›</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/menu">
            <button className="px-12 py-5 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-lg hover:bg-white/10 transition-all">
              See the Full Menu
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Menu;
