'use strict';

var socket = io.connect('http://localhost:3000');
socket.on('new player', function (numPlayers) {
	if (numPlayers == 1) {
		console.log('start new game');
		startGame();
		console.log(grid);
		socket.emit('new game', { grid: grid.outerHTML, solution: solution, puzzle: puzzle, guesses: guesses });
	} else {
		socket.emit('existing game');
		socket.on('existing game', function (game) {
			console.log('getting game data');
			grid.outerHTML = game.grid;
			solution = game.solution;
			puzzle = game.puzzle;
			guesses = game.guesses;
			fillInGuesses(guesses);
		});
	}
	$('#numPlayers').text(numPlayers);
	//	socket.on()
});

socket.on('player disconnected', function (numPlayers) {
	$('#numPlayers').text(numPlayers);
});

// socket.on('get current game', function () {
// 	socket.emit('current game', {grid: grid.outerHTML, solution, puzzle, guesses});
// })

var grid = document.getElementById("grid");
var rowStart = 1;
var n = 1;
var solution = [[], [], [], [], [], [], [], [], []];
var puzzle = [[], [], [], [], [], [], [], [], []];
var guesses = [[], [], [], [], [], [], [], [], []];

function startGame() {
	// generate grid
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			var currentGrid = "grid" + i + j;
			grid.innerHTML += '<div id="' + currentGrid + '" class="grid-item" onkeydown="moveFocus(this.id)"></div>';
			if ((i == 2 || i == 5) && (j == 2 || j == 5)) {
				document.getElementById(currentGrid).style = "border-bottom-width: 2px; border-right-width: 2px;";
			} else if (i == 2 || i == 5) {
				document.getElementById(currentGrid).style = "border-bottom-width: 2px;";
			} else if (j == 2 || j == 5) {
				document.getElementById(currentGrid).style = "border-right-width: 2px;";
			}
		}
	}

	// generate solution
	for (var i = 0; i < 9; i++) {
		n = rowStart;
		for (var j = 0; j < 9; j++) {
			if (n <= 9) {
				solution[i][j] = n;
				n++;
			} else {
				n = 1;
				solution[i][j] = n;
				n++;
			}
		}
		rowStart += 3;
		if (rowStart > 9) {
			rowStart = rowStart % 9 + 1;
		}
	}

	shuffleSolution();
}

// document.getElementsByTagName('input').onchange() = function() {
// 	console.log('change');
// }

// shuffle solution
function switchRows(a, b) {
	if (a != b) {
		for (var j = 0; j < 9; j++) {
			var temp = solution[a][j];
			solution[a][j] = solution[b][j];
			solution[b][j] = temp;
		}
	}
}

function switchCols(a, b) {
	if (a != b) {
		for (var i = 0; i < 9; i++) {
			var temp = solution[i][a];
			solution[i][a] = solution[i][b];
			solution[i][b] = temp;
		}
	}
}

function switchRowBlocks(a, b) {
	if (a != b) {
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 9; j++) {
				var temp = solution[3 * a + i][j];
				solution[3 * a + i][j] = solution[3 * b + i][j];
				solution[3 * b + i][j] = temp;
			}
		}
	}
}

function switchColBlocks(a, b) {
	if (a != b) {
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 3; j++) {
				var temp = solution[i][3 * a + j];
				solution[i][3 * a + j] = solution[i][3 * b + j];
				solution[i][3 * b + j] = temp;
			}
		}
	}
}

function switchNumbers(x, y) {
	if (x != y) {
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				if (solution[i][j] == x) {
					solution[i][j] = y;
				} else if (solution[i][j] == y) {
					solution[i][j] = x;
				}
			}
		}
	}
}

function shuffleSolution() {
	puzzle = [[], [], [], [], [], [], [], [], []];
	guesses = [[], [], [], [], [], [], [], [], []];
	do {
		switchRows(Math.floor(Math.random() * 3), Math.floor(Math.random() * 3));
		console.log("r");
	} while (Math.floor(Math.random() * 3) != 0);
	do {
		switchCols(Math.floor(Math.random() * 3), Math.floor(Math.random() * 3));
		console.log("c");
	} while (Math.floor(Math.random() * 3) != 0);
	do {
		switchRowBlocks(Math.floor(Math.random() * 3), Math.floor(Math.random() * 3));
		console.log("rb");
	} while (Math.floor(Math.random() * 3) != 0);
	do {
		switchColBlocks(Math.floor(Math.random() * 3), Math.floor(Math.random() * 3));
		console.log("cb");
	} while (Math.floor(Math.random() * 3) != 0);
	do {
		switchNumbers(Math.ceil(Math.random() * 9), Math.ceil(Math.random() * 9));
		console.log("sn");
	} while (Math.floor(Math.random() * 4) != 0);
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			var currentGrid = "grid" + i + j;
			var gridNode = document.getElementById(currentGrid);
			if (gridNode.firstChild) {
				gridNode.removeChild(gridNode.firstChild);
			} else {
				document.getElementById(currentGrid).innerHTML = "";
			}
			var random = Math.random() * 10;
			if (random < 3) {
				document.getElementById(currentGrid).innerHTML = solution[i][j];
				document.getElementById(currentGrid).style.fontWeight = "bold";
			} else {
				puzzle[i][j] = 0;
				var guess = document.createElement("input");
				guess.setAttribute("id", "guess" + i + j);
				//	guess.setAttribute("type", "number");
				guess.setAttribute("maxlength", "1");
				//	guess.setAttribute("onfocus", "this.value=''");
				guess.setAttribute('onFocus', 'onFocusFunction(this.id)');
				guess.setAttribute('onBlur', 'onBlurFunction(this.id)');
				guess.setAttribute('onInput', "onInputFunction(this.id, this.value)");
				document.getElementById(currentGrid).appendChild(guess);
				//	guesses[i][j] = parseInt(guess, 10);
				console.log(guesses[i][j]);
			}
		}
	}
}

onFocusFunction = function onFocusFunction(id) {
	socket.emit('focus', id);
};

socket.on('focus', function (id) {
	console.log('focus');
	$('#' + id).css({ backgroundColor: 'rgba(0, 150, 200, 0.3)' });
});

onBlurFunction = function onBlurFunction(id) {
	socket.emit('blur', id);
};

socket.on('blur', function (id) {
	console.log('focus');
	$('#' + id).css({ backgroundColor: 'transparent' });
});

onInputFunction = function onInputFunction(id, value) {
	socket.emit('input', { id: id, value: value });
	console.log('onchangefunction');
};

socket.on('input', function (input) {
	console.log(input);
	$('#' + input.id).val(input.value);
});

function fillInGuesses(guesses) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (guesses[i][j]) {
				console.log(guesses[i][j]);
				console.log($('#guess' + i + j));

				$('#guess' + i + j).val('' + guesses[i][j]);
			}
		}
	}
}

// functions for buttons
var checkGrid = [];
var checkLength = 0;

function check() {
	checkGrid = [];
	checkLength = 0;
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			var currentGrid = "grid" + i + j;
			var currentGuess = "guess" + i + j;
			if (puzzle[i][j] == 0) {
				var g = parseInt(document.getElementById(currentGuess).value, 10);
				if (g >= 1 && g <= 9) {
					guesses[i][j] = g;
					if (guesses[i][j] != solution[i][j]) {
						checkGrid.push(currentGrid);
						document.getElementById(checkGrid[checkLength]).className += " red";
						transparentRed(checkLength);
						checkLength++;
					} else if (guesses[i][j] == solution[i][j]) {
						checkGrid.push(currentGrid);
						document.getElementById(checkGrid[checkLength]).className += " green";
						transparentGreen(checkLength);
						checkLength++;
					}
				} else if (document.getElementById(currentGuess).value != "") {
					checkGrid.push(currentGrid);
					document.getElementById(checkGrid[checkLength]).className += " grey";
					transparentGrey(checkLength);
					checkLength++;
				}
			}
		}
	}
}

function transparentGreen(i) {
	setTimeout(function () {
		document.getElementById(checkGrid[i]).classList.remove("green");
	}, 500);
}

function transparentRed(i) {
	setTimeout(function () {
		document.getElementById(checkGrid[i]).classList.remove("red");
	}, 500);
}

function transparentGrey(i) {
	setTimeout(function () {
		document.getElementById(checkGrid[i]).classList.remove("grey");
	}, 500);
}

function clearGuesses() {
	console.log("clear");
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			var currentGuess = "guess" + i + j;
			var currentGrid = "grid" + i + j;
			if (puzzle[i][j] == 0) {
				document.getElementById(currentGuess).value = "";
				document.getElementById(currentGrid).style.backgroundColor = "transparent";
			}
		}
	}
}

var showingSolution = false;

function showSolution() {
	console.log("solution");
	if (showingSolution == false) {
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				var currentGuess = "guess" + i + j;
				if (puzzle[i][j] == 0) {
					document.getElementById(currentGuess).value = solution[i][j];
				}
			}
		}
		showingSolution = true;
	} else {
		clearGuesses();
		showingSolution = false;
	}
}

function moveFocus(id) {
	var i = id.charAt(4);
	var j = id.charAt(5);
	var x = event.keyCode;

	switch (x) {
		case 37:
			if (j == 0 && i != 0) {
				j = 8;
				i--;
			} else if (j != 0) {
				j--;
			}
			if (document.getElementById("guess" + i + j) != null) {
				break;
			} else {
				var testj = j;
				for (; testj >= 0; testj--) {
					if (document.getElementById("guess" + i + testj) != null) {
						j = testj;
						break;
					}
				}
			}
			break;
		case 38:
			if (i != 0) {
				i--;
			}
			if (document.getElementById("guess" + i + j) != null) {
				break;
			} else {
				var testi = i;
				for (; testi >= 0; testi--) {
					if (document.getElementById("guess" + testi + j) != null) {
						i = testi;
						break;
					}
				}
			}
			break;
		case 39:
			if (j == 8 && i != 8) {
				j = 0;
				i++;
			} else if (j != 8) {
				j++;
			}
			if (document.getElementById("guess" + i + j) != null) {
				break;
			} else {
				var testj = j;
				for (; testj < 9; testj++) {
					if (document.getElementById("guess" + i + testj) != null) {
						j = testj;
						break;
					}
				}
			}
			break;
		case 40:
			if (i != 8) {
				i++;
			}
			if (document.getElementById("guess" + i + j) != null) {
				break;
			} else {
				var testi = i;
				for (; testi < 9; testi++) {
					if (document.getElementById("guess" + testi + j) != null) {
						i = testi;
						break;
					}
				}
			}
			break;
	}
	document.getElementById("guess" + i + j).focus();
}

// check final solution
function checkRow(row) {
	var numCount = new Array(10).fill(0);
	for (var i = 0; i < 9; i++) {
		var _current = void 0;
		var _g = void 0;
		if (puzzle[row][i] == 0) {
			_current = "guess" + row + i;
			_g = parseInt(document.getElementById(_current).value, 10);
		} else {
			_g = solution[row][i];
		}
		numCount[_g] += 1;
	}
	for (var _i = 1; _i <= 9; _i++) {
		if (numCount[_i] != 1) {
			console.log('numcount:' + numCount[_i] + ', i: ' + _i);
			return false;
		}
	}
	return true;
}

function checkColumn(column) {
	var numCount = new Array(10).fill(0);
	for (var i = 0; i < 9; i++) {
		var _current2 = void 0;
		var _g2 = void 0;
		if (puzzle[i][column] == 0) {
			_current2 = "guess" + i + column;
			_g2 = parseInt(document.getElementById(_current2).value, 10);
		} else {
			_g2 = solution[i][column];
		}
		numCount[_g2] += 1;
	}
	for (var _i2 = 1; _i2 <= 9; _i2++) {
		if (numCount[_i2] != 1) {
			console.log('numcount:' + numCount[_i2] + ', i: ' + _i2);
			return false;
		}
	}
	return true;
}

function checkBox(box) {
	var boxStartRow = Math.floor(box / 3) * 3;
	var boxStartCol = box % 3 * 3;
	var numCount = new Array(10).fill(0);
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			if (puzzle[boxStartRow + i][boxStartCol + j] == 0) {
				current = "guess" + (boxStartRow + i) + (boxStartCol + j);
				g = parseInt(document.getElementById(current).value, 10);
			} else {
				g = solution[boxStartRow + i][boxStartCol + j];
			}
			numCount[g] += 1;
		}
	}
	for (var _i3 = 1; _i3 <= 9; _i3++) {
		if (numCount[_i3] != 1) {
			console.log('numcount:' + numCount[_i3] + ', i: ' + _i3);
			return false;
		}
	}
	return true;
}

function checkFinalSolution() {
	var check = true;
	for (var i = 0; i < 9; i++) {
		if (!checkRow(i) || !checkColumn(i) || !checkBox(i)) {
			check = false;
		}
	}
	if (check) {
		document.getElementById('grid').className += " green";
		setTimeout(function () {
			document.getElementById('grid').classList.remove("green");
		}, 500);
	} else {
		document.getElementById('grid').className += " red";
		setTimeout(function () {
			document.getElementById('grid').classList.remove("red");
		}, 500);
	}
}
//# sourceMappingURL=script.js.map