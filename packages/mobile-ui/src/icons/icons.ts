import Home from "@expo/material-symbols/home.xml";
import CalendarToday from "@expo/material-symbols/calendar_today.xml";
import Settings from "@expo/material-symbols/settings.xml";
import Add from "@expo/material-symbols/add.xml";

export const Icons = {
  home: Home,
  calendar_today: CalendarToday,
  settings: Settings,
  add: Add,
} as const;

export type Icon = keyof typeof Icons;
