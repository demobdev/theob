import Image from "next/image";
import Link from "next/link";

export default function AltHomeShopCollection() {
  return (
    <section id="shop" className="ob-canvas relative z-20 bg-white px-4 pb-16 pt-[26rem] text-[#05070B] sm:px-6 sm:pt-[30rem] lg:pt-[34rem]">
      <div className="ob-surface mx-auto grid max-w-[1600px] items-center gap-10 rounded-[28px] bg-white p-6 shadow-[0_24px_90px_rgba(0,0,0,0.24)] md:grid-cols-[0.9fr_1.1fr] md:p-12 xl:p-16">
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#05070B]/65">
            Coming March
          </p>
          <h2 className="font-montserrat text-5xl font-black uppercase leading-[0.85] tracking-[-0.08em] sm:text-7xl">
            Shop The
            <br />
            Collection
          </h2>
          <p className="mt-6 max-w-md text-sm font-semibold leading-relaxed text-[#05070B]/70">
            The first Owner&apos;s Box shirt drop gets a clean feature here. Swap in the real
            shirt photo when it&apos;s ready and this branch is ready to show.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex rounded-full border-2 border-[#05070B] bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#05070B] shadow-[3px_3px_0_#05070B] transition-transform hover:-translate-y-0.5"
          >
            Join The List
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="rounded-[32px] border-2 border-[#05070B]/10 bg-white p-3 shadow-[0_18px_60px_rgba(0,0,0,0.14)] sm:p-5">
            <div className="relative aspect-[0.86/1] overflow-hidden rounded-[24px] bg-white">
              <Image
                src="/images/ob-crew.png"
                alt="Black Owner's Box crew shirt with gold chest logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, 560px"
                priority={false}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#05070B]/65">
                OB Crew Tee
              </p>
              <span className="rounded-full border-2 border-[#05070B] px-3 py-1 text-[8px] font-black uppercase tracking-widest">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
