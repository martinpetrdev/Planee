export type Notification =
  | {
      silent?: false;
      title: string;
      body: string;
      data?: Record<string, string>;
    }
  | {
      silent: true;
      data: Record<string, string>;
    };
