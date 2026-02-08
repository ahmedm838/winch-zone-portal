import dayjs from "dayjs";

export function fmtDate(d: string | Date) {
  return dayjs(d).format("DD-MM-YY");
}

export function fmtMoney(n: number) {
  return n.toLocaleString(undefined);
}
