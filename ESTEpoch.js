function convertDateTimeToESTEpoch(dateStr, timeStr) {
  const dateTimeStr = dateStr + "T" + timeStr + "Z";
  const dateTime = new Date(dateTimeStr);
  // console.log("Date time: ", dateTime.getUTCHours());
  dateTime.setUTCHours(dateTime.getUTCHours() - 5); // Convert to EST (UTC-5)
  // console.log("dateTime>", dateTime);
  const epochTimeInSeconds = Math.floor(dateTime.getTime() / 1000);
  return epochTimeInSeconds;
}

const dateStr = "2023-12-06";
const timeStr = "00:00:00";
// const timeStr = "23:59:00";
const estEpochTime = convertDateTimeToESTEpoch(dateStr, timeStr);
console.log(estEpochTime);
