// BRANCH


/**
* Game of Life
* @author Nick Allen
*
*/
(function() {
  "use strict";

  // Globals
  const NUMBER_OF_ROWS = 60;
  const NUMBER_OF_COLUMNS = 125;
  const CELL_ID_SEPARATOR = '_';
  /**
  * Chance of cell being alive during random generation.
  */
  const PERCENT_RANDOM_ALIVE_CELLS = 0.5;

  const GAME_SPEED_IN_MILLISECONDS = 200;

  /**
  * Constructor.
  */
  function GameOfLife() {
    this._isPlaying = false;
    this._timerId = null;

    // Create the data model
    this._tableData = new Array(NUMBER_OF_ROWS);
    this._nextGenTableData = new Array(NUMBER_OF_ROWS);

    // Create the table
    var table = document.createElement('table');
    for (var i = 0; i < NUMBER_OF_ROWS; i++) {
      var tableRow = document.createElement('tr');
      this._tableData[i] = new Array(NUMBER_OF_COLUMNS);
      this._nextGenTableData[i] = new Array(NUMBER_OF_COLUMNS);
      for (var j = 0; j < NUMBER_OF_COLUMNS; j++) {
        var cell = document.createElement('td');
        cell.setAttribute('id', i + CELL_ID_SEPARATOR + j);
        // Cells default to dead
        cell.setAttribute('class', 'dead');
        this._tableData[i][j] = 0;

        cell.addEventListener('click', this._handleCellClick.bind(this));
        tableRow.appendChild(cell);
      }
      table.appendChild(tableRow);
    }

    // Attach table to the div
    var tableDiv = document.getElementById('gridContainer');
    tableDiv.appendChild(table);

    // Attach listeners
    this._attachListeners();
  }

  /**
  * Update table data model function.
  */
  GameOfLife.prototype._updateTable = function() {
    for (var i = 0; i < NUMBER_OF_ROWS; i++) {
      for (var j = 0; j < NUMBER_OF_COLUMNS; j++) {
        this._updateCell(i, j);
      }
    }
    // Push new board state into current
    this._copyTableData();

    this._redrawTable();
  };

  GameOfLife.prototype._copyTableData = function() {
    for (var i = 0; i < NUMBER_OF_ROWS; i++) {
      for (var j = 0; j < NUMBER_OF_COLUMNS; j++) {
        this._tableData[i][j] = this._nextGenTableData[i][j];
        this._nextGenTableData[i][j] = 0;
      }
    }
  };

  GameOfLife.prototype._redrawTable = function() {
    for (var i = 0; i < NUMBER_OF_ROWS; i++) {
      for (var j = 0; j < NUMBER_OF_COLUMNS; j++) {
        var cell = document.getElementById(i + CELL_ID_SEPARATOR + j);
        if (this._tableData[i][j] === 1) {
          cell.setAttribute('class', 'alive');
        } else {
          cell.setAttribute('class', 'dead');
        }
      }
    }
  };

  GameOfLife.prototype._updateCell = function(i, j) {
    // Count alive neighbour cells,  moving clockwise from 12:00
    var aliveNeighbours = 0;
    if (i > 0 && this._tableData[i - 1][j] === 1) {
      aliveNeighbours++;
    }
    if (i > 0 && j < NUMBER_OF_COLUMNS - 1 && this._tableData[i - 1][j + 1] === 1) {
      aliveNeighbours++;
    }
    if (j < NUMBER_OF_COLUMNS - 1 && this._tableData[i][j + 1] === 1) {
      aliveNeighbours++;
    }
    if (i < NUMBER_OF_ROWS - 1 && j < NUMBER_OF_COLUMNS - 1 && this._tableData[i + 1][j + 1] === 1) {
      aliveNeighbours++;
    }
    if (i < NUMBER_OF_ROWS - 1 && this._tableData[i + 1][j] === 1) {
      aliveNeighbours++;
    }
    if (i < NUMBER_OF_ROWS - 1 && j > 0 && this._tableData[i + 1][j - 1] === 1) {
      aliveNeighbours++;
    }
    if (j > 0 && this._tableData[i][j - 1] === 1) {
      aliveNeighbours++;
    }
    if (i > 0 && j > 0 && this._tableData[i - 1][j - 1] === 1) {
      aliveNeighbours++;
    }

    // Determine fate of cell
    if (this._tableData[i][j] === 1) {
      if (aliveNeighbours < 2 || aliveNeighbours > 3) {
        this._nextGenTableData[i][j] = 0;
      } else {
        this._nextGenTableData[i][j] = 1;
      }
    } else {
      if (aliveNeighbours === 3) {
        this._nextGenTableData[i][j] = 1;
      } else {
        this._nextGenTableData[i][j] = 0;
      }
    }
  };

  GameOfLife.prototype._attachListeners = function() {
    var startButton = document.getElementById('startButton');
    var clearButton = document.getElementById('clearButton');
    var randomButton = document.getElementById('randomButton');
    var stopButton = document.getElementById('stopButton');

    startButton.addEventListener('click', this._handleStartButtonClick.bind(this));
    clearButton.addEventListener('click', this._handleClearButtonClick.bind(this));
    randomButton.addEventListener('click', this._handleRandomButtonClick.bind(this));
    stopButton.addEventListener('click', this._handleStopButtonClick.bind(this));
  };

  /**
  * Cell click event handler.
  */
  GameOfLife.prototype._handleCellClick = function(event) {
    var cell = event.target;
    var key = cell.id.split(CELL_ID_SEPARATOR);
    var i = key[0];
    var j = key[1];
    // Toggle state of cell
    if (this._tableData[i][j] === 0) {
      this._tableData[i][j] = 1;
      cell.setAttribute('class', 'alive');
    } else {
      this._tableData[i][j] = 0;
      cell.setAttribute('class', 'dead');
    }
  };
  /**
  * Start button click event handler.
  */
  GameOfLife.prototype._handleStartButtonClick = function() {
    if (!this._isPlaying) {
      this._updateTable();
      this._timerId = window.setInterval(this._updateTable.bind(this), GAME_SPEED_IN_MILLISECONDS);
      this._isPlaying = true;
    }
  };
  /**
  * Stop button click event handler.
  */
  GameOfLife.prototype._handleStopButtonClick = function() {
    if (this._isPlaying) {
      window.clearInterval(this._timerId);
      this._isPlaying = false;
    }
  };
  /**
  * Clear button click event handler.
  */
  GameOfLife.prototype._handleClearButtonClick = function() {
    for (var i = 0; i < NUMBER_OF_ROWS; i++) {
      for (var j = 0; j < NUMBER_OF_COLUMNS; j++) {
        this._tableData[i][j] = 0;
        var cell = document.getElementById(i + CELL_ID_SEPARATOR + j);
        cell.setAttribute('class', 'dead');
      }
    }
  };
  /**
  * Random click event handler.
  */
  GameOfLife.prototype._handleRandomButtonClick = function() {
    var aliveCount = 0;
    for (var i = 0; i < NUMBER_OF_ROWS; i++) {
      for (var j = 0; j < NUMBER_OF_COLUMNS; j++) {
        var cell = document.getElementById(i + CELL_ID_SEPARATOR + j);
        var alive = (Math.random() <= PERCENT_RANDOM_ALIVE_CELLS);
        this._tableData[i][j] = 0;
        cell.setAttribute('class', 'dead');
        if (alive) {
          this._tableData[i][j] = 1;
          cell.setAttribute('class', 'alive');
          aliveCount++;
        }
      }
    }
    //alert('Cells generated: ' + aliveCount + ' alive ' + (NUMBER_OF_ROWS * NUMBER_OF_COLUMNS - aliveCount) + ' dead');
  };

  // Call the Constructor
  window.onload = new function() {
    new GameOfLife();
  };
})();
