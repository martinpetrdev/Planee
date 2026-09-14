import Home from "@expo/material-symbols/home.xml";
import CalendarToday from "@expo/material-symbols/calendar_today.xml";
import Settings from "@expo/material-symbols/settings.xml";
import Add from "@expo/material-symbols/add.xml";
import Logout from "@expo/material-symbols/logout.xml";

export const Icons = {
  home: Home,
  calendar_today: CalendarToday,
  settings: Settings,
  add: Add,
  logout: Logout,
} as const;

export type Icon = keyof typeof Icons;
