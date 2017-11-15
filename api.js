// Basic method to get a random int between 2 values
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min)) + min
}

function getPercent(n, m) {
	return (m / n) * 100
}


function getColorFromPercent(p){
	if (p == 100) {
		return "rgba(10, 200, 10, 0.3)"
	} else if (p >= 75) {
		return "rgba(10, 100, 10, 0.3)"
	} else if (p >= 50) {
		return "rgba(255, 0, 0, 0.3)"
	} else if (p >= 25) {
		return "rgba(255, 0, 0, 0.3)"
	} else if (p < 25) {
		return "rgba(10, 200, 10, 0.3)"
	}
}