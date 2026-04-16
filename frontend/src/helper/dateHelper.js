export function formatTime(dateString) {
	const date = new Date(dateString);
	return date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function formatSeperator(dateString) {
	const date = new Date(dateString);
	const now = new Date();

	const isToday = date.toDateString() === now.toDateString();
	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);
	const isYesterday = date.toDateString() === yesterday.toDateString();

	if (isToday) {
		return "Today";
	}
	if (isYesterday) {
		return "Yesterday";
	}

	return date.toLocaleDateString([], {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}
