import type { Appearance } from "@clerk/types";

/** OB brand: black header, #D4AF37 gold, cream/white text */
export const clerkAppearance: Appearance = {
  variables: {
    colorBackground: "#1a1a1a",
    colorText: "#ffffff",
    colorTextSecondary: "#9ca3af",
    colorPrimary: "#D4AF37",
    colorNeutral: "#ffffff",
    borderRadius: "0.75rem",
  },
  elements: {
    userButtonPopoverCard:
      "bg-[#1a1a1a] border border-[#D4AF37]/20 shadow-2xl rounded-2xl z-[1001]",
    userButtonPopoverActionButton:
      "text-white/80 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] rounded-xl transition-colors",
    userButtonPopoverActionButtonText:
      "text-white/80 font-bold uppercase text-[10px] tracking-widest group-hover:text-[#D4AF37]",
    userButtonPopoverFooter: "hidden",
    userPreviewMainIdentifier:
      "text-white font-black uppercase tracking-tight text-sm",
    userPreviewSecondaryIdentifier: "text-gray-500 text-xs",
    userButtonPopoverActions: "border-t border-white/10 p-1",
    avatarBox: "ring-2 ring-[#D4AF37]/30",
  },
};
