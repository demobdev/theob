import { useClerk } from "@clerk/clerk-react";
import { LogOut, Paintbrush2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export function UserNav({
  image,
  name,
  email,
}: {
  image: string;
  name: string;
  email: string;
}) {
  const { signOut } = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-[#D4AF37]/30 hover:ring-[#D4AF37]/50"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>
              <img src={"/images/profile.png"} alt={name} />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-2xl shadow-2xl z-[1001] p-2"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal px-2 py-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-black uppercase tracking-tight leading-none text-white">
              {name}
            </p>
            <p className="text-xs leading-none text-gray-500">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <Link href="/notes">
          <DropdownMenuItem className="hover:cursor-pointer rounded-xl text-white/80 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] focus:bg-[#D4AF37]/10 focus:text-[#D4AF37]">
            <Paintbrush2 className="mr-2 h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Dashboard
            </span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={() => signOut()}
          className="hover:cursor-pointer rounded-xl text-white/80 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] focus:bg-[#D4AF37]/10 focus:text-[#D4AF37]"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Log out
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
