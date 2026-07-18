import moment from "moment";

export const baseDateFormat = (date: Date | undefined | null, format: string = 'DD MMM YYYY'): string => {
  if (!date) return "";
  return moment(date).format(format);
};

export const baseDateTimeFormat = (date: Date | undefined | null, format: string = 'DD MMM YYYY HH:mm'): string => {
  if (!date) return "";
  return moment(date).format(format);
};

export const baseTimeFormat = (date: Date | undefined | null, format: string = 'HH:mm'): string => {
  if (!date) return "";
  return moment(date).format(format);
};

export const baseDateFormatFromNow= (date: Date | undefined | null): string => {
  if (!date) return "";
  return moment(date).fromNow();
};