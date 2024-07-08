export class PaginatedReserveResultDto<T> {
  readonly reserves: T[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
  readonly offsets: number;

  constructor(reserves: T[], total: number, limit: number, offset: number) {
    this.reserves = reserves;
    this.total = total;
    this.limit = limit;
    this.offset = offset;
    this.offsets = Math.ceil(total / limit);
  }
}
