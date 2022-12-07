import { Queen } from "./queen"
export class CSP {
  constructor (queenPositions=null, boardSize=10) {
    this.queens = [];
    this.conflicts = [];

    if (queenPositions && queenPositions.length > 0) {
      var visitedColumns = [];
      queenPositions.forEach((position) => {
        this.queens.push(new Queen(position, boardSize, true));
        this.visitedColumns.push(position.x);
      });

      // check if any of the columns have multiple queens
      var isDuplicate = visitedColumns.some(function(item, id) {
        return visitedColumns.indexOf(item) != id
      });
      
      if (isDuplicate) {
        throw new Error("Duplicate columns");
      }
    }

    // check if board is filled
    if (queenPositions.length == boardSize) {
      // check if the board is solved
      this.solved = this.checkSolved();
      if (this.solved) {
        return;
      }
    }
    
    // assign the remaining queens to columns
    for (let i = 0; i < boardSize; i++) {
      if (!visitedColumns.includes(i)) {
        this.queens.push(new Queen({x: i, y: null,}, boardSize, false));
      }
    }
    
    // revize the domain of all assumed queens
    let valueRevized = false;
    while (!valueRevized) {
      valueRevized = false;
      queenPositions.every((position) => {
        this.queens.every((queen) => {
          valueRevized = queen.reviseDomain(position);
          if (valueRevized) {
            return false;
          } else {
            return true;
          }
        });

        if (valueRevized) {
          return false;
        } else {
          return true;
        }
      });
    }
  }

  solve() {
    // assign all non-static queens to a value
    this.queens.forEach((queen) => {
      if (!queen.static) {
        // get a random value from the domain
        let setBits = [];
        for (let i = 0; i < this.boardSize; i++) {
          if (queen.domain & (1<<i)) {
            setBits.push(i);
          }
        }

        let randomValue = setBits[Math.floor(Math.random() * setBits.length)];
        queen.y = randomValue;
      }
    });

    // min conflicts algorithm
    const MAX_STEPS = 500;
    let states = [this.getState()];
    for (let i = 0; i < MAX_STEPS; i++) {
      let {queen, conflicts, solved} = this.selectQueen();
      if (solved) {
        return;
      }

      let minConflictIndex = this.minConflicts(conflicts);

      queen.y = minConflictIndex; // COULD EXPLODE
      states.push(this.getState(minConflictIndex, conflicts));
      console.log(states);
    }

    return states; // TODO CHECK IF RAN OUT OF STEPS
  }

  selectQueen() {
    // select a conflicting queen randomly
    let queen = this.queens[Math.floor(Math.random() * this.queens.length)];
    let conflicts = this.getConflicts(queen);
    let visitedQueens = [];
    let solved = false;
    while (queen.static || conflicts.length == 0 || visitedQueens.includes(queen.x)) {
      queen = this.queens[Math.floor(Math.random() * this.queens.length)];
      conflicts = this.getConflicts(queen);
      visitedQueens.push(queen.x);

      if (visitedQueens.length == this.queens.length) {
        solved = true;
        break;
      }
    }
    return {queen: queen, conflicts: conflicts, solved: solved};
  }

  minConflicts(conflicts) {
    let minConflict = conflicts[0];
    let minIndex = 0;
    for (let i = 0; i < conflicts.length; i++) {
      if (conflicts[i].length < minConflict.length) {
        minConflict = conflicts[i];
        minIndex = i;
      }
    }
    return minIndex;
  }

  getConflicts(queen) {
    let conflicts = [];
    for (let j = 0; j < this.boardSize; j++) { // loops through one column
      let conflict = 0;

      // loops through all of the queens
      for (let q = 0; q < this.queens.length; q++) {
        if (!this.queens[q].y) { // if value isn't set
          continue;
        }

        if (q.y == j) { // in same row
          conflict++;
        } else if (queen.x != this.queens[q].x && j != this.queens[q].y) { // if not in same row or column
          if (Math.abs(queen.x - this.queens[q].x) == Math.abs(j - this.queens[q].y)) { // if in same diagonal
            conflict++;
          }
        }
      }

      conflicts.push(conflict);
    }
    return conflicts;
  }

  getState(conflictIndex=null, conflicts=null) {
    // get the state of the board
    this.queens.sort((q1, q2) => {
      if (q1.x < q2.x) {
        return -1;
      } else if (q1.x > q2.x) {
        return 1;
      }
      return 0;
    });

    let state = [];
    this.queens.forEach((queen) => {
      if (conflictIndex && queen.x == conflictIndex) {
        conflicts[queen.y] = null;
        state.push(conflicts);
      } else {
        state.push(queen.y);
      }
    });

    return state
  }

  /**
   * Function that checks if the current state of the board is a solution.
   */
  checkSolved() {
    var solved = true;
    this.queens.forEach((queen) => {
      if (length(this.conflicts) > 0) {
        solved = false;
      }
    });
    return solved;
  }
  
  /**
   * Function that updates this.conflicts with the conflicting queens of the current state of the board.
   */
  updateConflicts() {
    
  }
  
  minConflicts() {
    
  }
}

// make a function that returns an array of all of the conflicting queens minus those that have a domain of 1 value
// this is the function that is going to have a random queen selected from