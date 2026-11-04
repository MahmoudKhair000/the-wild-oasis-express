export const getToday = function (
	options: { end: boolean } = { end: false },
): string {
	const today = new Date();
	// This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
	if (options?.end) {
		// Set to the last second of the day
		today.setUTCHours(23, 59, 59, 999);
	} else today.setUTCHours(0, 0, 0, 0);

	return today.toISOString();
};
