export class PaginatedCarResultDto<T> {
  readonly cars: T[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
  readonly offsets: number;

  constructor(cars: T[], total: number, limit: number, offset: number) {
    this.cars = cars;
    this.total = total;
    this.limit = limit;
    this.offset = offset;
    this.offsets = Math.ceil(total / limit);
  }
}
