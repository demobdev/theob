import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-black relative overflow-hidden">
      {/* Subtle gold gradient glow to make it premium */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#d4af37] rounded-full blur-[140px] opacity-20 pointer-events-none" />
      
      <div className="container py-16 sm:py-36 px-6 sm:px-0 relative z-10">
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center sm:min-h-[690px]">
          <div className="flex-1 mt-12 sm:mt-0">
            <h2 className="font-montserrat pb-7 sm:pb-[26px] text-white text-[44px] sm:text-[75px] not-italic font-semibold leading-[1.1] tracking-tight">
              Premium Steaks. <br /> <span className="text-[#d4af37]">Craft Drafts.</span> <br /> Every Game.
            </h2>
            <p className="font-montserrat sm:pb-16 max-w-[680px] text-zinc-300 text-xl sm:text-2xl not-italic font-normal leading-relaxed pb-11">
              Welcome to The Owner's Box. Where exceptional dining meets the thrill of live sports. Reserve your table and elevate your game day.
            </p>
            <div className="flex gap-4">
              <Link href={"#menu"}>
                <button className="bg-[#d4af37] hover:bg-[#b5952f] transition-colors text-black px-8 py-4 font-montserrat text-lg sm:text-xl not-italic font-semibold rounded-[10px] shadow-lg">
                  View Menu
                </button>
              </Link>
              <Link href={"#sports"}>
                <button className="bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors px-8 py-4 font-montserrat text-lg sm:text-xl not-italic font-semibold rounded-[10px]">
                  Live Games
                </button>
              </Link>
            </div>
          </div>
          
          <div className="flex-1 w-full flex justify-center items-center relative">
            <div className="relative w-full max-w-[500px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
              <div className="absolute inset-0 bg-[#d4af37] opacity-10 mix-blend-overlay z-10"></div>
              <Image
                src={"/hero.png"}
                fill
                alt="The Owner's Box Experience"
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
