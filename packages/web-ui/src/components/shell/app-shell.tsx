import { PropsWithChildren } from "react";
import { Navbar } from "./navbar";
import { TNavbarLinks } from "./navbar-links";

interface IAppShellProps extends PropsWithChildren {
  navbarLinks: TNavbarLinks;
  navbarButtonLabel: string;
  navbarButtonHref: string;
}

export function AppShell(props: IAppShellProps) {
  return (
    <div className="w-screen min-h-screen">
      <Navbar
        links={props.navbarLinks}
        buttonHref={props.navbarButtonHref}
        buttonLabel={props.navbarButtonLabel}
      />
      <main className="w-full h-full pt-22">{props.children}</main>
    </div>
  );
}
