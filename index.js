//Initialize const's

const connectFour = document.getElementById('connectFour');
const playComputer = document.getElementById('cpu');
const playerVsPlayer = document.getElementById('1v1');
const resetBtn = document.getElementById('reset');

//Initialize vars
var playerTurn = 0;
var gameState = {
	colHeight: [0, 0, 0, 0, 0, 0, 0],
	colPieces: [[], [], [], [], [], [], []],
	rowPieces: [[], [], [], [], [], []],
};

// Event listener
connectFour.addEventListener('click', dropPiece);
playComputer.addEventListener('click', startGame);
playerVsPlayer.addEventListener('click', startGame);
resetBtn.addEventListener('click', reset);

//Function Declarations
function startGame() {}
function makeBoard() {
	for (let k = 0; k < 6; k++) {
		const row = document.createElement('tr');
		for (let i = 0; i < 7; i++) {
			const td = document.createElement('td');
			row.appendChild(td);
		}
		connectFour.appendChild(row);
	}
}

function dropPiece(e) {
	let col = e.target.cellIndex;
	if (playerTurn % 2 === 0) {
		connectFour.children[5 - gameState.colHeight[col]].children[
			col
		].className = 'red';
		gameState.colPieces[col].push('red');
		gameState.rowPieces[gameState.colHeight[col]][col] = 'red';
		console.log(gameState.rowPieces);
	} else {
		connectFour.children[5 - gameState.colHeight[col]].children[
			col
		].className = 'blue';
		gameState.colPieces[col].push('blue');
		gameState.rowPieces[gameState.colHeight[col]][col] = 'blue';
	}
	gameState.colHeight[col]++;
	playerTurn++;
	isColumnFull(col);
	if (hasSomeoneWon()) {
		let background = '';
		let innerText = '';
		if (playerTurn % 2 === 0) {
			background =
				'linear-gradient(90deg, rgba(47,39,194,1) 0%, rgba(111,111,215,1) 35%, rgba(0,212,255,1) 100%)';
			innerText = 'Blue has won! Reset?';
		} else {
			background =
				'linear-gradient(90deg, rgba(222,27,81,1) 0%, rgba(238,127,168,1) 34%, rgba(247,182,209,1) 85%)';
			innerText = 'Red has won! Reset?';
		}
		Toastify({
			text: innerText,
			duration: 5000,
			close: true,
			gravity: 'top', // `top` or `bottom`
			position: 'center', // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			style: {
				background: background,
			},
			onClick: function () {
				reset();
			}, // Callback after click
		}).showToast();
	}
	// console.log(buildDiagonalArrays());
}
function isColumnFull(col) {
	if (gameState.colHeight[col] > 5) {
		for (let i = 0; i < connectFour.children.length; i++) {
			connectFour.children[i].children[col].id = 'full';
		}
	}
}
function hasSomeoneWon() {
	let diagnols = buildDiagonalArrays();
	for (let i = 0; i < diagnols.length; i++) {
		if (
			diagnols[i].toString().search('red,red,red,red') === -1 &&
			diagnols[i].toString().search('blue,blue,blue,blue') === -1
		) {
			continue;
		} else {
			return true;
		}
	}
	for (let i = 0; i < gameState.colPieces.length; i++) {
		if (
			gameState.colPieces[i].toString().search('red,red,red,red') ===
				-1 &&
			gameState.colPieces[i].toString().search('blue,blue,blue,blue') ===
				-1
		) {
			continue;
		} else {
			return true;
		}
	}
	for (let i = 0; i < gameState.rowPieces.length; i++) {
		if (
			gameState.rowPieces[i].toString().search('red,red,red,red') ===
				-1 &&
			gameState.rowPieces[i].toString().search('blue,blue,blue,blue') ===
				-1
		) {
			continue;
		} else {
			return true;
		}
	}
}

function buildDiagonalArrays() {
	let diagonalArrays = [];
	for (let i = 0; i < gameState.colHeight.length; i++) {
		let height = 0;
		let col = i;
		let tempDiag = [];
		if (i === 3) {
			let left = [
				gameState.colPieces[3][0],
				gameState.colPieces[2][1],
				gameState.colPieces[1][2],
				gameState.colPieces[0][3],
			];
			let right = [
				gameState.colPieces[3][0],
				gameState.colPieces[4][1],
				gameState.colPieces[5][2],
				gameState.colPieces[6][3],
			];
			diagonalArrays.push(left);
			diagonalArrays.push(right);
		} else if (i < 3) {
			while (col < 7 && height < 6) {
				tempDiag.push(gameState.colPieces[col][height]);
				col++;
				height++;
			}
			diagonalArrays.push(tempDiag);
		} else if (i > 3) {
			while (col >= 0 && height < 6) {
				tempDiag.push(gameState.colPieces[col][height]);
				col--;
				height++;
			}
			diagonalArrays.push(tempDiag);
		}
	}
	diagonalArrays.push([
		gameState.colPieces[0][1],
		gameState.colPieces[1][2],
		gameState.colPieces[2][3],
		gameState.colPieces[3][4],
		gameState.colPieces[4][5],
	]);
	diagonalArrays.push([
		gameState.colPieces[0][2],
		gameState.colPieces[1][3],
		gameState.colPieces[2][4],
		gameState.colPieces[3][5],
	]);
	diagonalArrays.push([
		gameState.colPieces[6][1],
		gameState.colPieces[5][2],
		gameState.colPieces[4][3],
		gameState.colPieces[3][4],
		gameState.colPieces[2][5],
	]);
	diagonalArrays.push([
		gameState.colPieces[6][2],
		gameState.colPieces[5][3],
		gameState.colPieces[4][4],
		gameState.colPieces[3][5],
	]);
	return diagonalArrays;
}
function reset() {
	connectFour.innerHTML = '';
	makeBoard();
	playerTurn = 0;
	gameState = {
		colHeight: [0, 0, 0, 0, 0, 0, 0],
		colPieces: [[], [], [], [], [], [], []],
		rowPieces: [[], [], [], [], [], []],
	};
}

//Function Calls
makeBoard();
//Debugging
let array = [1, 2, 3, 4, 5, 6];
