export const digitConverter = (value: number, coin: boolean): string => {
	const units = ['', 'K', 'M', 'B', 'T'];
	let unitIndex = 0;

	while (value >= 1000 && unitIndex < units.length - 1) {
		value /= 1000;
		unitIndex++;
	}

	const truncatedValue = Math.floor(value * 1000) / 1000;
	let formattedValue;
	if (coin) {
		formattedValue =
			truncatedValue % 1 === 0
				? truncatedValue.toFixed(0)
				: truncatedValue.toFixed(3);
	} else {
		formattedValue =
			truncatedValue % 1 === 0
				? truncatedValue.toFixed(0)
				: truncatedValue.toFixed(2);
	}

	return formattedValue + units[unitIndex];
};
