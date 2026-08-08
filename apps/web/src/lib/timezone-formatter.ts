import moment from 'moment-timezone'

export function formatToLocalDateTime(utcString: string | Date, userTimezone: string = "UTC") {
  if (!utcString || !userTimezone) return "";
  return moment.utc(utcString).tz(userTimezone).format('DD MMM YYYY, HH:mm')
}

export function formatToLocalDate(utcString: string | Date, userTimezone: string = "UTC") {
  if (!utcString || !userTimezone) return "";
  return moment.utc(utcString).tz(userTimezone).format('DD MMM YYYY')
}

export function formatToLocalTime(utcString: string | Date, userTimezone: string = "UTC") {
  if (!utcString || !userTimezone) return "";
  return moment.utc(utcString).tz(userTimezone).format('HH:mm')
}