import { Queen } from "./queen"
export default class CSP {
  constructor (queenPositions=null, boardSize=8) {
    // console.log("CSP: ", queenPositions);

    this.queens = [];
    this.conflicts = [];
    this.maxSteps = boardSize*boardSize*boardSize;

    // console.log("CSP: CHECK BOARD QUEENS: ");
    var visitedColumns = [];
    if (queenPositions && queenPositions.length > 0) {
      queenPositions.forEach((position) => {
        this.queens.push(new Queen(position, boardSize, true));
        visitedColumns.push(position.x);
      });

      // check if any of the columns have multiple queens
      var isDuplicate = visitedColumns.some(function(item, id) {
        return visitedColumns.indexOf(item) !== id
      });
      
      if (isDuplicate) {
        throw new Error("There are conflicts in the initial board (duplicate columns)");
      }
    }

    for (let queen of this.queens) {
      var conflicts = this.getConflicts(queen);
      if (conflicts[queen.y] > 0) throw new Error("There are conflicts in the initial board (Row / Diagonal)");
    }
    
    // assign the remaining queens to columns
    // console.log("CSP: ASSIGN QUEENS TO COLUMNS: ");
    for (let i = 0; i < boardSize; i++) {
      if (!visitedColumns.includes(i)) {
        this.queens.push(new Queen({x: i, y: null,}, boardSize, false));
      }
    }
    
    // revize the domain of all assumed queens
    // console.log("CSP: REVISE DOMAIN ");
    let valueRevized = true;
    while (valueRevized) {
      valueRevized = false;
      // console.log("CSP: Queen positions: ", queenPositions);
      for(let i = 0; i < queenPositions.length; i++) {
        for(let j = 0; j < this.queens.length; j++) {
          valueRevized = this.queens[j].reviseDomain(queenPositions[i]);
          // console.log("CSP: REVISE DOMAIN WHILE LOOP : ", i, j, valueRevized);

          if (valueRevized) {
            break;
          } 
        }

        if (valueRevized) {
          break;
        }
      }
    }
  }

  solve() {
    var newQueens = [...this.queens];
    for(const queen of newQueens) {
      // Set the value of the queen
      if (!queen.static) {
        // get a random value from the domain
        let setBits = [];
        for (let i = 0; i < queen.boardSize; i++) {
          if (queen.domain & (1<<i)) {
            setBits.push(i);
          }
        }
        // get the best spot to place the queen (the one with the least conflicts)
        var minConflictIndex = null; // set the min conflict index to null
        for (let i = 0; i < setBits.length; i++) { // loop through the set bits in the domain
          let conflicts = this.getConflicts(queen, setBits[i]); // get the conflicts for the current queen
          minConflictIndex = this.minConflicts(conflicts); // get the index of the square with the least conflicts
        }
        queen.assignValue(minConflictIndex);

        // get a random value from the domain
        // let randomIndex = Math.floor(Math.random() * setBits.length);
        // queen.assignValue(setBits[randomIndex]);
      }
    }

    // sort the queens left to right for simplicity
    this.queens.sort((q1, q2) => {
      if (q1.x < q2.x) {
        return -1;
      } else if (q1.x > q2.x) {
        return 1;
      }
      return 0;
    });
    // get the time before the solve
    var startTime = new Date().getTime();
    // min conflicts algorithm
    var states = [this.getState()]; // get the initial state
    for (let i = 0; i < this.maxSteps; i++) { // loop until the max steps is reached
      if(i % 100000 === 0) console.log("CSP: ", i, this.maxSteps, (new Date().getTime() - startTime)/1000,"s");
      var {queen, conflicts, solved} = this.selectQueen(); // select a queen with conflicts O(n) + O(n^2)
      states.push(this.getState(queen, conflicts)); // get the current state of the board for the front end O(n)
      if (solved) { // if the board is solved, return the states
        console.log("CSP TIME TAKEN: ", (new Date().getTime() - startTime)/1000, "s");
        return {states: states, solved: solved};
      }
      conflicts[queen.y] = queen.boardSize + 1; // set the queen's conflicts value to the max so the queen is forced to move
      var minConflictIndex = this.minConflicts(conflicts); // get the index of the square with the least conflicts O(n)
      queen.y = minConflictIndex; // move the queen to the square with the least conflicts
    }
    console.log("CSP TIME TAKEN: ", (new Date().getTime() - startTime)/1000, "s");

    return {states: states, solved: solved};
  }

  selectQueen() {
    // if (this.isSolved()) { // if the board is solved, return null
    //   return {queen: null, conflicts: null, solved: true};
    // }
    var unvisitedQueens = [...this.queens]; // copy the queens array
    var randVal = Math.floor(Math.random() * unvisitedQueens.length); // get a random index
    var queen = unvisitedQueens[randVal]; // get a random queen
    unvisitedQueens.splice(randVal, 1); // remove the queen from the unvisited queens array
    var conflicts = this.getConflicts(queen);
    var solved = false;
    while ((queen.static || conflicts[queen.y] === 0) && unvisitedQueens.length > 0) { // continue selecting queens until a valid queen is found (not static and has conflicts)
      // console.log("CSP: WHILE QUEEN BEFORE ",queen, unvisitedQueens.length);
      randVal = Math.floor(Math.random() * unvisitedQueens.length);
      queen = unvisitedQueens[randVal];
      unvisitedQueens.splice(randVal, 1);
      conflicts = this.getConflicts(queen);
      // console.log("CSP: WHILE QUEEN AFTER ",queen, conflicts, unvisitedQueens, this.queens.length);
    }
    if(unvisitedQueens.length <= 0 && conflicts[queen.y] === 0) { // if all of the queens have been visited and there are no conflicts, the board is solved
      solved = true;
      conflicts = null;
    }
    return {queen: queen, conflicts: conflicts, solved: solved};
  }
  isSolved() { // Returns false as soon as there are any conflicts on the board
    for (let queen of this.queens) { // loop through all of the queens on the board
      for (let queen2 of this.queens) { // loops through all of the queens on the board again to check for conflicts
        if (queen2.y === null || queen.y === null) { // if a queen value isn't set, return false (board is not solved)
          return false;
        }
        if (queen2.x !== queen.x && queen2.y === queen.y) { // If the queens are in the same row, return false (board is not solved)
          return false;
        } 
        if (queen2.x !== queen.x && Math.abs(queen.x - queen2.x) === Math.abs(queen.y - queen2.y)) // if the queens are in the same diagonal, return false (board is not solved)
          return false;
      }
    }
    return true;
  }
  getState(masterQueen=null, conflicts=null) {
    // get the state of the board
    if (conflicts) var conf = [...conflicts];
    // console.log("not a curse :)", masterQueen, conflicts);
    var state = [];
    for(const queen of this.queens) {
      // console.log("CSP: QUEEN IN STATE: ", queen.y);
      if (masterQueen && queen === masterQueen && conf) {
        conf[queen.y] = null;
        state.push(conf);
      } else {
        state.push(queen.y);
      }
    }
    return state
  }

  minConflicts(conflicts) {
    var minConflict = conflicts[0];
    var minIndex = 0;
    for (let i = 0; i < conflicts.length; i++) {
      if (conflicts[i] <= minConflict) {
        // console.log('SAMSON SETTING MIN TO ', minIndex, minConflict);
        if(conflicts[i] == minConflict){ // if the conflicts are equal, randomly choose one of the two to prevent the algorithm from getting stuck in a local minimum
          if(Math.random() > 0.5) continue;
        }
        minConflict = conflicts[i];
        minIndex = i;
      }
    }
    return minIndex;
  }

  getConflicts(queen) {
    var conflicts = [];
    for (let i = 0; i < queen.boardSize; i++) { // loop through all of the squares in the queens column
      var diagonals = {ul: false, ur: false, dl: false, dr: false}; // keeps track of which diagonals have been checked
      var rows = {left: false, right: false}; // keeps track of which rows have been checked
      var conflict = 0; // keeps track of the number of conflicts

      for (let q = 0; q < this.queens.length; q++) { // loops through all of the queens on the board
        if (this.queens[q].y === null) { // if it's value isn't set or it's the same queen, continue
          continue;
        }
        if (this.queens[q].x !== queen.x && this.queens[q].y === i) { // Current square and queen are in the same row
          if (!rows.left && this.queens[q].x < queen.x) { // Check left of the queen
            conflict++;
            rows.left = true;
          } else if (!rows.right && this.queens[q].x > queen.x) { // Check right of the queen
            conflict++;
            rows.right = true;
          }
        } 
        else if(this.queens[q].x !== queen.x && this.queens[q].y !== i) { // Current square and queen are not in the same row
          if (!diagonals.ul && queen.x - this.queens[q].x === i - this.queens[q].y) // Check up and left diagonal
          {
            conflict++;
            diagonals.ul = true;
          } else if (!diagonals.ur && this.queens[q].x - queen.x === i - this.queens[q].y) // Check up and right diagonal
          {
            conflict++;
            diagonals.ur = true;
          } else if (!diagonals.dl && queen.x - this.queens[q].x === this.queens[q].y - i) // Check down and left diagonal
          {
            conflict++;
            diagonals.dl = true;
          } else if (!diagonals.dr && this.queens[q].x - queen.x === this.queens[q].y - i) // Check down and right diagonal
          {
            conflict++;
            diagonals.dr = true;
          }
        }
      }
      conflicts.push(conflict);
    }
    // console.log("SAM: CONFLICTS: ", conflicts)
    return conflicts;
  }

  
}

// make a function that returns an array of all of the conflicting queens minus those that have a domain of 1 value
// this is the function that is going to have a random queen selected from