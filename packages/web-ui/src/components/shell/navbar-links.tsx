import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

interface INavbarLink {
  label: string;
  href: string;
}

interface INavbarDropdownItem {
  label: string;
  description: string;
  href: string;
}

interface INavbarDropdown {
  label: string;
  items: INavbarDropdownItem[];
}

export type TNavbarLinks = (INavbarLink | INavbarDropdown)[];

interface INavbarLinksProps {
  links: TNavbarLinks;
}

export function NavbarLinks(props: INavbarLinksProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {props.links.map((link, index) =>
          "items" in link ? (
            <NavigationMenuItem key={index}>
              <NavigationMenuTrigger className="text-sm">
                {link.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-96">
                  {link.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <NavigationMenuLink
                        render={
                          <Link
                            href={item.href}
                            target={
                              item.href.startsWith("/") ? "_self" : "_blank"
                            }
                          >
                            <div className="flex flex-col gap-1 text-sm">
                              <div className="leading-none font-medium">
                                {item.label}
                              </div>
                              <div className="line-clamp-2 text-muted-foreground">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        }
                      />
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={
                  <Link
                    href={link.href}
                    target={link.href.startsWith("/") ? "_self" : "_blank"}
                    className="text-sm"
                  >
                    {link.label}
                  </Link>
                }
              />
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
