import Image from "next/image";
import { menuData } from "@/lib/menuData";

const Menu = () => {
  return (
    <section id="menu" className="bg-zinc-50 py-20">
      <div className="container mx-auto px-6 lg:px-0">
        <div className="text-center mb-16">
          <p className="text-[#d4af37] font-semibold tracking-wider uppercase text-sm mb-3">Our Offerings</p>
          <h2 className="text-black text-4xl sm:text-5xl font-montserrat font-bold mb-4">The Menu</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
            Experience our scratch-made kitchen featuring premium dry-aged steaks, artisan pizzas, and game-day classics elevated to a new level.
          </p>
        </div>

        <div className="flex flex-col gap-20">
          {menuData.map((category) => (
            <div key={category.id} className="relative">
              <h3 className="text-3xl font-montserrat font-bold text-black border-b-2 border-zinc-200 pb-4 mb-8 inline-block">
                {category.title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-10">
                {category.items.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    {/* Placeholder for AI generated images */}
                    {item.imageKey ? (
                      <div className="w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-zinc-200 relative shadow-md">
                        <Image 
                          src={`/images/food/${item.imageKey}.png`}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized // using unoptimized temporarily in case images aren't found initially
                        />
                      </div>
                    ) : (
                      <div className="w-28 h-28 shrink-0 rounded-xl bg-zinc-200 shadow-inner flex items-center justify-center text-zinc-400">
                        <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
                      </div>
                    )}
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-baseline border-b border-zinc-200 pb-1 mb-2">
                        <h4 className="text-xl font-bold font-montserrat text-black truncate pr-4">{item.name}</h4>
                        {item.price && <span className="text-[#d4af37] font-semibold">{item.price}</span>}
                      </div>
                      <p className="text-zinc-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
