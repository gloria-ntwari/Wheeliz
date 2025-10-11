import React from "react";
import { Button } from "../../../../components/ui/button";

const navigationItems = [
  { label: "About Us", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "WHERE TO BUY", href: "#where-to-buy" },
  { label: "CONTACT US", href: "#contact" },
];

export const MainContentSection = (): JSX.Element => {
  return (
    <nav className="flex w-full items-center justify-center gap-2.5 px-[97px] py-[30px]">
      <div className="flex items-center justify-center gap-[50px]">
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent"
          asChild
        >
          <a href={navigationItems[0].href}>
            <span className="[font-family:'Barlow',Helvetica] font-semibold text-[#68161c] text-[25px] tracking-[0] leading-[normal]">
              {navigationItems[0].label}
            </span>
          </a>
        </Button>

        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent"
          asChild
        >
          <a href={navigationItems[1].href}>
            <span className="[font-family:'Barlow',Helvetica] font-semibold text-[#68161c] text-[25px] tracking-[0] leading-[normal] whitespace-nowrap">
              {navigationItems[1].label}
            </span>
          </a>
        </Button>

        <img
          className="w-[325.33px] h-[105.2px]"
          alt="Clip path group"
          src="/clip-path-group-15.png"
        />

        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent"
          asChild
        >
          <a href={navigationItems[2].href}>
            <span className="[font-family:'Barlow',Helvetica] font-semibold text-[#68161c] text-[25px] tracking-[0] leading-[normal] whitespace-nowrap">
              {navigationItems[2].label}
            </span>
          </a>
        </Button>

        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent"
          asChild
        >
          <a href={navigationItems[3].href}>
            <span className="[font-family:'Barlow',Helvetica] font-semibold text-[#68161c] text-[25px] tracking-[0] leading-[normal] whitespace-nowrap">
              {navigationItems[3].label}
            </span>
          </a>
        </Button>
      </div>
    </nav>
  );
};
