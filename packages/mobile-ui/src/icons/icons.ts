import Home from "@expo/material-symbols/home.xml";
import CalendarToday from "@expo/material-symbols/calendar_today.xml";
import Settings from "@expo/material-symbols/settings.xml";
import Add from "@expo/material-symbols/add.xml";
import Logout from "@expo/material-symbols/logout.xml";
import NoteAdd from "@expo/material-symbols/note_add.xml";
import NotificationAdd from "@expo/material-symbols/notification_add.xml";
import AddTask from "@expo/material-symbols/add_task.xml";

export const Icons = {
  home: Home,
  calendar_today: CalendarToday,
  settings: Settings,
  add: Add,
  logout: Logout,
  note_add: NoteAdd,
  notification_add: NotificationAdd,
  task_add: AddTask,
} as const;

export type IconType = keyof typeof Icons;
