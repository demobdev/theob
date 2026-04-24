import React from "react";
import { Trophy, Zap, Star, Users } from "lucide-react";

const features = [
  {
    title: "Game Day, Dialed In",
    description: "Check what’s playing, what’s live, and where the action is before you even head out.",
    icon: Trophy,
  },
  {
    title: "Order Without the Friction",
    description: "Skip third-party chaos. Order direct for pickup or dine-in and get the smoothest path from craving to checkout.",
    icon: Zap,
  },
  {
    title: "Rewards for Regulars",
    description: "Earn points on the food you already love and unlock real menu items, not throwaway gimmicks.",
    icon: Star,
  },
  {
    title: "Local Favorite Energy",
    description: "Big screens, bold food, cold drinks, and the kind of place people actually want to make their spot.",
    icon: Users,
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-[#0A0A0A] py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-sm mb-4 block">
            Built for Regulars
          </span>
          <h2 className="text-white text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6">
            More than a sports bar. <br /> A smarter local favorite.
          </h2>
          <p className="text-gray-400 text-lg font-medium leading-relaxed">
            The Owner’s Box is designed around the way real guests order, watch, and come back. Great food matters. Easy reordering matters. Rewards matter. Knowing what game is on before you walk in matters. We built all of it into one experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="premium-card p-8 group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="h-14 w-14 rounded-xl gold-gradient flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="text-black h-8 w-8" />
              </div>
              <h3 className="text-white text-xl font-bold uppercase tracking-tight mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
