import { NativeModule, requireOptionalNativeModule } from 'expo';

declare class NothingGlyphModule extends NativeModule {
  isSupported(): boolean;
  deviceName(): string;
  open(): Promise<void>;
  toggle(channels: number[]): void;
  animate(channels: number[], period?: number, cycles?: number, interval?: number): void;
  displayProgress(channels: number[], progress: number, reverse?: boolean): void;
  turnOff(): void;
  close(): void;
}

// null on web + ios
export default requireOptionalNativeModule<NothingGlyphModule>('NothingGlyph');
