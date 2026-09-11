import Home from "@expo/material-symbols/home.xml";
import CalendarToday from "@expo/material-symbols/calendar_today.xml";
import Settings from "@expo/material-symbols/settings.xml";

export const Icons = {
  home: Home,
  calendar_today: CalendarToday,
  settings: Settings,
} as const;

export type Icon = keyof typeof Icons;
