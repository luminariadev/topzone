// src/lib/logging.ts
// Structured logging utility with levels, context, and performance tracking

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

const LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.CRITICAL]: 'CRITICAL',
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: '#888',
  [LogLevel.INFO]: '#39FF14',
  [LogLevel.WARN]: '#FFFF00',
  [LogLevel.ERROR]: '#FF007F',
  [LogLevel.CRITICAL]: '#FF0000',
};

interface LogContext {
  module?: string;
  userId?: string;
  orderId?: string;
  [key: string]: string | number | boolean | undefined;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  name: string;
  message: string;
  context?: LogContext;
  duration?: number;
}

class Logger {
  private level: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private formatEntry(entry: LogEntry): string {
    const parts = [
      `[${entry.timestamp}]`,
      `[${LEVEL_NAMES[entry.level]}]`,
      entry.name ? `[${entry.name}]` : '',
      entry.message,
    ];

    if (entry.duration !== undefined) {
      parts.push(`(+${entry.duration}ms)`);
    }

    if (entry.context && Object.keys(entry.context).length > 0) {
      parts.push(JSON.stringify(entry.context));
    }

    return parts.filter(Boolean).join(' ');
  }

  private addEntry(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  // ─── Public logging methods ───────────────────────────────

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      name: '',
      message,
      context,
    };
    this.addEntry(entry);
    console.debug(`%c${this.formatEntry(entry)}`, `color:${LEVEL_COLORS[LogLevel.DEBUG]};font-weight:bold`);
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      name: '',
      message,
      context,
    };
    this.addEntry(entry);
    console.info(`%c${this.formatEntry(entry)}`, `color:${LEVEL_COLORS[LogLevel.INFO]};font-weight:bold`);
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      name: '',
      message,
      context,
    };
    this.addEntry(entry);
    console.warn(`%c${this.formatEntry(entry)}`, `color:${LEVEL_COLORS[LogLevel.WARN]};font-weight:bold`);
  }

  error(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      name: '',
      message,
      context,
    };
    this.addEntry(entry);
    console.error(`%c${this.formatEntry(entry)}`, `color:${LEVEL_COLORS[LogLevel.ERROR]};font-weight:bold`);
  }

  critical(message: string, context?: LogContext): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.CRITICAL,
      name: '',
      message,
      context,
    };
    this.addEntry(entry);
    // Always log critical — even if level is set higher
    console.error(`%c[CRITICAL] ${this.formatEntry(entry)}`, `color:${LEVEL_COLORS[LogLevel.CRITICAL]};font-weight:bold;font-size:1.2em`);
  }

  // ─── Named logger ──────────────────────────────────────────

  /**
   * Get a named logger for a specific module
   */
  module(name: string): NamedLogger {
    return new NamedLogger(name, this);
  }

  // ─── Performance tracking ──────────────────────────────────

  /**
   * Wrap an async function with performance logging
   */
  async track<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = Math.round(performance.now() - start);
      this.info(`[PERF] ${name} completed`, { duration_ms: duration });
      return result;
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      this.error(`[PERF] ${name} failed after ${duration}ms`, {
        duration_ms: duration,
        error: String(err),
      });
      throw err;
    }
  }

  // ─── Log retrieval ─────────────────────────────────────────

  getRecentLogs(count = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(e => e.level >= level);
  }

  clearLogs(): void {
    this.logs = [];
  }
}

class NamedLogger {
  constructor(
    private name: string,
    private parent: Logger
  ) {}

  debug(message: string, context?: LogContext): void {
    this.parent.debug(`[${this.name}] ${message}`, context);
  }

  info(message: string, context?: LogContext): void {
    this.parent.info(`[${this.name}] ${message}`, context);
  }

  warn(message: string, context?: LogContext): void {
    this.parent.warn(`[${this.name}] ${message}`, context);
  }

  error(message: string, context?: LogContext): void {
    this.parent.error(`[${this.name}] ${message}`, context);
  }

  critical(message: string, context?: LogContext): void {
    this.parent.critical(`[${this.name}] ${message}`, context);
  }

  async track<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return this.parent.track(`${this.name}:${name}`, fn);
  }
}

// Singleton export
export const logger = new Logger();

// Convenience: module-specific logger
export function createLogger(name: string): NamedLogger {
  return logger.module(name);
}