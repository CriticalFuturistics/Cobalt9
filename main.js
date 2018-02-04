/* 
	Cobalt9 - by Critical Futuristics
	Authors: M. Zyke - G. Sgabruz
	Design: Zyke & Sgabruz
	Code maintenence: Zyke
	Sprites: Sgabruz
	Score: J. Jaxx

	Version: v0.01
	Copyright: GNU 2017-2018
*/



const FPS = 40
const FRAMERATE = 1000 / FPS

let data = null
let game = null
let settings = null
let animations = null

let Renderer = new Worker('worker.js')


// Called once the HTML document has finished loading.
$(document).ready(function($) {

	$.getJSON("data.json", function(d) {
		data = d

		canvas.width = $("#game").innerWidth()
        canvas.height = $("#game").innerWidth()

		data.canvas.width = canvas.width
		data.canvas.height = canvas.height
	})
	.fail(function(){ 
		console.log("Error while trying to load the data. Try reloading the page.")
	})
	.done(function(){
		$.getJSON("game.json", function(g) {
			game = g
		})
		.fail(function(){ 
			console.log("Error while trying to load the game data. Try reloading the page.")
		})
		.done(function(){
			$.getJSON("settings.json", function(s) {
				settings = s
			})
			.fail(function(){ 
				console.log("Error while trying to load the settings. Try reloading the page.")
			})
			.done(function(){
				$.getJSON("animations.json", function(a) {
					animations = a
				})
				.fail(function(){ 
					console.log("Error while trying to load the animations' data. Try reloading the page.")
				})
				.done(function(){
					// Creates a worker that works on a separate thread
					if (window.Worker) {
						

						loadSettings()
					    load()
						initSound()
						initCSS()
						initHTML()
						init()
						Renderer = new Worker("renderer.js")
						
					} else {
						// TODO Find a better solution, like running the renderer as an interval
						alert("This browser does not support Web Workers.")
					}	

				    
				})
			})		
		})
	})
})



let canvas = document.getElementById("gameCanvas")
let ctx = canvas.getContext("2d")

let consoleCanvas = document.getElementById("consoleCanvas")
let consoleCtx = consoleCanvas.getContext("2d")

let controlCanvas = document.getElementById("controlCanvas")
let controlCtx = controlCanvas.getContext("2d")

let sfx = null

let gLoop = null
let isPaused = false
let timeToUpdate = true

let easeingShip = true
let increment = .002

//let hasTileStart = false
let hasTileTypeSelected = false
let tileType = null
let tileStart = null

function load() {
	if (localStorage.getItem(data._c9.game) != null) {
		game = JSON.parse(localStorage.getItem(data._c9.game))
	} else {
		// Stuff to do if this is a new savefile TODO
	}
}

function save() {
	localStorage.setItem(data._c9.game, JSON.stringify(game))
}

// Load the sound files into an HTML element.
function initSound() {
	sfx = {}
	sfx.hover = document.createElement('audio')
    sfx.hover.setAttribute('src', data.src.sfx.hover)
    sfx.hover.volume = settings.sfx.volume
}

// Change the initail CSS of some elements.
function initCSS() {
	// Activate Tooltips
	$('[data-toggle="tooltip"]').tooltip()

	// Activate selected windows
	$("[aria-controls='Crew']").parent().addClass('active')
	$("[aria-controls='Resources']").parent().addClass('active')
}

function initHTML() {
	// Populate Crew
	let $crew = $('#Crew .tab-html')

	let $crewP = $("<p>").appendTo($crew)
	let $btnPause = $("<a>", {"class" : "btn", "text" : "Pause Game", "onclick" : "pauseGameLoop()"})
	$btnPause.appendTo($crewP)

	let $btnResume = $("<a>", {"class" : "btn", "text" : "Resume Game", "onclick" : "resumeGameLoop()"})
	$btnResume.appendTo($crewP)

	let $btnToggleboot = $("<a>", {"class" : "btn", "text" : "Toggle Boot", "onclick" : "toggleBoot()"})
	$crewP.append('<br>')
	$btnToggleboot.appendTo($crewP)

	let bootStatus = "OFF"
	if (settings.visual.isConsoleBoot) bootStatus = " ON"
	$crewP.append('<span id="isBoot"> ' + bootStatus + ' </span>')



	// Populate Chips
	let $chips = $('#Chips .tab-html')
	let availableChips = game.availableChips

	let $cList = $("<div>", {"class" : "c-list unselectable", "id" : "cList"})
	$cList.appendTo($chips)

	for (let i = 0; i < availableChips.length; i++) {
		for (let j = 0; j < data.consts.chips.length; j++) {
			if (data.consts.chips[j].id == availableChips[i]) {
			
				let c = data.consts.chips[j]
				let $cItem = $("<div>", {"class" : "c-item", "id" : ("c-" + c.id)})
				let $cName = $("<div>", {"class" : "c-item-name", "text" : c.name})
				let $cDex = $("<div>", {"class" : "c-item-dex", "text" : c.dex})
				let $cCompTitle = $("<div>", {"class" : "c-item-comp-title", "text" : "Compatibility"}) 
				let $cComp = $("<div>", {"class" : "c-item-comp", "text" : getChipComp(c.compatibility)})

				let $cIcon = $("<img>", {"class" : "c-item-icon"})
				if (c.hasOwnProperty('src')) {
					$cIcon.attr("src", c.src)
				} else {
					$cIcon.attr("src", data.src.defaults.chips[data.consts.chips[j].rarity])
				}
				
				$cIcon.css({"width" : $cIcon.css("height") + "px"})

				// Add the item components together
				$cItem.append($cIcon)
				$cItem.append($cName)
				$cItem.append($cCompTitle)
				$cItem.append($cDex)
				$cItem.append($cComp)

				// Append the complete item
				$cItem.appendTo($cList)

				break
			}
		}
	}

	function getChipComp(comps) {
		let res = ""
		for (let i = 0; i < comps.length; i++) {
			let c = getFromObjArr(data.consts.chipSlots, "id", data.consts.chipSlots[i].id)
			let isLast = (i == (comps.length - 1))
			res = addTextList(res, c.fullName, isLast)
		}
		return res
	}




	// Populate Upgrades
	let $up = $('#Upgrades .tab-html')
	let ups = data.consts.upgrades

	let $upList = $("<div>", {"class" : "up-list unselectable", "id" : "upList"})
	$upList.appendTo($up)

	for (let i = 0; i < ups.length; i++) {
		let $upItem = $("<div>", {"class" : "up-item", "id" : ("up-" + ups[i].id)})
		let $upName = $("<div>", {"class" : "up-item-name", "text" : ups[i].name})
		let $upDex  = $("<div>", {"class" : "up-item-dex", "text" : ups[i].dex})
		let $upCost = $("<div>", {"class" : "up-item-cost", "text" : (ups[i].cost.qb + " Qb")})

		let $upIcon = $("<img>", {"class" : "up-item-icon"})
		$upIcon.attr("src", ups[i].btnSrc)
		$upIcon.css({"width" : $upIcon.css("height") + "px"})
		$upIcon.attr('data-btnSrc', ups[i].btnSrc)
		$upIcon.attr('data-prsSrc', ups[i].prsSrc)

		$upIcon.mouseover(function(event) {
			// TODO shade overlay?
		})
		$upIcon.mousedown(function(event) {
			$(this).attr("src", $(this).attr("data-prsSrc"))
		})
		$upIcon.mouseup(function(event) {
			$(this).attr("src", $(this).attr("data-btnSrc"))
		})
		$upIcon.mouseleave(function(event) {
			$(this).attr("src", $(this).attr("data-btnSrc"))
		})
		
		// Add the item components together
		$upItem.append($upIcon)
		$upItem.append($upName)
		$upItem.append($upDex)
		$upItem.append($upCost)

		// Append the complete item
		$upItem.appendTo($upList)
	}



	// Populate Lab




	// Populate Resources
	let $resources = $('#Resources .tab-html')
	let $resourcesList = $('#Resources #resourcesList')
	let r = game.resources

	for (k in r){
		let $resourceImg = $("<div>", { "class" : "resourceImg", "id" : ("resourceImg" + k)})
		let $resource = $("<div>", { "class" : "resource"})

		let $resourceB = $("<div>", { "class" : "resourceB", "id" : ("resourceB" + k)})
		let $resourceN = $("<div>", { "class" : "resourceN", "id" : ("resourceN" + k), "text" : (r[k] + "/" + game.resourcesMax[k]) })
	
		$resourceB.css({
			"width": getPercent(game.resourcesMax[k], r[k]) + "%",
			"background-color": getColorFromPercent(getPercent(game.resourcesMax[k], r[k])),
			"transition": "all 0.2s ease",
			"-webkit-transition": "all 0.3s ease-out",
			"-moz-transition": "all 0.3s ease-out",
		})
		$resource.append($resourceB)
		$resource.append($resourceN)

		$item = $("<div>", { "id" : ("list" + k)})
		$item.append($resourceImg)
		$item.append($resource)
		$item.attr('data-k', k)

		$item.mouseover(function(event) {
			createTootlip($(this), 100, 40, 'l', caseString($(this).attr("data-k")))
		})
		$item.mouseout(function(event) {
			removeTooltip()
		})


		$resourcesList.append($item)
	}

	// Energy Bar
	// Changind the position to relative so I can position absolutely the energy bar
	$resources.css({position: 'relative'})

	let $energy = $("<div>", { "class" : "energy", "id" : "energy"})
	let $energyBar = $("<div>", { "class" : "energy-bar", "id" : "energyBar"})
	let $energyN = $("<div>", { "class" : "energyN", "id" : "energyN", "text" : (game.energy + "/" + game.maxEnergy) })
	$energyBar.css({ "width" : getPercent(game.maxEnergy, game.energy) + "%"})

	$energyBar.append($energyN)
	$energy.append($energyBar)
	$resources.append($energy)

	


	// Populate Inventory
	let $inv = $('#Inventory .tab-html')
	let $tileDex = $("<div>", { "class" : "tile-dex"})
	let $warning = $("<div>", { "class" : "warning", "id" : "tileWarning"})
	$tileDex.html(data._dex.inv.tiles
			+ "<br>"
			+ data._dex.inv.capacityStart 
			+ "<strong>" 
			+ game.slotCapacity 
			+ "</strong>" 
			+ data._dex.inv.capacityEnd)
	$inv.append($tileDex)
	$inv.append($warning)

	let $tiles = $("<div>", { "class" : "tiles", "width" : "70%" })
	let $tileTypes = $("<div>", { "class" : "tile-types", "width" : "30%" })

	let $tileDeselect = $("<div>", { "id" : "tileDeselect", "class" : "tile-deselect unselectable", "text" : "Deselect"})
	$tileDeselect.click(function(event) {
		game.hasTileStart = false
		hasTileTypeSelected = false
		tileType = null
		deselectAllTypeTiles()
		uncolorTiles(game.inv)
	})

	let $tileMode = $("<div>", { "id" : "tileMode", "class" : "tile-mode unselectable", "text" : data.consts.tileSelectionModes[game.tileSelectionMode]})
	$tileMode.click(function(event) {
		hasTileTypeSelected = false
		tileType = null
		game.tileSelectionMode += 1
		if (game.tileSelectionMode == data.consts.tileSelectionModes.length) {
			game.tileSelectionMode = 0
		}
		$(this).text(data.consts.tileSelectionModes[game.tileSelectionMode])
		deselectAllTypeTiles()
		uncolorTiles(game.inv)
	})

	// TODO add Tile Mode tooltip to explain it
	


	// First setup an empty tile type (so you can clear allocations)
	let $tileType = $("<div>", { "class" : "tile-type"})
	let $tilePicker = $("<div>", { "class" : "tile-picker", "data-tile-type" : null})
	
	// Mark this tile type as selected
	$tilePicker.click(function(event) {
		hasTileTypeSelected = true
		tileType = $(this).attr("data-tile-type")
		deselectAllTypeTiles()
		$(this).css({ "border-width" : "2px", "border-color" : "rgba(255, 255, 255, 1)"})
	})

	let $tileTypeName = $("<div>", { "class" : "tile-type-name", "text" : "Empty"})
	$tileType.append($tilePicker)
	$tileType.append($tileTypeName)

	$tileTypes.append($tileType)

	// Then setup the rest of resources
	for (k in data._s.r) {
		let $tileType = $("<div>", { "class" : "tile-type"})
		let $tilePicker = $("<div>", { "class" : "tile-picker", "data-tile-type" : k})

		$tilePicker.css({ "background-color" : data._s.rColors[k] })
		// Mark this tile type as selected
		$tilePicker.click(function(event) {
			hasTileTypeSelected = true
			tileType = $(this).attr("data-tile-type")
			deselectAllTypeTiles()
			$(this).css({ "border-width" : "2px", "border-color" : "rgba(255, 255, 255, 1)"})
		})

		let $tileTypeName = $("<div>", { "class" : "tile-type-name", "text" : caseString(k)})
		$tileType.append($tilePicker)
		$tileType.append($tileTypeName)

		$tileTypes.append($tileType)
	}

	let $tileConfirm = $("<div>", { "class" : "tile-confirm", "text" : data._dex.inv.confirm})
	$tileConfirm.click(function(event) {
		confirmTiles()
	})

	$tileTypes.append($tileDeselect)
	$tileTypes.append($tileMode)
	$tileTypes.append($tileConfirm)

	function deselectAllTypeTiles() {
		$('#tileWarning').text("")
		$('.tile-picker').css({ "border-width" : "1px", "border-color" : "rgba(255, 255, 255, 0.3)"})
	}


	// Calculate the optimal way to display inventory boxes
	let inv = game.inv
	let tilesPerRow = data.consts.invTilesPerRow
	let effectiveWidth = Math.floor(getPercentOf(70, $(".tab-pane.active").width())) - parseFloat($tiles.css("padding-left"))
	let tileW = Math.floor(effectiveWidth / tilesPerRow )
	let tileH = tileW
	
	for (let i = 0; i < game.invSlots; i++) {
		// Create the tiles
		let $tile = null
		let max = data.consts.invTilesPerRow
		let c = 0
		// TODO fix this mess
		if (i / max < 1) { c = "A" }
		else if (i / max < 2) { c = "B" }
		else if (i / max < 3) { c = "C" }
		else if (i / max < 4) { c = "D" }
		else if (i / max < 5) { c = "E" }
		else if (i / max < 6) { c = "F" }
		else if (i / max < 7) { c = "G" }
		else if (i / max < 8) { c = "H" }
		else if (i / max < 9) { c = "I" }
		else if (i / max < 10) { c = "J" }
		else if (i / max < 11) { c = "K" }
		else if (i / max < 12) { c = "L" }
		else if (i / max < 13) { c = "M" }
			// ...
		c += getMinCom(max, i)
		$tile = $("<div>", { "class" : "box", "data-box-id" : i, "data-box-coord" : c })
		$tile.css({ "width" : tileW, "height" : tileH})
		
		// Check what has been allocated and color it
		if (inv[i] != null) {	
			$tile.addClass("tile-" + [inv[i]])
		}

		// Add the tile
		$tiles.append($tile)
	}

	$inv.append($tiles)
	$inv.append($tileTypes)
	

	$('.box').click( function(e){ 
		allocateTiles(e)
		checkCommit()
	} )
	$('.box').mouseenter( function(e){ selectTiles(e) } ) 
	
	function checkCommit() {
		let savedGame = JSON.parse(localStorage.getItem(data._c9.game))
		if (!compareArrays(game.inv, savedGame)) {
			$(".tile-confirm").css({ "display" : "inherit" })
		} else {
			$(".tile-confirm").css({ "display" : "none" })
		}
	}

	function confirmTiles() {
		save()
		updateResourcesMax()
		$(".tile-confirm").css({ "display" : "none" })
	}

	// Triggered when a tile is clicked, it allocates the selected tiles with the selected resource.
	function allocateTiles(event) {
		event.preventDefault()
		let thisID = parseInt($(event.target).attr("data-box-id"))

		if (hasTileTypeSelected) {
			$('#tileWarning').text("")

			switch(game.tileSelectionMode) {

				// Tile selection mode: Single
			    case 0:
			    	clearTileClasses($(event.target))
					if (tileType == null) {	
						$(event.target).addClass("tile-empty")
					} else {
						$(event.target).addClass("tile-" + tileType)
					}
					game.inv[thisID] = tileType
			    	break

			   	// Tile selection mode: Square
			    case 1:
			    	if (game.hasTileStart) {
						game.hasTileStart = false

						let ids = []
						ids.push(thisID)

						if (thisID == game.invStartID) {
							fillTiles(ids)
							break

						} else if (thisID < game.invStartID) {
							let thisC = getBoxCoord(thisID)
							let startC = getBoxCoord(parseInt(game.invStartID))
							
							let thisN = thisC.charAt(1)
							let startN = startC.charAt(1)

							let thisL = thisC.charCodeAt(0)
							let startL = startC.charCodeAt(0)

							if (thisN <= startN) {
								for (let i = thisN; i <= startN; i++) {
									for (let j = thisL; j <= startL; j++) {
										ids.push(getBoxID(String.fromCharCode(j) + i))
									}
								}
							} else {
								for (let i = startN; i <= thisN; i++) {
									for (let j = thisL; j <= startL; j++) {
										ids.push(getBoxID(String.fromCharCode(j) + i))
									}
								}
							}

							fillTiles(ids)

						} else if (thisID > game.invStartID) {
							let thisC = getBoxCoord(thisID)
							let startC = getBoxCoord(game.invStartID)
							
							let thisN = thisC.charAt(1)
							let startN = startC.charAt(1)

							let thisL = thisC.charCodeAt(0)
							let startL = startC.charCodeAt(0)

							if (thisN >= startN) {
								for (let i = startN; i <= thisN; i++) {
									for (let j = startL; j <= thisL; j++) {
										ids.push(getBoxID(String.fromCharCode(j) + i))
									}
								}
							} else {
								for (let i = thisN; i <= startN; i++) {
									for (let j = startL; j <= thisL; j++) {
										ids.push(getBoxID(String.fromCharCode(j) + i))
									}
								}
							}

							fillTiles(ids)
						
					    }
					} else {
						game.hasTileStart = true
						game.invStartID = thisID
					}

			    	break
			    
			    // Tile selection mode: Line
			    case 2:
			    	if (game.hasTileStart) {
						game.hasTileStart = false

						let ids = []
						ids.push(thisID)
						ids.push(game.invStartID)

						if (thisID == game.invStartID) {
							fillTiles(ids[0])
							break

						} else if (game.invStartID <= thisID) {
							for (let i = game.invStartID + 1; i <= thisID; i++) {
								clearTileClasses($('.box[data-box-id = ' + i + ']'))
								ids.push(i)
							}
							fillTiles(ids)

						} else {
							for (var i = thisID; i <= game.invStartID; i++) {
								clearTileClasses($('.box[data-box-id = ' + i + ']'))
								ids.push(i)
							}
							fillTiles(ids)

						}
						game.inv[i] = tileType

					} else { 
						game.hasTileStart = true
						game.invStartID = thisID			
					}

			        break

			    default:
			        break
			}
		} else {
			$('#tileWarning').text(data._dex.inv.warning)
		}
	}

	// Triggered on mouseover, it only colors the tiles that would be allocated
	function selectTiles(event) {
		event.preventDefault()
		let t = $(event.target)
		let thisID = parseInt(t.attr("data-box-id"))

		if (hasTileTypeSelected) {
			switch(game.tileSelectionMode) {
				// Ignoring case: 0, since we don't need to highlight single-selection

			   	// Tile selection mode: Square
			    case 1:
			    	if (game.hasTileStart) {
						
						let ids = []
						ids.push(thisID)

						if (thisID == game.invStartID) {
							colorTiles(ids)
							break

						} else if (thisID < game.invStartID) {
							let thisC = getBoxCoord(thisID)
							let startC = getBoxCoord(game.invStartID)
							
							let thisN = thisC.charAt(1)
							let startN = startC.charAt(1)

							let thisL = thisC.charCodeAt(0)
							let startL = startC.charCodeAt(0)

							if (thisN <= startN) {
								for (let i = thisN; i <= startN; i++) {
									for (let j = thisL; j <= startL; j++) {
										ids.push(getBoxID(String.fromCharCode(j) + i))
									}
								}
							} else {
								for (let i = startN; i <= thisN; i++) {
									for (let j = thisL; j <= startL; j++) {
										ids.push(getBoxID(String.fromCharCode(j) + i))
									}
								}
							}

							colorTiles(ids)

						} else if (thisID > game.invStartID) {
							let thisC = getBoxCoord(thisID)
							let startC = getBoxCoord(game.invStartID)
							
							let thisN = thisC.charAt(1)
							let startN = startC.charAt(1)

							let thisL = thisC.charCodeAt(0)
							let startL = startC.charCodeAt(0)

							if (thisN >= startN) {
								for (let i = startN; i <= thisN; i++) {
									for (let j = startL; j <= thisL; j++) {
										ids.push(getBoxID(String.fromCharCode(j) + i))
									}
								}
							} else {
								for (let i = thisN; i <= startN; i++) {
									for (let j = startL; j <= thisL; j++) {
										ids.push(getBoxID(String.fromCharCode(j) + i))
									}
								}
							}

							colorTiles(ids)
						
						}
					} else {
						colorTiles([parseInt(t.attr("data-box-id"))])
					}

			    	break
			    
			    // Tile selection mode: Line
			    case 2:
			    if (game.hasTileStart) {

						let ids = []
						ids.push(thisID)
						ids.push(game.invStartID)

						if (thisID == game.invStartID) {
							colorTiles(ids[0])
							break

						} else if (game.invStartID <= thisID) {
							for (let i = game.invStartID + 1; i <= thisID; i++) {
								clearTileClasses($('.box[data-box-id = ' + i + ']'))
								ids.push(i)
							}
							colorTiles(ids)

						} else {
							for (var i = thisID; i <= game.invStartID; i++) {
								clearTileClasses($('.box[data-box-id = ' + i + ']'))
								ids.push(i)
							}
							colorTiles(ids)

						}
						

					} else { 
						colorTiles([parseInt(t.attr("data-box-id"))])			
					}

			        break

			    default:
			        break
			}
		}
	}



	// Fills all the boxes in the given array with tileType
	function fillTiles(list) {
		for (let i = 0; i < list.length; i++) {
			fillTile(list[i], tileType)
			game.inv[list[i]] = tileType
		}
	}

	function fillTile(tileID, type) {
		let t = $('.box[data-box-id = ' + tileID + ']')
		clearTileClasses(t)
		if (tileType == null) {
			t.addClass("tile-empty")
		} else {
			t.addClass("tile-" + type)
		}
	}

	function clearTileClasses(target) {
		let g = data._s.r
		target.removeClass("tile-" + g[k])
		target.css({ "background-color" : "" })
		for (k in g) {
			target.removeClass("tile-" + g[k])
		}
	}

	function colorTile(tileID) {
		if (tileType == null) {
			$('.box[data-box-id = ' + tileID + ']').css({ "background-color" : "rgba(0, 0, 0, 0)"})
		} else {
			$('.box[data-box-id = ' + tileID + ']').css({ "background-color" : data._s.rColors[tileType]})
		}	
	}

	// Calls iteratively colorTile()
	// Also makes the non-selecable tiles go back to an uncolored state
	function colorTiles(tiles) {
		for (let i = 0; i < tiles.length; i++) {
			colorTile(tiles[i])
		}
		uncolorTiles(tiles)
	}

	function uncolorTiles(tiles) {
		if (!Array.isArray(tiles)) {
			for (let j = 0; j < game.invSlots; j++) {
				if (tiles != j) {
					$('.box[data-box-id = ' + j + ']').css({ "background-color" : ""})
				}
			}
		} else {
			for (let j = 0; j < game.invSlots; j++) {
				if (!tiles.includes(j)) {
					$('.box[data-box-id = ' + j + ']').css({ "background-color" : ""})
				}				
			}
		}
	}

	$(".nav-item").click(function(event) {
		game.hasTileStart = false
		hasTileTypeSelected = false
		tileType = null
		deselectAllTypeTiles()
		uncolorTiles(game.inv)
	})



	function getBoxCoord(tileID) {
		return $('.box[data-box-id = ' + tileID + ']').attr("data-box-coord")
	}

	function getBoxID(tileCoord) {
		return parseInt($('.box[data-box-coord = ' + tileCoord + ']').attr("data-box-id"))
	}


	$(".box").mouseenter(function() {
		sfx.hover.play()
	}).mouseleave(function() {
		sfx.hover.pause()
		sfx.hover.currentTime = 0
	})



	// Populate Starmap

	// Populate Encylopedia
}

// General init
function init(){
	// Init console data
	consoleCanvas.width = $("#console").innerWidth()
    consoleCanvas.height = $("#console").innerHeight()


    initResources()

    // Initial Boot
	bootConsole()
}

function initResources() {
	updateResourcesMax()
	save()
}

function updateResourcesMax() {
	for (k in data._s.r){
		game.resourcesMax[k] = 0
	}
	for (let i = 0; i < game.inv.length; i++) {
		game.resourcesMax[game.inv[i]] += game.slotCapacity
	}
}

// Loads the settings from LocalStorage (or from PlayFab, but that's a TODO for later)
function loadSettings() {
	// TODO check for new settings. If the settings.hasOwnProperty-s are not the same, add them.

	if (localStorage.getItem(data._c9.settings) != null) {
		//settings = JSON.parse(localStorage.getItem(data._c9.settings))
	} else {
		// Stuff to do if this is a new savefile TODO
	}
}

// Saves the settings on LocalStorage (and on PlayFab, but that's a TODO for later)
function saveSettings() {
	localStorage.setItem(data._c9.settings, JSON.stringify(settings))
}

// Loads the sprites, but only after the initial terminal boot
function loadSprites() {
	loadStars()
}
// Loads the stars, then chain-calls loadAsteroids()
function loadStars() {
	// Load Sprites
	// In order to not load the same sprites evey frame, load them from the src once at the start.
	// Once the stars are loaded, it starts to load the asteroids and then the ship.
	let srcs = data.src
	for (let i = 0; i < srcs.sprites.stars.srcs.length; i++) {
		let img = new Image()
		img.src = srcs.sprites.stars.srcs[i]
		img.i = i

		img.onload = function() {
			data.src.sprites.stars.images[this.i] = img

			let allStarsLoaded = false

			for (let j = 0; j < data.src.sprites.stars.srcs.length; j++) {

				if (typeof data.src.sprites.stars.images[j] !== 'undefined' && data.src.sprites.stars.images[j] != null) {
					allStarsLoaded = true
				} else {
					allStarsLoaded = false
					break
				}
			}
			if (allStarsLoaded) {
				loadAsteroids()
			}
		}
	}
}
// Loads the asteroids, then chain-calls loadShip().
function loadAsteroids() {
	// Initial console data
	consoleCanvas.width = $("#console").innerWidth()
    consoleCanvas.height = $("#console").innerHeight() 

	// Load Sprites (extracting the src from asteroidTypes)
	for (k in data.consts.asteroidTypes) {
		let thisSrc = data.consts.asteroidTypes[k].src

		if (!data.src.sprites.asteroids.srcs.includes(thisSrc)) {
			data.src.sprites.asteroids.srcs.push(thisSrc)
		}
	}

	let srcs = data.src
	for (let i = 0; i < srcs.sprites.asteroids.srcs.length; i++) {
		let img = new Image()
		img.src = srcs.sprites.asteroids.srcs[i]
		img.i = i

		img.onload = function() {
			data.src.sprites.asteroids.images[this.i] = img
			let allAsteroidsLoaded = false

			for (let j = 0; j < data.src.sprites.asteroids.srcs.length; j++) {

				if (typeof data.src.sprites.asteroids.images[j] !== 'undefined' && data.src.sprites.asteroids.images[j] != null) {
					allAsteroidsLoaded = true
				} else {
					allAsteroidsLoaded = false
					break
				}
			}
			if (allAsteroidsLoaded) {
				loadShip()
			}
		}
	}
}
// Loads the ship, then chain-calls loadConsole().
function loadShip() {
	let ship = new Image()
	ship.src = data.src.sprites.spaceship.srcs

	ship.onload = function(){
		data.src.sprites.spaceship.srcs = ship

		canvas.width = $("#game").innerWidth()
		canvas.height = $("#game").innerWidth()

		let sc = new CanvasObj(canvas.width/2 - 64, canvas.height * 1.2, ship, 1)
		sc.height = 128
		sc.width = 128
		data.canvas.spaceship = sc

		loadConsole()
	}
}
// Loads the console, then chain-calls loadControlPannel().
function loadConsole() {
	let c = data.src.sprites.console
	for (let k in c){
		let img = new Image()
		img.src = c[k].src
		img.k = k

		img.onload = function() {
			c[this.k].image = img
			let allLoaded = false

			for (x in c){
				if (typeof c[x].image === 'undefined' || c[x].image == null) {
					allLoaded = false
					break
				} else {
					allLoaded = true
				}
			}

			if (allLoaded) {
				loadControlPannel()
			}
		}
	}
}
// Loads the console, then chain-calls loadCanvas().
function loadControlPannel() {
	let c = data.src.sprites.controlPannel
	for (let k in c){
		let img = new Image()
		img.src = c[k].src
		img.k = k

		img.onload = function() {
			c[this.k].image = img
			let allLoaded = false

			for (x in c){
				if (typeof c[x].image === 'undefined' || c[x].image == null) {
					allLoaded = false
					break
				} else {
					allLoaded = true
				}
			}

			if (allLoaded) {
				renderControlPannel()
				loadCanvas()
			}
		}
	}
}
// Loads the canvas, then stars the Gameloop.
function loadCanvas() {
	window.addEventListener('resize', resizeCanvas, false)

	Renderer.onmessage = function(e) {
		if (e.data.hasOwnProperty('updateCanvas')) {
			loopCanvas()

			// Clear the current canvas
			//

			

			// Recreate the canvas with the passed data
			// Temporarely save loaded Image objects (can't be sent to worker)
			//let tempSrc = data.src
			//data = JSON.parse(e.data.updateCanvas.data)
			//data.src = tempSrc

			//renderCanvas()
		}
	}

	function resizeCanvas() {
		if (gLoop) {
			clearInterval(gLoop)
			Renderer.postMessage({ stopCanvas : true })
		}

		canvas.width = $("#game").innerWidth()
        canvas.height = $("#game").innerWidth()
       

		Renderer.postMessage({ 
			data : JSON.stringify(data),
			loopCanvas : {
				framerate : FRAMERATE,
			}
		})

        resizeInventory()

        data.consts.isConsoleLoaded = false
        data.consts.isControlPannelLoaded = false
        renderConsole()
        renderControlPannel()

        gLoop = setInterval(gameLoop, FRAMERATE)
    }
    resizeCanvas()
}


// ----------------------------------- Game Loop ------------------------------------- //





function renderCanvas() {
	// loop through whats loopable and draw it
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	renderAsteroids()
	renderLasers()
	renderSpaceship()
	renderConsole()
}



function gameLoop() {
	//loopCanvas()


	if (data.consts.updateTime >= 3) {
		data.consts.updateTime = 0
		timeToUpdate = true
	} else {
		data.consts.updateTime += 1
		timeToUpdate = false
	}

	// Update every 4th tick ---
	if (timeToUpdate) {
		updateMining()

		updateTravelInfo()
		updateUI()
	}

	// Update every tick ---
	decrementTurbo()
}

// 					(time TODO)
// Updates distance, time and speed.
function updateTravelInfo() {
	let m = data.consts.turbo/10 + 1

	let d = data.consts.distance.n
	if (d >= data.consts.distanceMax 
	||  d <= data.consts.speed.n * 2
	||  d <= 2
	&& !data.consts.isStopped) {
		if (d == 0 && d <= 0) {
			data.consts.distance.n = 0
			data.consts.speed.n = 0
		} else {			
			updateDistance()
		}
		
	}
	if (data.consts.distance.n >= data.consts.speed.n * m) {
		data.consts.distance.n -= data.consts.speed.n * m	
	} else {
		// Arrived at destination
		data.consts.distance.n = 0
		data.consts.distance.u = 0

		data.consts.speed.u = 0
		data.consts.speed.n = 0

		data.consts.isStopped = true
	}
}

function decrementTurbo() {
	if (data.consts.turbo > 0) {

		// Formulas available at https://www.desmos.com/calculator/y8pibgbwxx

		// Turbo decrement
		let dec = 6 + Math.round(Math.pow(data.consts.turbo/10, 2)/940)
		if (dec > 12) dec = 12
		data.consts.turbo -= dec

		// Star Speed increment
		let sspeed = data.consts.baseStarSpeed + (Math.pow(data.consts.turbo/10, 1.6) * 0.013)
		if (isNaN(sspeed)) sspeed = data.consts.baseStarSpeed
		data.consts.starSpeed = sspeed

		// Stars spawnrate increment
		let srate = data.consts.baseStarSpawnRate - Math.pow(data.consts.turbo/10, (3/4.2))
		if (isNaN(srate)) srate = data.consts.baseStarSpawnRate
		if (srate < 2) srate = 2
		data.consts.starSpawnRate = srate

		// Asteroids speed increment
		let aspeed = data.consts.baseAsteroidSpeed + (Math.pow(data.consts.turbo/10, 1.6) * 0.013)
		if (isNaN(aspeed)) aspeed = data.consts.baseAsteroidSpeed
		data.consts.asteroidSpeed = aspeed


		// When moving real fast, no asteroids will spawn
		if (data.consts.turbo > 10) {
			data.consts.maxAsteroids = 0
		} else {
			data.consts.maxAsteroids = data.consts.baseMaxAsteroids
		}
		

		// Update the new speeds on the currently displayed items
		for (let i = 0; i < data.canvas.stars.length; i++) {
			data.canvas.stars[i].speed = data.consts.starSpeed
		}
		for (let i = 0; i < data.canvas.asteroids.length; i++) {
			data.canvas.asteroids[i].speed = data.consts.asteroidSpeed
		}
	}
}



// ---------------------------------- Game Loop END ---------------------------------- //

// ------------------------------------ Renderer ------------------------------------- //

// bootConsole is only ran at the start and does not use gameLoop for its animations
function bootConsole() {
	let jQString = "#initConsoleOverlay"
	let basejQString = jQString

	if (!settings.visual.isConsoleBoot) {
		hideOverlay(jQString)
		loadSprites()
	} else {
		// Play music
		if (settings.sound.music && settings.sound.volume > 0) {
			music = {}
			music.boot = document.createElement('audio')
		    music.boot.setAttribute('src', data.src.music.boot)
		    music.boot.volume = settings.sound.volume
		    music.boot.currentTime = 0
			music.boot.play()
		}

		// Show the black terminal as an overlay
		showOverlay(jQString)
		jQString += " p"

		// Animate
		setTimeout(animBootBlink, animations.boot.initDelay, 5, jQString)

		function animBootBlink(blinks, jQString) {
			if (blinks <= 0) {
				setTimeout(animBootText, animations.boot.textDelay, 0, -1)
				return
			} else {
				if (blinks % 2 == 0) {
					clearTypeText(jQString)
					setTimeout(animBootBlink, animations.boot.cursorBlink, (blinks - 1), jQString)
				}
				if (blinks % 2 != 0) {
					typeText(jQString, "█")	// Terminal cursor char	
					setTimeout(animBootBlink, animations.boot.cursorBlink, (blinks - 1), jQString)
				}
			}				
		}

		function animBootText(textIndex, charIndex) {
			if (textIndex >= animations.boot.texts.length) {
				animBootLogo(0)
				return
			}

			if (charIndex < 0) {
				clearTypeText(jQString)
				animBootText(0, 0)
			} else if (charIndex >= animations.boot.texts[textIndex].t.length) {
				setTimeout(animBootText, animations.boot.texts[textIndex].ms, textIndex + 1, 0)
			} else {
				typeText(jQString, animations.boot.texts[textIndex].t.charAt(charIndex))
				setTimeout(animBootText, animations.boot.textDelay, textIndex, charIndex + 1)
			}
		}

		function animBootLogo(i) {
			if (i >= animations.boot.logoText.length) {
				setTimeout(launchGame, animations.boot.finalDelay)
				return
			}
			if (i == 0) {
				clearTypeText(jQString)
				$(jQString).append('<pre></pre>')
				jQString += " pre"
			}
			typeText(jQString, animations.boot.logoText[i])
			setTimeout(animBootLogo, animations.boot.textDelay, i + 1)
		}

		function launchGame() {
			hideOverlay(basejQString)
			loadSprites()
		}
    }
}


// Updates every UI element that is not inside a canvas.
// Should be called last, so that all data is up to date.
function updateUI() {
	// Update the Resources screen
	let r = game.resources

	for (k in r){
		$("#resourceN" + k).text(r[k] + "/" + game.resourcesMax[k])
		$("#resourceB" + k).css({
			width: getPercent(game.resourcesMax[k], r[k]) + "%",
			"background-color": getColorFromPercent(getPercent(game.resourcesMax[k], r[k]))
		})
	}
}

// Updates the sizes of the inventory boxes when the window resizes
function resizeInventory() {
	// Update, in the Inventory screen, the width of the inventory boxes
	let $resources = $('#Resources .tab-html')
	let $inv = $('#Inventory .tab-html')
	let tilesPerRow = data.consts.invTilesPerRow
	let effectiveWidth = Math.floor(getPercentOf(70, $(".tab-pane.active").width())) - parseFloat($('.tiles').css("padding-left"))

	let tileW = Math.floor(effectiveWidth / tilesPerRow)
	let tileH = tileW

	for (let i = 0; i < game.invSlots; i++) {
		$tile = $('.box[data-box-id = ' + i + ']')
		$tile.css({ "width" : tileW, "height" : tileH})
	}
}

function renderControlPannel() {
	if (!data.consts.isControlPannelLoaded) {
		data.consts.isControlPannelLoaded = true

		controlCanvas.width = $("#controlCanvas").innerWidth()

		// Scale the canvas so that the motherboard fits perfeclty
		controlCanvas.height = scaleToFit(controlCanvas.width,
										data.src.sprites.controlPannel.background.image.width, 
										data.src.sprites.controlPannel.background.image.height, "h")
		controlCtx.clearRect(0, 0, controlCanvas.width, controlCanvas.height)

		// Update the loaded image into the data.canvas object. BERRY IMPORTANT
		data.canvas.controlPannel.background.image = data.src.sprites.controlPannel.background.image

		let cp = new CanvasObj(0, 0, data.canvas.controlPannel.background.image, 0)
		controlCtx.drawImage(cp.img, cp.x, cp.y, controlCanvas.width, controlCanvas.height)
	}
}


function renderConsole() {
	consoleCanvas.width = $("#console").innerWidth()
    consoleCanvas.height = $("#console").innerHeight()

	consoleCtx.clearRect(0, 0, consoleCanvas.width, consoleCanvas.height)

	let w = consoleCanvas.width
	let h = consoleCanvas.height

	let q = data.consts.turbo
	// So that it doesn't divide by zero
	if (q == 0) { q = 0.1 }

	// ----- This is ran once -----

	if (!data.consts.isConsoleLoaded) {
		data.consts.isConsoleLoaded = true

		let c = data.canvas.console
		for(k in c){
			c[k].image = data.src.sprites.console[k].image
			c[k].h = c[k].image.height
			c[k].w = c[k].image.width
		}

		c.display.x = 12
		c.display.y = 20

		c.boosterBarBackground.x = (w/2) - c.boosterBarBackground.image.width/2
    	c.boosterBarBackground.y = h - c.boosterBarBackground.image.height - 4	

    	c.btnTurbo.x = Math.floor((w/2) - (c.btnTurbo.image.width/2))
   		c.btnTurbo.y = Math.floor((h/2) - (c.btnTurbo.image.height/2) - 12)

   		c.prsTurbo.x = c.btnTurbo.x 
   		c.prsTurbo.y = c.btnTurbo.y 

    	c.boosterBarFull.clip.sw = c.boosterBarFull.image.width / (1000/q)
    	c.boosterBarFull.clip.sh = c.boosterBarFull.image.height
    	
    	c.boosterBarFull.x = (w/2) - (c.boosterBarFull.image.width/2),
    	c.boosterBarFull.y = h - c.boosterBarFull.image.height - 4,
    	c.boosterBarFull.w = c.boosterBarFull.image.width / (1000/q),
    	c.boosterBarFull.h = c.boosterBarFull.image.height

    	c.slider.x = w - c.slider.image.width - c.slider.image.width/6
    	c.slider.y = h/2 - c.slider.image.height/2 - c.slider.image.height/4
		
		// Mining Priority
    	c.sliderSelector.spacing = data.consts.miningPriority * (c.slider.image.width/5 - 1)

    	c.sliderSelector.x = (c.slider.x - (c.sliderSelector.image.width/2) + 3) + c.sliderSelector.spacing
    	c.sliderSelector.y = (c.slider.y/2) + parseInt(c.slider.image.height/16)

    	data.canvas.console.sliderSelector.x = c.sliderSelector.x

    	

		consoleCanvas.objects = c
	}
	
	// ----------------------------

	let c = consoleCanvas.objects

	for(k in c){
		if (c[k].visible) {
			if (k == "background") {
				consoleCtx.drawImage(c[k].image, c[k].x, c[k].y, w, h)
			} else if (k == "boosterBarFull") {
				consoleCtx.drawImage(c[k].image,
			    	c[k].clip.sx, c[k].clip.sy,
			    	c[k].image.width / (1000/q), c[k].clip.sh,
			    	c[k].x, c[k].y,
			    	c[k].image.width / (1000/q), c[k].h)
			} else if (k == "sliderSelector") {
				c[k].spacing = data.consts.miningPriority * (c.slider.image.width/5 - 1)
				consoleCtx.drawImage(c[k].image, c[k].x + c[k].spacing, c[k].y)			  
			} else if (c[k].hasOwnProperty("clip")) {
				consoleCtx.drawImage(c[k].image,
			    	c[k].clip.sx, c[k].clip.sy,
			    	c[k].clip.sw, c[k].clip.sh,
			    	c[k].x, c[k].y,
			    	c[k].w, c[k].h)
			} else {
				consoleCtx.drawImage(c[k].image, c[k].x, c[k].y)
			}
		}
	}


	// ------- HTML render --------
	// Console Digits

	$("#emptyDistance").html('888888888')
	$("#emptyTime").html('888888888')
	$("#emptyDistanceUnit").html('88')
	$("#emptyTimeUnit").html('88')

	$("#emptyDistance").css({
		position : 'absolute',
		top: parseInt($("#console").position().top + consoleCanvas.objects.display.y - 3) + "px",
		left: 27 + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 3/4,
		"text-align" : "right"
	})
	$("#emptyDistanceUnit").css({
		position : 'absolute',
		top: parseInt($("#console").position().top + consoleCanvas.objects.display.y - 3) + "px",
		left: $("#distance").position().left + parseInt($("#distance").css("width")) + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 1/4,
		"text-align" : "right"
	})
	$("#emptyTime").css({
		position : 'absolute',
		top: parseInt($("#distance").position().top + $("#distance").height() + 3) + "px",
		left: 27 + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 3/4,
		"text-align" : "right"
	})
	$("#emptyTimeUnit").css({
		position : 'absolute',
		top: parseInt($("#distance").position().top + $("#distance").height() + 3) + "px",
		left: $("#distance").position().left + parseInt($("#distance").css("width")) + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 1/4,
		"text-align" : "right"
	})

	let temp = data.consts.distance.n
	if (data.consts.distance.n > data.consts.distanceMax || data.consts.distance.n < 0) {
		temp = 0
	}
	$("#distance").html(Math.round(temp))
	$("#distance").css({
		position : 'absolute',
		top: parseInt($("#console").position().top + consoleCanvas.objects.display.y - 3) + "px",
		left: 27 + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 3/4,
		"text-align" : "right"
	})

	$("#distanceUnit").html(data.consts.distanceUnits[data.consts.distance.u])
	$("#distanceUnit").css({
		position : 'absolute',
		top: parseInt($("#console").position().top + consoleCanvas.objects.display.y - 3) + "px",
		left: $("#distance").position().left + parseInt($("#distance").css("width")) + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 1/4,
		"text-align" : "right"
	})

	$("#time").html(Math.round(data.consts.time.n))
	$("#time").css({
		position : 'absolute',
		top: parseInt($("#distance").position().top + $("#distance").height() + 3) + "px",
		left: 27 + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 3/4,
		"text-align" : "right"
	})

	$("#timeUnit").html(data.consts.timeUnits[data.consts.time.u])
	$("#timeUnit").css({
		position : 'absolute',
		top: parseInt($("#distance").position().top + $("#distance").height() + 3) + "px",
		left: $("#distance").position().left + parseInt($("#distance").css("width")) + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 1/4,
		"text-align" : "right"
	})


	// ----------------------------


   	if (!data.consts.isGameEventEnabled) {
   		data.consts.isGameEventEnabled = true
   		addConsoleEvents()
   	}
   	if (!data.consts.isConsoleEventEnabled) {
   		data.consts.isConsoleEventEnabled = true
   		addGameEvents()
   	}
}



function loopCanvas() {
	// Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height)


	// Get a random number. If it's 1, spawn a new star
	if (isRandomStarSpawning()) {
		newStar()
	}
	// Same for asteroids (much less likely)
	if (isAsteroidSpawning()) {
		newAsteroid()
	}

	renderStars()
	renderAsteroids()
	renderLasers()
	renderSpaceship()
	renderConsole()
}	

function renderSpaceship() {
	let ship = data.canvas.spaceship

	// EaseIn of the ship when the game starts.
	if (easeingShip) {
		increment += .016
		ship.y -= 1 / increment

		if (ship.y <= canvas.height/2) {
			increment = 0
			easeingShip = false
		}
		ctx.drawImage(ship.img, ship.x, ship.y)
	} else {
		ctx.drawImage(ship.img, canvas.width/2 - ship.width/2, canvas.height/2)
	}
}

// Renders the mining laser
function renderLasers() {
	if (data.canvas.lasers.length > 0) {
		for (let i = 0; i < data.canvas.lasers.length; i++) {
			let l = data.canvas.lasers[i]
			
			let astC = data.canvas.asteroids[0] // Default value that's, unfortunately, necessary
			for (let i = 0; i < data.canvas.asteroids.length; i++) {
				if (data.canvas.asteroids[i].uniqueID == l.uniqueID) {
					astC = data.canvas.asteroids[i]
					break
				}
			}

			let shipX = data.canvas.spaceship.x + data.canvas.spaceship.width/2
			let shipY = data.canvas.spaceship.y + data.canvas.spaceship.height/2
			let astCenterX = astC.getX() + astC.getWidth()/2
			let astCenterY = astC.getY() + astC.getHeight()/2
			l.reposition(shipX, shipY, astCenterX, astCenterY)

			// Draw the laser
			ctx.beginPath()
			ctx.moveTo(l.getStartX(), l.getStartY())
			ctx.lineTo(l.getEndX(), l.getEndY())
			ctx.strokeStyle = l.getColor()
			ctx.lineWidth = l.getStroke()
			ctx.stroke()
		}
	}
}

// Loops every asteroid and renders it like renderStars()
function renderAsteroids() {
	for (let i = 0; i < data.canvas.asteroids.length; i++) {
		let a = data.canvas.asteroids[i]
		a.moveDown()
		
		let transaltion = {
			x : a.getCenterX() + a.getAxis().x,
			y : a.getCenterY() + a.getAxis().y
		}
		ctx.save()
		ctx.translate(transaltion.x, transaltion.y)
		a.rotate()
		ctx.rotate(toRad(a.getRotation()))
		ctx.translate(-transaltion.x, -transaltion.y)
		

		// If the star reaches the end of the screen, remove it and shift the array.
		// In case the img hasn't fully loaded yet.
		let distance = 64
		if (a.img) {			
			distance = a.img.height
		} 
		if (a.y > canvas.height + distance/2) {
			// Remove the relative laser if it was being mined
			if (data.canvas.lasers.length > 0) {
				let ls = data.canvas.lasers 
				let as = data.canvas.asteroids

				for (let k = 0; k < ls.length; k++) {
					if (as[0].uniqueID == ls[k].uniqueID) {
						// Splice() will be needed when we have multiple lasers
						//ls.splice(i, 1)
						data.canvas.lasers = []
						break
					}
				}
			}

			// destroy() also removes the canvas object from data.canvas
			data.asteroidsData[0].destroy(0)			
		}

		// Draw the star
		if (typeof a.img === 'undefined') {
			//console.log("ERROR: asteroid img Undefined. Ignoring asteroid.")
		} else {
			ctx.drawImage(a.img, a.x, a.y)
		}
		ctx.restore()
	}		
}

// Loops every star, renders it and moves it at the start of every frame.
function renderStars() {
	for (let i = 0; i < data.canvas.stars.length; i++) {
		let s = data.canvas.stars[i]
		s.moveDown()

		// If the star reaches the end of the screen, remove it and shift the array.
		if (!s.img) {
			// In case the img hasn't fully loaded yet
			if (s.y > canvas.height + 64) {
				data.canvas.stars.shift()
			}
		} else {
			if (s.y > canvas.height + s.img.height) {
				data.canvas.stars.shift()
			}
		}

		// Draw the star
		if (typeof s.img === 'undefined') {
			console.log("ERROR: star img Undefined. Ignoring star.")
		} else {
			ctx.drawImage(s.img, s.x, s.y)
		}
	}	
}

// Adds a new star with a random X coord to data.canvas.stars.
function newStar() {
	let starW = 32
	if (data.canvas.stars.length > 1) {
		starW = data.canvas.stars[data.canvas.stars.length - 1].getWidth()
	}
	let x = getRandomStartPos(canvas.width, starW)
	let minDistance = 32

	// Check if it's not too close to another star.
	let lastStars = []
	if (data.canvas.stars.length > 2) {
		lastStars.push(data.canvas.stars[data.canvas.stars.length - 1])
		lastStars.push(data.canvas.stars[data.canvas.stars.length - 2])
		lastStars.push(data.canvas.stars[data.canvas.stars.length - 3])
	} else {
		for (let i = 0; i < lastStars.length; i++) {
			lastStars[i].getX() = x + minDistance
		}
	}

	// Checks the distance between the new star and the last 3 stars.
	// If it's not enought, random a new star.
	if (lastStars.length == 0) {
		let sprite = getRandomStarSprite()
		let s = new CanvasObj(x, 0, sprite, data.consts.starSpeed)
		if (!s.img) {
			s.y = -18
		} else {
			s.y = -(s.img.height)
		}
		data.canvas.stars.push(s)

	} else if (Math.abs(lastStars[0].getX() - x) < minDistance ||
		Math.abs(lastStars[1].getX() - x) < minDistance ||
		Math.abs(lastStars[2].getX() - x) < minDistance) 
	{
		newStar()
	} else {
		// Adds the star to the list of stars.
		let sprite = getRandomStarSprite()
		let s = new CanvasObj(x, 0, sprite, data.consts.starSpeed)
		if (!s.img) {
			s.y = -18
		} else {
			s.y = -(s.img.height)
		}
		
		// Deprecated. Having stars move at different speeds overloaded the game.
		//s.speed += getRandom(0, 2)
		data.canvas.stars.push(s)
	}	
}

// Adds a new random asteroid
function newAsteroid() {
	let asteroidW = 64
	if (data.canvas.asteroids.length > 1) {
		asteroidW = data.canvas.asteroids[data.canvas.asteroids.length - 1].getWidth()
	}

	let x = getRandomStartPos(canvas.width, asteroidW)
	let ship = data.canvas.spaceship
	// Make sure the asteroid doesn't spawn direclty on top of the ship, otherwise it'd be a pain to mine
	if (x > (ship.x) && x < (ship.x + ship.width)) {
		newAsteroid()
	} else {
		let minDistance = asteroidW

		// Check if it's not too close to another asteroid.
		let lastAsteroid = []
		if (data.canvas.asteroids.length > 2) {
			lastAsteroid.push(data.canvas.asteroids[data.canvas.asteroids.length - 1])
			lastAsteroid.push(data.canvas.asteroids[data.canvas.asteroids.length - 2])
		} else {
			for (let i = 0; i < lastAsteroid.length; i++) {
				lastAsteroid[i].getX() = x + minDistance
			}
		}
		if (data.canvas.asteroids.length <= data.consts.maxAsteroids) {	
			if (lastAsteroid.length == 0) {
				createAsteroid()
			} else if (Math.abs(lastAsteroid[0].getX() - x) < minDistance) {
				newAsteroid()
			} else {
				createAsteroid()
			}
		}
	}


	// Private internal function
	function createAsteroid(){
		let ast = getRandomAsteroidType()
		let srcIndex = 0
		// Contrary to the stars, the sprite is based on the asteroid, not a random one
		for (let i = 0; i < data.src.sprites.asteroids.srcs.length; i++) {
			if (data.src.sprites.asteroids.srcs[i] == ast.src) {
				srcIndex = i
			} 
		}
		let sprite = data.src.sprites.asteroids.images[srcIndex]
		let a = new CanvasObj(x, 0, sprite, data.consts.asteroidSpeed)
		if (!a.img) {
			a.y = -64
		} else {
			a.y = -(a.img.height)
		}

		// Makes sure to create a unique ID that the asteroid and the laser share
		ast.uniqueID = 0
		if (data.canvas.asteroids.length > 0) {
			ast.uniqueID = data.consts.lastAsteroidUniqueID + 1
			data.consts.lastAsteroidUniqueID = ast.uniqueID
			if (ast.uniqueID > 100) {
				ast.uniqueID = 0
				data.consts.lastAsteroidUniqueID = 0
			}
		}
		
		let astObj = new AsteroidObj(ast)
		a.uniqueID = ast.uniqueID
		a.setRotationAmount(astObj.getRotationAmount())
		a.setAxis(astObj.getAxis())

		data.canvas.asteroids.push(a)
		data.asteroidsData.push(astObj)
	}
}




function isRandomStarSpawning() {

	return getRandom(0, data.consts.starSpawnRate) == 1
}

function isAsteroidSpawning() {

	return getRandom(0, data.consts.asteroidSpawnRate) == 1
}

function getRandomStartPos(mapW, itemW) {
	// Offset per non clippare ai lati
	let offset = itemW + 2
	let randomNumber = offset + getRandom(0, (mapW - offset * 2))
		
	return randomNumber
}

// Randomly selects a star sprite from data.src.sprites.stars
function getRandomStarSprite() {
	let n = 0
	let chances = data.src.sprites.stars.chances
	let r = getRandom(1, 100)

	// Recursively analyze the percentage and get the index of the random star src
	function getStarChance(i, r) {
		if (i >= chances.length) {
			return 0
		}
		if (r <= chances[i]) {
			return getStarChance((i + 1), r)
		} else {
			return i
		}
	}
	n = getStarChance(0, r)

	return data.src.sprites.stars.images[n]	
}

function getRandomAsteroidType() {
	let r = getRandom(0, 100)
	let asts = data.consts.asteroidTypes
	let id = 0

	function getAstChance(i, r) {
		if (i >= asts.length) {
			return asts[0]
		}
		if (r <= asts[i].chance) {
			return getAstChance((i + 1), r)
		} else {
			return asts[i]
		}
	}
	
	let a = getAstChance(0, r)
	return a
}




function hyperdrive() {
	if (data.consts.turbo < 1000) {
		data.consts.turbo += 60
	}
}



function addConsoleEvents() {
	let isSliderSelected = false
	let startX
	let sliderDistance = 0

	$("#consoleCanvas").mousedown(function (e) {
		let k = this.objects.sliderSelector

		let rect = consoleCanvas.getBoundingClientRect()
      	let scaleX = consoleCanvas.width / rect.width
      	let scaleY = consoleCanvas.height / rect.height

    	let x = Math.floor((e.clientX - rect.left) * scaleX)
    	let y = Math.floor((e.clientY - rect.top) * scaleY)
    	let w = k.w * scaleX
    	let h = k.h * scaleY

    	let kx = k.x + data.consts.miningPriority * (this.objects.slider.image.width/5 - 1)

		if (!isPaused &&
			y > k.y && y < k.y + h && 
			x > kx && x < kx + w) {
			startX = x
			isSliderSelected = true
		}
		
	})

	$("#consoleCanvas").mousemove(function (e) {
		if (!isPaused && isSliderSelected) {
			let rect = consoleCanvas.getBoundingClientRect()
			let scaleX = consoleCanvas.width / rect.width
			let x = Math.floor((e.clientX - rect.left) * scaleX)
			let dx = x - startX
			startX = x

			sliderDistance += dx
			let p = data.consts.miningPriority

			if (sliderDistance > this.objects.slider.w/5 - this.objects.sliderSelector.w/5) {
				sliderDistance = 0
				if (p < data.consts.maxMiningPriority) { 
					p += 1
					sfx.hover.pause()
					sfx.hover.currentTime = 0
					sfx.hover.play()
				}

			} else if (sliderDistance < -(this.objects.slider.w/5) + this.objects.sliderSelector.w/5) {
				sliderDistance = 0
				if (p > 0) { 
					p -= 1
					sfx.hover.pause()
					sfx.hover.currentTime = 0
					sfx.hover.play()
				}
			}
			data.consts.miningPriority = p

		}
	})
	$("#consoleCanvas").mouseup(function (e) {
		if(!isPaused) {
			isSliderSelected = false
		
			consoleCanvas.objects.btnTurbo.visible = true
			consoleCanvas.objects.prsTurbo.visible = false
		}
	})

	$("#consoleCanvas").mouseout(function (e) {
		if(!isPaused) {
			if (isSliderSelected){
				isSliderSelected = false
			}
			consoleCanvas.objects.btnTurbo.visible = true
			consoleCanvas.objects.prsTurbo.visible = false
		}
	})


	consoleCanvas.addEventListener('mouseup', function(e) {
		if(!isPaused) {
			consoleCanvas.objects.btnTurbo.visible = true
			consoleCanvas.objects.prsTurbo.visible = false
		}
	})

	consoleCanvas.addEventListener('mousedown', function(e) {
		if(!isPaused) {
			let k = this.objects.btnTurbo

			let rect = consoleCanvas.getBoundingClientRect()
	      	let scaleX = consoleCanvas.width / rect.width
	      	let scaleY = consoleCanvas.height / rect.height

	    	let x = Math.floor((e.clientX - rect.left) * scaleX)
	    	let y = Math.floor((e.clientY - rect.top) * scaleY)
	    	let w = k.w * scaleX
	    	let h = k.h * scaleY

			let kxc = k.x + (k.w/2)
			let kyc = k.y + (k.h/2)

			let r = w/2

			if (Math.ceil(Math.sqrt(Math.pow(x - kxc, 2) + Math.pow(y - kyc, 2))) < r) {
				this.objects.btnTurbo.visible = false
				this.objects.prsTurbo.visible = true

				hyperdrive()
			}		
		}
	}, false)
}

function addGameEvents() {
	$("#gameCanvas").mousedown(function (e) {
		let rect = gameCanvas.getBoundingClientRect()
      	let scaleX = gameCanvas.width / rect.width
      	let scaleY = gameCanvas.height / rect.height

      	// Mouse click coords
    	let x = Math.floor((e.clientX - rect.left) * scaleX)
    	let y = Math.floor((e.clientY - rect.top) * scaleY)

    	let asts = data.canvas.asteroids

    	if (!isPaused) {
    		// Reverse for-loop so it can always select the topmost asteroid
    		for (let i = asts.length - 1; i >= 0; i--) {
				let a = asts[i]
				let aXend = a.getX() + a.getWidth()
				let aYend = a.getY() + a.getHeight()

	    		if (y > a.y && y < aYend && 
					x > a.x && x < aXend) {
	    			if (data.asteroidsData[i]) {
	    				startMining(i)
						break
	    			}
					
				}
    		}
    	}    	
    	
	})
	$("#gameCanvas").mousemove(function (e) {
		if (!isPaused) {
			
		}
	})
	$("#gameCanvas").mouseup(function (e) {
		if(!isPaused) {

		}
	})

	$("#gameCanvas").mouseout(function (e) {
		if(!isPaused) {

		}
	})

	gameCanvas.addEventListener('mouseup', function(e) {
		if(!isPaused) {

		}
	})

	gameCanvas.addEventListener('mousedown', function(e) {
		if(!isPaused) {
					
		}
	}, false)
}

// ---------------------------------- Renderer END ------------------------------------ //

// --------------------------------- Mining Handler ---------------------------------- //

// Calculates the stars and end point of the laser and adds it to data.canvas.lasers
// Then it keeps mining every 4 ticks
function startMining(targetID) {
	if (data.canvas.lasers.length >= data.consts.maxConcurrentLasers) {
		// Remove existing lasers
		// This minght need to be changed when we implement auto-lasers.
		data.canvas.lasers = []
	}

	if (data.canvas.lasers.length > 0) {
		if (data.canvas.lasers[0].uniqueID != uniqueID) {
			makeLaser()
		}
	} else {
		makeLaser()
	}

	// Private function
	function makeLaser() {
		// Rendering
		let astC = data.canvas.asteroids[targetID]
		let shipX = data.canvas.spaceship.x + data.canvas.spaceship.width/2
		let shipY = data.canvas.spaceship.y + data.canvas.spaceship.height/2
		
		let astCenterX = astC.getX() + astC.getWidth()/2
		let astCenterY = astC.getY() + astC.getHeight()/2
		
		let lineObj = new LineObject(shipX, shipY, astCenterX, astCenterY, 2, '#AA0000')
		lineObj.uniqueID = astC.uniqueID
		data.canvas.lasers.push(lineObj)
	}
}

// Loops the active lasers and calls asteroidObj.mine()
function updateMining() {
	let inv = game.resources
	let ls = data.canvas.lasers
	let as = data.asteroidsData

	for (let i = 0; i < ls.length; i++) {
		for (let j = 0; j < as.length; j++) {
			if (as[j].uniqueID == ls[i].uniqueID) {
				data._s.rPrio.reverse()
				let prio = data._s.rPrio[data.consts.miningPriority]
				data._s.rPrio.reverse()
				let mined = as[j].mine(data.consts.miningStrength, prio)	
				if (mined != null) {
					addResource(mined.resource, mined.n)
				}		
				
			} 
		}
	}
}

function addResource(r, n) {
	game.resources[r] += n
	if (game.resources[r] > game.resourcesMax[r]) {
		game.resources[r] = game.resourcesMax[r]
	}
}







// --------------------------------- Mining Handler END ------------------------------ //

// --------------------------------- Unit Conversion --------------------------------- //


function updateDistance() {
	if (data.consts.distance.n >= data.consts.distanceMax || data.consts.distance.n <= data.consts.speed.n * 2 || data.consts.distance.n <= 2) {
		let newVal = unitConversion(data.consts.distance.n, data.consts.distance.u, 'd')
		data.consts.distance.n = newVal.n
		data.consts.distance.u = newVal.u
		updateSpeed()
	}
}

function updateSpeed() {
	let newVal = unitConversion(data.consts.speed.n, data.consts.speed.u, 's')
	data.consts.speed.n = newVal.n
	data.consts.speed.u = newVal.u
}


function unitConversion(n, u, type) {
	if (type == 'd') {
		if (n >= data.consts.distanceMax) {
			if (u == 0)	return convertToAU(n, u)
			if (u == 1)	return convertToPC(n, u)
		} else {
			if (u == 2)	return convertToAU(n, u)
			if (u == 1)	return convertToKM(n, u)
		}
	} else if (type == 's') {
		if (n >= data.consts.distanceMax) {
			if (u == 0)	return convertToAU(n, u)
			if (u == 1)	return convertToPC(n, u)
		} else {
			if (u == 2)	return convertToAU(n, u)
			if (u == 1)	return convertToKM(n, u)
		}
	}
	
}

function convertToAU(n, u) {
	// KM --> AU
	if (u == 0) {
		return { u : 1,	n : Math.round((n / 149598000).toFixedNumber(1)) }
	} 
	// PC --> AU
	if (u == 2) {
		return { u : 1, n : parseInt(n * 206265) }
	}
}

function convertToPC(n, u) {
	// AU --> PC
	if (u == 1) {
		return { u : 2,	n : Math.round((n / 206265).toFixedNumber(1)) }
	} 
	// ?? --> PC
	// If we need a higher unit of measurement
}


function convertToKM(n, u) {
	// AU --> KM
	if (u == 1) {
		return { u : 0, n : parseInt(n * 149598000) }
	}
}

// --------------------------------- Unit Conversion END ------------------------------ //













function toggleBoot() {
	settings.visual.isConsoleBoot = !settings.visual.isConsoleBoot
	if (settings.visual.isConsoleBoot) {
		$('#isBoot').text(' ON')
	} else {
		$('#isBoot').text(' OFF')
	}

	saveSettings()
}


function pauseGameLoop() {
	if (gLoop) {
		clearInterval(gLoop)
		Renderer.postMessage({ stopCanvas : true })
		isPaused = true
	}
}

function resumeGameLoop() {
	if (isPaused) {
		gLoop = setInterval(gameLoop, FRAMERATE)
		Renderer.postMessage({resumeCanvas : true})
		isPaused = false
	}
}
