import { ApplicationShell, IApplicationTab } from "@repo/mobile-ui";

const Tabs: IApplicationTab[] = [
  {
    label: "Home",
    icon: "home",
    id: "index",
  },
  {
    label: "Plan",
    icon: "calendar_today",
    id: "plan",
  },
  {
    label: "Settings",
    icon: "settings",
    id: "settings",
  },
];

export default function RootLayout() {
  return <ApplicationShell tabs={Tabs} />;
}
