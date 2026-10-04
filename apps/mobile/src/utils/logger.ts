class AppLogger {
  private readonly scopeName: string | undefined;

  constructor(scopeName?: string) {
    this.scopeName = scopeName;
  }

  private log(level: 'info' | 'warn' | 'error', ...args: unknown[]): void {
    console.log(
      `PLANEE${this.scopeName ? `::${this.scopeName}` : ''} (${level}):`,
      ...args,
    );
  }

  public info(...args: unknown[]) {
    this.log('info', ...args);
  }

  public warn(...args: unknown[]) {
    this.log('warn', ...args);
  }

  public error(...args: unknown[]) {
    this.log('error', ...args);
  }

  public for(scopeName: string | undefined) {
    return new AppLogger(scopeName);
  }
}

export const Logger = new AppLogger();
