export class EapInvite {
  private constructor(private readonly _id: string) {}

  public static fromPersistence(props: { id: string }) {
    return new EapInvite(props.id);
  }

  public get id() {
    return this._id;
  }

  public toObject() {
    return {
      id: this._id,
    };
  }
}
