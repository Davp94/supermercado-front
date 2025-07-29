export class DateFormat {
  private static instance: DateFormat;

  private constructor() {}

  static getInstance(): DateFormat {
    if (!DateFormat.instance) {
      DateFormat.instance = new DateFormat();
    }
    return DateFormat.instance;
  }

  public static dateFormat(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
