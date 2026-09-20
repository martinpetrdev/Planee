"use client";

import Image from "next/image";
import { NavbarLinks, TNavbarLinks } from "./navbar-links";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react";

interface INavbarProps {
  links: TNavbarLinks;
  buttonLabel: string;
  buttonHref: string;
}

export function Navbar(props: INavbarProps) {
  return (
    <div className="w-full flex items-center justify-center h-22 fixed top-0 left-0 right-0 bg-background">
      <nav className="max-w-220 flex flex-1 flex-row items-center justify-between">
        <div className="w-32 flex items-center justify-start">
          <Image
            src={"/assets/images/logo_base_monochromatic.svg"}
            alt="Planee logo"
            width={128}
            height={128}
            className="w-16 h-16"
          />
        </div>
        <NavbarLinks links={props.links} />
        <Link
          href={props.buttonHref}
          className="w-32 flex items-center justify-end"
        >
          <Button size="lg">
            <p>{props.buttonLabel}</p>
            <ArrowRightIcon className="mt-0.5 size-4" />
          </Button>
        </Link>
      </nav>
    </div>
  );
}
