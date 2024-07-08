export class ReserveFinalValueHelper {
  public static async execute(
    start_date: Date,
    end_date: Date,
    value_per_day: number,
  ): Promise<number> {
    const days =
      (end_date.getTime() - start_date.getTime()) / (1000 * 3600 * 24);

    const finalValue = days * value_per_day;

    return finalValue;
  }
}
