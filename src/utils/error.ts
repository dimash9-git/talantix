export class HTTPError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "HTTPError";
    this.status = status;
    Object.setPrototypeOf(this, HTTPError.prototype);
  }
}
