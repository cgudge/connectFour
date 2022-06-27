//Initialize const's
const pvpButton = document.getElementById('pvp');
const cpuButton = document.getElementById('cpu');
const input = document.getElementById('input');
const startGameButtons = document.getElementById('startButtons');
const playerOne = document.getElementById('playerOne');
const playerTwo = document.getElementById('playerTwo');
const nameSpace = document.getElementById('nameSpace');
const connectFour = document.getElementById('connectFour');
const resetButton = document.getElementById('resetButton');
//make reset button invisble
resetButton.hidden = true;
//Initialize vars
let playerTurn = 0;
let gameState = {
	colHeight: [0, 0, 0, 0, 0, 0, 0],
	colPieces: [[], [], [], [], [], [], []],
	rowPieces: [[], [], [], [], [], []],
	isFirstGame: true,
};
let notFullCol = [0, 1, 2, 3, 4, 5, 6];
let isCPUGame = false;
let playerOneName;
let playerTwoName;

// Event listener
connectFour.addEventListener('click', dropPiece);
cpuButton.addEventListener('click', startGameCPU);
pvpButton.addEventListener('click', startGame);
resetButton.addEventListener('click', reset);

//Function Declarations
function startGameCPU() {
	isCPUGame = true;
	playerTwoName = 'Computer';
	startGame();
}
function startGame() {
	resetButton.hidden = false;
	console.log(playerTwoName);
	console.log(startGameButtons);
	input.hidden = true;
	startGameButtons.hidden = true;
	if (playerOne.value === '') {
		playerOneName = 'Player One';
	} else {
		playerOneName = playerOne.value;
	}

	if (!isCPUGame) {
		if (playerTwo.value === '') {
			playerTwoName = 'Player Two';
		} else {
			playerTwoName = playerTwo.value;
		}
	}
	makeBoard();
}
function makeBoard() {
	if (gameState.isFirstGame) {
		heading = document.createElement('h2');
		heading.innerHTML = `<span id = 'h2playerOne'>${playerOneName}</span> vs <span id = 'h2playerTwo'>${playerTwoName}</span>`;
		nameSpace.appendChild(heading);
		gameState.isFirstGame = false;
	}

	for (let k = 0; k < 6; k++) {
		const row = document.createElement('tr');
		for (let i = 0; i < 7; i++) {
			const td = document.createElement('td');
			row.appendChild(td);
		}
		connectFour.appendChild(row);
	}
}

function dropPiece(e, isComputer) {
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
		for (let i = 0; i < connectFour.children.length; i++) {
			for (let k = 0; k < 7; k++) {
				connectFour.children[i].children[k].id = 'full';
			}
		}

		let background = '';
		let innerText = '';
		if (playerTurn % 2 === 0) {
			background =
				'linear-gradient(90deg, rgba(47,39,194,1) 0%, rgba(111,111,215,1) 35%, rgba(0,212,255,1) 100%)';
			innerText = `${playerTwo.value} has won! Reset?`;
		} else {
			background =
				'linear-gradient(90deg, rgba(222,27,81,1) 0%, rgba(238,127,168,1) 34%, rgba(247,182,209,1) 85%)';
			innerText = `${playerOne.value} has won! Reset?`;
		}
		Toastify({
			text: innerText,
			duration: 5000,
			close: true,
			gravity: 'top', // `top` or `bottom`
			position: 'center', // `left`, `center` or `right`
			style: {
				background: background,
			},
			onClick: function () {
				reset();
			}, // Callback after click
		}).showToast();
		return;
	}
	if (!isComputer && isCPUGame) {
		canSomeoneWinNext();
	}
}
function isColumnFull(col) {
	if (gameState.colHeight[col] > 5) {
		for (let i = 0; i < connectFour.children.length; i++) {
			connectFour.children[i].children[col].id = 'full';
		}
		notFullCol.splice(col, 1);
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
	notFullCol = [0, 1, 2, 3, 4, 5, 6];
}

function computerTurn() {}
function canSomeoneWinNext() {
	let computer = {
		target: {
			cellIndex:
				notFullCol[Math.floor(Math.random() * notFullCol.length)],
		},
	};

	for (let i = 0; i < gameState.colPieces.length; i++) {
		if (
			gameState.colPieces[i].length < 6 &&
			gameState.colPieces[i][gameState.colPieces[i].length - 1] ===
				'blue' &&
			gameState.colPieces[i][gameState.colPieces[i].length - 2] ===
				'blue' &&
			gameState.colPieces[i][gameState.colPieces[i].length - 3] === 'blue'
		) {
			computer.target.cellIndex = i;
			dropPiece(computer, true);
			console.log(`its winnable on col ${i}`);
			return;
		}
	}
	for (let i = 0; i < gameState.rowPieces.length; i++) {
		for (let k = 0; k < 4; k++) {
			let isTherePieceUnder;
			if (i === 0) {
				isTherePieceUnder = true;
			} else {
				isTherePieceUnder =
					gameState.rowPieces[i - 1][k + 3] !== undefined;
			}
			if (
				gameState.rowPieces[i][k] === 'blue' &&
				gameState.rowPieces[i][k + 1] === 'blue' &&
				gameState.rowPieces[i][k + 2] === 'blue' &&
				gameState.rowPieces[i][k + 3] === undefined &&
				isTherePieceUnder
			) {
				computer.target.cellIndex = k + 3;
				dropPiece(computer, true);
				console.log(`its winnable on row ${i}`);
				return;
			}
		}
	}
	for (let i = 0; i < gameState.colPieces.length; i++) {
		if (
			gameState.colPieces[i].length < 6 &&
			gameState.colPieces[i][gameState.colPieces[i].length - 1] ===
				'red' &&
			gameState.colPieces[i][gameState.colPieces[i].length - 2] ===
				'red' &&
			gameState.colPieces[i][gameState.colPieces[i].length - 3] === 'red'
		) {
			computer.target.cellIndex = i;
			dropPiece(computer, true);
			console.log(`its loseable on col ${i}`);
			return;
		}
	}
	for (let i = 0; i < gameState.rowPieces.length; i++) {
		for (let k = 0; k < 4; k++) {
			let isTherePieceUnder;
			if (i === 0) {
				isTherePieceUnder = true;
			} else {
				isTherePieceUnder =
					gameState.rowPieces[i - 1][k + 3] !== undefined;
			}
			if (
				gameState.rowPieces[i][k] === 'red' &&
				gameState.rowPieces[i][k + 1] === 'red' &&
				gameState.rowPieces[i][k + 2] === 'red' &&
				gameState.rowPieces[i][k + 3] === undefined &&
				isTherePieceUnder
			) {
				computer.target.cellIndex = k + 3;
				dropPiece(computer, true);
				console.log(`its loseable on row ${i}`);
				return;
			}
		}
	}
	dropPiece(computer, true);
}

//Function Calls
//Debugging
