import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505]">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: "bg-[#FFA500] hover:bg-orange-400 text-black font-bold uppercase text-xs tracking-widest",
            card: "bg-[#0f0f11] border border-[#1a1a1a] shadow-2xl",
            headerTitle: "text-white font-black tracking-tighter",
            headerSubtitle: "text-gray-500 font-bold",
            socialButtonsBlockButton: "bg-[#161618] border border-[#222] text-white hover:bg-[#222]",
            socialButtonsBlockButtonText: "text-white font-bold",
            dividerLine: "bg-[#222]",
            dividerText: "text-gray-600",
            formFieldLabel: "text-gray-400 font-black uppercase text-[10px] tracking-widest",
            formFieldInput: "bg-[#050505] border-[#1a1a1a] text-white focus:border-[#FFA500]",
            footerActionText: "text-gray-500",
            footerActionLink: "text-[#FFA500] hover:text-orange-400 font-bold"
          }
        }}
      />
    </div>
  );
}
