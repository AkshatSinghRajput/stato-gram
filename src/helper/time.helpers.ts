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
