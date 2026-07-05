import moment from "moment";

export const baseDateFormat = (date: Date | undefined, format: string = 'DD MMM YYYY'): string => {
  if (!date) return "";
  return moment(date).format(format);
};

export const baseDateTimeFormat = (date: Date | undefined, format: string = 'DD MMM YYYY HH:mm'): string => {
  if (!date) return "";
  return moment(date).format(format);
};

export const baseTimeFormat = (date: Date | undefined, format: string = 'HH:mm'): string => {
  if (!date) return "";
  return moment(date).format(format);
};

export const baseDateFormatFromNow= (date: Date | undefined): string => {
  if (!date) return "";
  return moment(date).fromNow();
};