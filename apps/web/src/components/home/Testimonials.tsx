import React from "react";
import { Quote } from "lucide-react";

const TestimonialsData = [
  {
    quote: "Finally a spot in Greenville that cares as much about the food as the game. The pizza is actually better than most dedicated pizza spots.",
    name: "Michael R.",
    designation: "Greenville Local",
  },
  {
    quote: "The OB Wings are non-negotiable. Don’t even look at the rest of the menu until you’ve ordered them. Smoked, then fried, then perfect.",
    name: "Sarah T.",
    designation: "Roster Member",
  },
  {
    quote: "Easiest pickup experience I’ve had. Order in the app, walk in, game is on, food is ready. This is how hospitality should work.",
    name: "James D.",
    designation: "MVP Guest",
  },
];

const Testimonials = () => {
  return (
    <section id="reviews" className="bg-[#0A0A0A] py-24 noise-overlay relative overflow-hidden">
      {/* Decorative Gold Glow */}
      <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-sm mb-4 block">
            The Local Buzz
          </span>
          <h2 className="text-white text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6">
            Straight From the Roster.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {TestimonialsData.map((item, index) => (
            <div 
              key={index} 
              className="premium-card p-10 flex flex-col gap-6 relative group hover:bg-[#1A1A1A] transition-all"
            >
              <div className="text-[#D4AF37] opacity-20 absolute top-8 right-10">
                <Quote size={60} strokeWidth={3} />
              </div>
              
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-[#D4AF37] text-lg">★</span>
                ))}
              </div>

              <p className="text-gray-300 text-lg font-medium leading-relaxed italic relative z-10">
                “{item.quote}”
              </p>

              <div className="mt-auto pt-6 border-t border-white/5">
                <h4 className="text-white font-black uppercase tracking-widest text-sm">
                  {item.name}
                </h4>
                <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                  {item.designation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
