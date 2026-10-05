import {
  BackgroundNotificationTaskResult,
  registerTaskAsync,
} from 'expo-notifications';
import { defineTask } from 'expo-task-manager';
import type { SeciosConnection } from 'secios';

import type { AppEventType } from '@repo/shared';

import { eventsStream } from '@/api/modules/events';
import { oidcClient } from '@/auth/oidc';
import { Logger } from '@/utils/logger';

export interface IncomingEvent {
  id: string;
  event: AppEventType;
  payload: Record<string, unknown>;
}

/**
 * Application-level event handler. Takes events from multiple sources (SSE + headless expo push) and
 * fires appropriate listeners (registered either globally or from react) while having some (but not
 * guaranteed) id-based deduplication (first received event with the specific ID wins).
 */
export class EventHandler {
  private static _instance: EventHandler | undefined;
  private _initialized = false;
  private _destroyed = false;
  private _sse: SeciosConnection | undefined;

  private _recentlyHandledIds: string[] = [];

  private logger = Logger.for('EventHandler');
  private listeners: Map<
    AppEventType,
    ((data: Record<string, unknown>) => void)[]
  > = new Map();

  public static readonly EXPO_PUSH_TASK_ID = 'ExpoPushTask' as const;

  constructor() {
    // Register OIDC session listeners to correctly initialize/destroy depending on user's session
    oidcClient.onNewSession(() => this.initialize());
    oidcClient.onSessionDestroy(() => this.destroy());

    defineTask<{
      data: {
        body: string;
      };
    }>(EventHandler.EXPO_PUSH_TASK_ID, async (body) => {
      await this.handleEvent(JSON.parse(body.data.data.body), 'epn');

      return BackgroundNotificationTaskResult.NoData;
    });
  }

  /**
   * Returns the current EventHandler instance.
   */
  public static get instance(): EventHandler {
    if (!EventHandler._instance) EventHandler._instance = new EventHandler();

    return EventHandler._instance;
  }

  /**
   * Returns true if the event handler is initialized and not destroyed.
   */
  public get initialized() {
    return this._initialized && !this._destroyed;
  }

  /**
   * Initializes the event handler
   */
  public async initialize() {
    if (this.initialized) return;

    await this.initializeExpoPushReceiver();

    this.logger.info('Initialized');
    this._initialized = true;
    this._destroyed = false;
  }

  /**
   * Initializes background task that gets triggered by headless expo push notification
   * @private
   */
  private async initializeExpoPushReceiver() {
    await registerTaskAsync(EventHandler.EXPO_PUSH_TASK_ID);
  }

  /**
   * Handles and (not always) deduplicates the received event
   * @param event Incoming event
   * @param source Source of the event (sse or epn)
   * @private
   */
  private async handleEvent(event: IncomingEvent, source: 'sse' | 'epn') {
    if (!event.id || !event.event)
      return this.logger.error(`Event ${event.id} from ${source} is invalid.`);
    this.logger.info(`Received event: ${event.id}, source: ${source}`);

    if (this.checkRecentlyHandled(event.id)) {
      this.logger.warn(`Event ${event.id} was recently handled. Throwing out.`);

      return;
    }

    this.markRecentlyHandled(event.id);
    this.listeners.get(event.event)?.forEach((listener) => {
      listener(event.payload);
    });
  }

  /**
   * Destroyes the event handler and closes all open connections.
   * @private
   */
  private destroy() {
    this._sse?.close();
    this._destroyed = true;
    this._initialized = false;

    this.logger.info('Destroyed');
  }

  /**
   * Checks if the event with given ID was already recently handled. This is **NOT** guaranteed
   * to be always accurate: never marks unhandled event as handled, but handled can be marked as unhandled.
   * @param id ID of the event
   * @private
   */
  private checkRecentlyHandled(id: string) {
    return this._recentlyHandledIds.includes(id);
  }

  /**
   * Marks the event with given ID as already recently handled for it to be deduplicated later (not guaranteed).
   * @param id ID of the event
   * @private
   */
  private markRecentlyHandled(id: string) {
    this._recentlyHandledIds.push(id);

    // If too long, remove first
    if (this._recentlyHandledIds.length > 100) this._recentlyHandledIds.pop();
  }

  public async connectSSE() {
    if (!this.initialized)
      return this.logger.error('EventHandler not initialized');
    if (!(await oidcClient.isLoggedIn()))
      return this.logger.error('User not logged in');
    if (this._sse) this._sse.close();

    this.logger.info('EventHandler connected to SSE');

    this._sse = await eventsStream();
    this._sse.onError((err) => {
      this.logger.error(err);

      setTimeout(() => this.connectSSE(), 1000);
    });
    this._sse.onAny((event, data) => {
      if (event === 'ping') return; // Ignored, only to prevent the proxy from closing connection

      const parsed = JSON.parse(data.data);

      this.handleEvent(
        {
          id: data.id,
          event: event as AppEventType,
          payload: parsed,
        },
        'sse',
      );
    });
  }

  public async disconnectSSE() {
    this._sse?.close();
    this._sse = undefined;

    this.logger.info('EventHandler disconnected from SSE');
  }

  /**
   * Attaches a listener for a given event name.
   * @param eventId Name of the event
   * @param handler Handler that gets called when the event fires.
   */
  public on(
    eventId: AppEventType,
    handler: (data: Record<string, unknown>) => void,
  ) {
    if (!this.listeners.has(eventId)) this.listeners.set(eventId, []);

    this.listeners.set(eventId, [...this.listeners.get(eventId)!, handler]);

    return () => {
      this.listeners.delete(eventId);
    };
  }
}
