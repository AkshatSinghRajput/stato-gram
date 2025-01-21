export function calculateTimeDifference(startDate: Date, endDate: Date) {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  return { diffDays, diffHours };
}

export function formatTimeDifference(diffDays: number, diffHours: number) {
  if (diffDays > 0) {
    return `${diffDays} days ${diffHours} hours`;
  }
  return `${diffHours} hours`;
}

// Convert timestamp to date and time (12 Jan 2021, 12:00 PM timezone)
export function formatTimestampInDateAndTime(date: string) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options as any);
}

// Convert timestamp to date 12 Jan 2021 only
export function formatTimestampInDate(date: string) {
  console.log(date);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options as any);
}
