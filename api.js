// Prototype function to get fixed float numbers
Number.prototype.toFixedNumber = function(x, base) {
  var pow = Math.pow(base || 10, x)
  return +(Math.round(this * pow) / pow)
}

// Basic method to get a random int between 2 values
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min)) + min
}
// Same as getRandom, but returns a float.toFixed(fix)
function getRandomFloat(min, max, fix) {
	return ((Math.random() * (max - min)) + min).toFixedNumber(fix)
}

// Properly case a string
function caseString(s) {
	return s.charAt(0).toUpperCase() + s.slice(1)
}

// Get what % n is of m
function getPercent(n, m) {
	return (m / n) * 100
}

// Get the p% of n
function getPercentOf(p, n) {
	return p/100 * n
}

// Color gradient function from pure red (0%), to pure green (100%)
// With 40% alpha
function getColorFromPercent(p) {
	let end = 120
	let start = 0

	let a = p/100
	let	b = end * a
	let	c = b + start

	return "hsla("+ c +", 100%, 50%, 0.4)"
}

function removeTooltip() {
	$(".ctooltip").remove()
}
function createTootlip(parent, w, h, pos, html) {
	// Default values
	let x = parent.offset().left
	let y = parent.offset().top

	// Change the tooltip position to top|right|bot|left.
	if (pos == 't') {
		x = parent.offset().left
		y = parent.offset().top - h - 4
	} else if (pos == 'r') {
		x = parent.offset().left + parent.width()+ 4
		y = parent.offset().top 
	} else if (pos == 'b') {
		x = parent.offset().left
		y = parent.offset().top + parent.height() + 4
	} else if (pos == 'l') {
		x = parent.offset().left - w - 4
		y = parent.offset().top
	}
	
	let $tooltip = $("<div>", { "class" : "ctooltip", "text" : html })
	$tooltip.css({
		"top" : y + "px",
		"left" : x + "px",
		"width" : w + "px",
		"height" : h + "px",
		
	})
	$("body").prepend($tooltip)
}




function getResource(r) {
	if (game.resources.hasOwnProperty(r)) {
		return game.resources[r]
	}
	console.log("Error handling resources.")
	// TODO throw error and return null
}

function setResource(r, n) {
	if (game.resources.hasOwnProperty(r)) {
		if (n === parseInt(n) && !isNaN(n)) {
			if (n >= game.resourcesMax[r]) {
				n = game.resourcesMax[r]
			}
			if (n < 0) {
				n = 0
			}
			game.resources[r] = n
			return true
		}
	}
	return false
}





function showOverlay(jQString) {
	$(jQString).css({
		"display": 'initial',
		"height": '100%'
	})
}

function hideOverlay(jQString) {
	$(jQString).css({
		display: 'none',
		height: '0%'
	})
}

function typeHTML(jQString, text) {
	$(jQString).html($(jQString).text() + text)
}
function typeText(jQString, text) {
	$(jQString).text($(jQString).text() + text)
}

function clearTypeText(jQString) {
	$(jQString).text("")
}


function toRad(deg) {
	return (deg * Math.PI / 180).toFixedNumber(3)
}


// Where objArr is an array of objects
function getFromObjArr(objArr, prop, value) {
	for (let i = 0; i < objArr.length; i++) {
		if (objArr[i].hasOwnProperty(prop)) {
			if (objArr[i][prop] == value) {
				return objArr[i]
			}
		}
	}
	return null
}


// Concatenates text with commas
function addTextList(main, text, isLast) {
	if (isLast) main += text
	else main += text + ", "

	return main
}