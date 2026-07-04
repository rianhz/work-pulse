import moment from "moment";

export const baseDateFormat = (date: Date | undefined): string => {
  if (!date) return "";
  return moment(date).format('DD MMM YYYY');
};

export const baseDateTimeFormat = (date: Date | undefined): string => {
  if (!date) return "";
  return moment(date).format('DD MMM YYYY HH:mm');
};

export const baseTimeFormat = (date: Date | undefined): string => {
  if (!date) return "";
  return moment(date).format('HH:mm');
};

export const baseDateFormatFromNow= (date: Date | undefined): string => {
  if (!date) return "";
  return moment(date).fromNow();
};