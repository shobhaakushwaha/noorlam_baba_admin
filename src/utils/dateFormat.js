import moment from "moment-timezone";

const getTimezone = () => {
  try {
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    return timeZone;
  } catch (error) {
    console.error("Error retrieving timezone:", error);
  }
};

export const dateFormat = (date) => {
  const timezone = getTimezone();
  return date ? moment(date).tz(timezone).format("DD MMMM YYYY") : "";
};

export const dayFormat = (date) => {
  const timezone = getTimezone();
  return date ? moment(date).tz(timezone).format("DD") : "";
};

export const yearFormat = (date) => {
  const timezone = getTimezone();
  const targetDate = date ? moment(date) : moment();
  return targetDate.tz(timezone).format("YYYY");
};

// in utc

export const dateFormatUtc = (date) => {
  const timezone = getTimezone();
  return date
    ? moment(date).tz(timezone).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
    : "";
};

export const dateFormatWithTime = (date) => {
  const timezone = getTimezone();
  return date ? moment(date).tz(timezone).format("DD MMM YYYY, hh:mm A") : "";
};

export const month = () => {
  return [
    { name: "January", value: "1" },
    { name: "February", value: "2" },
    { name: "March", value: "3" },
    { name: "April", value: "4" },
    { name: "May", value: "5" },
    { name: "June", value: "6" },
    { name: "July", value: "7" },
    { name: "August", value: "8" },
    { name: "September", value: "9" },
    { name: "October", value: "10" },
    { name: "November", value: "11" },
    { name: "December", value: "12" },
  ];
};

export const formatToDDMMYYYY = (isoDate) => {
  if (!isoDate) return "";
  return moment(isoDate).format("DD-MM-YYYY");
};

export const toDate = (date) => {
  return moment(date).toDate();
};

export const toIsoDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString();
};

// Function to get the start of the day from a date

export const getStartDay = (date) => {
  if (!date) return null;
  return moment(date).startOf("day").toDate();
};

// Function to get the end of the day from a date

export const getEndDay = (date) => {
  if (!date) return null;
  return moment(date).endOf("day").toDate();
};

// Function to check if endDate is greater than startDate

export const isEndDateGreater = (startDate, endDate) => {
  if (!startDate || !endDate) return false;

  const start = getEndDay(startDate);
  const end = moment(endDate).toDate();

  return moment(end).isAfter(start);
};

// ----------convert into 24hr format for hotel checkin

// export const checkInOutTo24HrFormat = (time) => {
//   return moment(time, "HH:mm").format("h:mm A");
// };

export const checkInOutTo24HrFormat = (time) => {
  return moment(time).format("HH:mm"); // 24-hour format
};

export const todayOryesterdayFormat = (date) => {
  if (!date) return "";

  const timezone = getTimezone();
  const now = moment().tz(timezone);
  const givenDate = moment(date).tz(timezone);

  if (now.isSame(givenDate, "day")) {
    return "Today";
  }

  return givenDate.format("DD MMMM YYYY");
};

// -------------liek this 14 Dec 2025

export const formatDate = (isoDate, tz = "Asia/Kolkata") => {
  if (!isoDate) return "--";

  const m = moment(isoDate).tz(tz);

  if (!m.isValid()) return "--";

  return m.format("DD MMM YYYY");
};



export const formatDisplayDate = (value) => {
  if (!value) return "";

  const d = moment(value);

  if (!d.isValid()) return "";

  return d.format("DD-MMM-YYYY");
};


export const formatDateInToYYMMDD = (isoDate, tz = "Asia/Kolkata") => {
  if (!isoDate) return "--";

  const m = moment(isoDate).tz(tz);
  if (!m.isValid()) return "--";

  return m.format("YYYY-MM-DD");   // is wanted like this:--->  2025-11-25
};

export const formatDates = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


