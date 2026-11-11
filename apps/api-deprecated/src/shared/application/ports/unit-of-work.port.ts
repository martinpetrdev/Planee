export abstract class UnitOfWorkPort {
  abstract run<T>(work: () => Promise<T>): Promise<T>;
}
