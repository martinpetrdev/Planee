import Home from "@expo/material-symbols/home.xml";
import CalendarToday from "@expo/material-symbols/calendar_today.xml";

export const Icons = {
  home: Home,
  calendar_today: CalendarToday,
} as const;

export type Icon = keyof typeof Icons;
