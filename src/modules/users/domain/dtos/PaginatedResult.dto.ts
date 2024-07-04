export class PaginatedResultDto<T> {
  readonly users: T[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
  readonly offsets: number;

  constructor(users: T[], total: number, limit: number, offset: number) {
    this.users = users;
    this.total = total;
    this.limit = limit;
    this.offset = offset;
    this.offsets = Math.ceil(total / limit);
  }
}
