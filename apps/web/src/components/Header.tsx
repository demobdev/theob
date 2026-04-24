"use client";

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Logo from "./common/Logo";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import { UserNav } from "./common/UserNav";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag } from "lucide-react";

const navigation = [
  { name: "Menu", href: "/menu" },
  { name: "Live Games", href: "/games" },
  { name: "The Roster", href: "/rewards" },
  { name: "Locations", href: "/locations" },
];

const moreLinks = [
  { name: "Private Events", href: "/events" },
  { name: "About the Box", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "FAQ", href: "/faq" },
];

export default function Header() {
  const { user } = useUser();
  const pathname = usePathname();
  const { items, fulfillment, location, setFulfillmentModalOpen } = useCart();

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-[#D4AF37] text-black py-2 px-4 text-[10px] sm:text-xs font-black uppercase tracking-widest">
        <div className="container mx-auto flex justify-between items-center">
          
          {/* Fulfillment Toggle (Sonny's Style) */}
          <button 
            onClick={() => setFulfillmentModalOpen(true)}
            className="flex flex-col items-start leading-tight hover:opacity-70 transition-opacity text-left"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight">
                {fulfillment === "delivery" ? "Delivery" : fulfillment === "curbside" ? "Curbside Pickup" : "In-Store Pickup"} ASAP
              </span>
              <ChevronDownIcon className="h-3 w-3 stroke-[3]" />
            </div>
            <div className="text-[9px] opacity-70">
              at <span className="font-bold underline underline-offset-2">{location}</span> <span className="text-[#CC2027] font-black ml-1">Change</span>
            </div>
          </button>

          <div className="hidden sm:flex gap-4 items-center">
            <Link href="/rewards" className="hover:opacity-70 transition-opacity">Get $5 Off Your First Order</Link>
            <span className="opacity-30">|</span>
            <Link href="/menu" className="hover:opacity-70 transition-opacity italic">Order Online</Link>
          </div>
        </div>
      </div>

      <Disclosure as="nav" className="sticky top-0 z-[1000] bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5">
        {({ open }) => (
          <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-20 items-center justify-between">
                {/* Logo Section */}
                <div className="flex shrink-0 items-center">
                  <Logo />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex flex-1 justify-center px-8">
                  <div className="flex space-x-10">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#D4AF37]",
                          pathname === item.href ? "text-[#D4AF37]" : "text-white/70"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                    
                    {/* More Dropdown */}
                    <Menu as="div" className="relative">
                      <MenuButton className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-[#D4AF37] transition-all outline-none">
                        More <ChevronDownIcon className="h-3 w-3" />
                      </MenuButton>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems className="absolute right-0 mt-4 w-56 origin-top-right rounded-2xl bg-[#0F0F0F] border border-white/10 p-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[1001]">
                          <div className="absolute inset-0 leather-bg opacity-10 pointer-events-none rounded-2xl" />
                          {moreLinks.map((link) => (
                            <MenuItem key={link.name}>
                              {({ active }) => (
                                <Link
                                  href={link.href}
                                  className={cn(
                                    "block px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                                    active ? "bg-[#D4AF37] text-black" : "text-gray-400 hover:text-white hover:bg-white/5"
                                  )}
                                >
                                  {link.name}
                                </Link>
                              )}
                            </MenuItem>
                          ))}
                        </MenuItems>
                      </Transition>
                    </Menu>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="hidden sm:flex items-center gap-6">
                  {items.length > 0 && (
                    <Link href="/menu" className="relative text-white hover:text-[#D4AF37] transition-colors">
                       <ShoppingBag size={20} />
                       <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-black">
                          {items.length}
                       </span>
                    </Link>
                  )}
                  
                  {user ? (
                    <div className="flex items-center gap-6">
                      <Link href="/menu">
                        <button className="gold-gradient text-black font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl hover:scale-105 transition-all gold-glow">
                          Order Now
                        </button>
                      </Link>
                      <UserNav
                        image={user?.imageUrl}
                        name={user?.fullName!}
                        email={user?.primaryEmailAddress?.emailAddress!}
                      />
                    </div>
                  ) : (
                    <>
                      <Link href="/sign-in" className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-all">
                        Sign In
                      </Link>
                      <Link href="/menu">
                        <button className="gold-gradient text-black font-black uppercase tracking-widest text-[10px] px-8 py-3.5 rounded-xl hover:brightness-110 transition-all gold-glow">
                          Order Now
                        </button>
                      </Link>
                    </>
                  )}
                </div>

                {/* Mobile menu button */}
                <div className="flex items-center lg:hidden">
                  <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-[#D4AF37] hover:bg-[#1A1A1A] focus:outline-none transition-colors">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <DisclosurePanel className="lg:hidden bg-[#0A0A0A] border-b border-white/10">
              <div className="space-y-1 px-4 pb-10 pt-4">
                {[...navigation, ...moreLinks].map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as={Link}
                    href={item.href}
                    className={cn(
                      "block py-4 text-xl font-black uppercase tracking-tighter transition-all",
                      pathname === item.href ? "text-[#D4AF37]" : "text-white"
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
                  {!user && (
                    <Link href="/sign-in">
                      <DisclosureButton className="w-full py-4 text-center text-white/50 font-black uppercase tracking-widest text-xs border border-white/10 rounded-2xl">
                        Sign In
                      </DisclosureButton>
                    </Link>
                  )}
                  <Link href="/menu">
                    <DisclosureButton className="w-full py-5 text-center text-black gold-gradient font-black uppercase tracking-widest rounded-2xl gold-glow shadow-xl">
                      Order Now
                    </DisclosureButton>
                  </Link>
                </div>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </>
  );
}
