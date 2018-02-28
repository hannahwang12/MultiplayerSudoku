// generate grid
var grid = document.getElementById("grid");
for (var i = 0; i < 9; i++) {
	for (var j = 0; j < 9; j++) {
		var currentGrid	= "grid" + i + j;
		grid.innerHTML += '<div id="' + currentGrid + '" class="grid-item"></div>';

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
var solution = [[],[],[],[],[],[],[],[],[]];
var rowStart = 1;
var n = 1;

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
		rowStart = (rowStart % 9) + 1;
	}
}


// shuffle solution
function shuffleRow() {

}


// add numbers
var puzzle = [[],[],[],[],[],[],[],[],[]];
var guesses = [[],[],[],[],[],[],[],[],[]];

for (var i = 0; i < 9; i++) {
	for (var j = 0; j < 9; j++) {
		var currentGrid = "grid" + i + j;
		var random = (Math.random() * 10);
		if (random < 3) {
			document.getElementById(currentGrid).innerHTML = solution[i][j];
			document.getElementById(currentGrid).style.color = "#777";
		} else {
			puzzle[i][j] = 0;
			var guess = document.createElement("INPUT");
			guess.setAttribute("id", "guess" + i + j);
		//	guess.setAttribute("type", "number");
			guess.setAttribute("maxlength", "1");
			document.getElementById(currentGrid).appendChild(guess);
		//	guesses[i][j] = parseInt(guess, 10);
			console.log(guesses[i][j]);
		}
	}
}
console.log(solution[2][1]);

// check answer
function check() {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			var currentGrid = "grid" + i + j;
			var currentGuess = "guess" + i + j;
			if (puzzle[i][j] == 0) {
				var g = parseInt(document.getElementById(currentGuess).value, 10);
				if (g >= 1 && g <= 9) {
					guesses[i][j] = g;
					console.log(guesses[i][j]);
					console.log(solution[i][j]);
					if (guesses[i][j] != solution[i][j]) {
						document.getElementById(currentGrid).style.backgroundColor = "rgba(200, 0, 0, 0.3)"
					} else if (guesses[i][j] == solution[i][j]) {
						document.getElementById(currentGrid).style.backgroundColor = "transparent";
					}
				} else if (document.getElementById(currentGuess).value != "") {
					document.getElementById(currentGrid).style.backgroundColor = "#aaa"
				}
			}
		}
	}
}