export abstract class CryptoServicePort {
  abstract hash(data: string): Uint8Array<ArrayBuffer>;
  abstract generateRandomString(bytes: number): string;
}
