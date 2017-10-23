// Basic method to get a random int between 2 values
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min)) + min
}

function formatSpeed(s, n) {
	let x = s.toString()
	if (x.length > n) {
		// todo change measure unit
		return formatSpeed(s/10, n)
	} else if (x.length < n) {
		s = '0'.repeat(n - x.length) + s
	}

	return s
}

// Type can be 0 or 1
// 0 = speed
// 1 = time
function getUnit(n, type) {
	if (type == 0) {
		return "ks"
	} else if (type == 1) {
		return "dy"
	}
}