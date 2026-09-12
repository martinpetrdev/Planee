import { ApplicationShell, IApplicationTab } from "@repo/mobile-ui";

const Tabs: IApplicationTab[] = [
  {
    label: "Home",
    id: "index",
    icon: "home",
  },
  {
    label: "Settings",
    id: "settings",
    icon: "settings",
  },
];

export default function Layout() {
  return <ApplicationShell tabs={Tabs} />;
}
