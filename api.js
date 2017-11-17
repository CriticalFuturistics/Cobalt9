// Basic method to get a random int between 2 values
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min)) + min
}

function getPercent(n, m) {
	return (m / n) * 100
}


function getColorFromPercent(p){
	let end = 120
	let start = 0

	let a = p/100
	let	b = end * a
	let	c = b + start

	return "hsla("+ c +", 100%, 50%, 0.4)"
}

