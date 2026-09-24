export const Icons = {
  home: require("@expo/material-symbols/home.xml"),
  calendar_today: require("@expo/material-symbols/calendar_today.xml"),
  settings: require("@expo/material-symbols/settings.xml"),
  add: require("@expo/material-symbols/add.xml"),
  logout: require("@expo/material-symbols/logout.xml"),
  note_add: require("@expo/material-symbols/note_add.xml"),
  notification_add: require("@expo/material-symbols/notification_add.xml"),
  add_task: require("@expo/material-symbols/add_task.xml"),
  task_alt: require("@expo/material-symbols/task_alt.xml"),
  check: require("@expo/material-symbols/check.xml"),
  arrow_back: require("@expo/material-symbols/arrow_back.xml"),
  delete: require("@expo/material-symbols/delete.xml"),
  event_list: require("@expo/material-symbols/event_list.xml"),
} as const;

export type IconType = keyof typeof Icons;
