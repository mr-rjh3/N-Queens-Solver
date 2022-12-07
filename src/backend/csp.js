import { Queen } from "./queen"
export default class CSP {
  constructor (queenPositions=null, boardSize=10) {
    console.log("CSP: ", queenPositions);

    this.queens = [];
    this.conflicts = [];

    console.log("CSP: CHECK BOARD QUEENS: ");
    if (queenPositions && queenPositions.length > 0) {
      var visitedColumns = [];
      queenPositions.forEach((position) => {
        this.queens.push(new Queen(position, boardSize, true));
        visitedColumns.push(position.x);
      });

      // check if any of the columns have multiple queens
      var isDuplicate = visitedColumns.some(function(item, id) {
        return visitedColumns.indexOf(item) !== id
      });
      
      if (isDuplicate) {
        throw new Error("Duplicate columns");
      }
    }

    // check if board is filled
    console.log("CSP: CHECK BOARD FILLED: ");
    if (queenPositions.length === boardSize) {
      // check if the board is solved
      this.solved = this.checkSolved();
      if (this.solved) {
        return;
      }
    }
    
    // assign the remaining queens to columns
    //TODO breaks with no queens
    console.log("CSP: ASSIGN QUEENS TO COLUMNS: ");
    for (let i = 0; i < boardSize; i++) {
      if (!visitedColumns.includes(i)) {
        this.queens.push(new Queen({x: i, y: null,}, boardSize, false));
      }
    }
    
    // revize the domain of all assumed queens
    // TODO breaks with queens
    console.log("CSP: REVISE DOMAIN ");
    let valueRevized = true;
    while (valueRevized) {
      valueRevized = false;
      // console.log("CSP: Queen positions: ", queenPositions);
      for(let i = 0; i < queenPositions.length; i++) {
        for(let j = 0; j < this.queens.length; j++) {
          valueRevized = this.queens[j].reviseDomain(queenPositions[i]);
          console.log("CSP: REVISE DOMAIN WHILE LOOP : ", i, j, valueRevized);

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

  // Assigns a random value to each non-static queen
  // assignRandomValue(queen) {
  //   console.log("CSP: ASSIGN RANDOM VALUE: ", queen);
  //   let domain = queen.domain;
  //   let randomIndex = Math.floor(Math.random() * domain.length);
  //   queen.assignValue(1);
  // }


  solve() {
    var newQueens = [...this.queens];
    console.log("CSP: ASSIGNING QUEENS: ");
    for(const queen of newQueens) {
      // randomize the value of the queen
      console.log("CSP: QUEENS BEFORE FOR: ",queen);
      if (!queen.static) {
        // get a random value from the domain
        let setBits = [];
        for (let i = 0; i < queen.boardSize; i++) {
          if (queen.domain & (1<<i)) {
            setBits.push(i);
          }
        }

        // get a random value from the domain
        let randomIndex = Math.floor(Math.random() * setBits.length);
        console.log("CSP: QUEENS RANDOM INDEX: ", randomIndex, setBits.length);

        queen.assignValue(setBits[randomIndex]);
      }
    }


    for(const queen of newQueens) {
      console.log("CSP: QUEENS ASSIGNED AFTER FOR: ",queen);
    }
    
    // min conflicts algorithm
    const MAX_STEPS = 10;
    let states = [this.getState()];
    for (let i = 0; i < MAX_STEPS; i++) {
      console.log("CSP: SOLVING: ", i, " of ", MAX_STEPS, " steps");   
  
      let {queen, conflicts, solved} = this.selectQueen();
      if (solved) {
        return;
      }
      console.log("CSPP: SELECTED QUEEN ", queen, conflicts);
      let minConflictIndex = this.minConflicts(conflicts);

      queen.y = minConflictIndex; // COULD EXPLODE
      states.push(this.getState(minConflictIndex, conflicts));
      console.log(states);
    }

    return states; // TODO CHECK IF RAN OUT OF STEPS
  }

  selectQueen() {
    // select a conflicting queen randomly
    
    let unvisitedQueens = [...this.queens];
    console.log("CSP: SELECTING QUEEN ", unvisitedQueens.length, this.queens.length);
    let randVal = Math.floor(Math.random() * unvisitedQueens.length);
    let queen = unvisitedQueens[randVal];
    unvisitedQueens.splice(randVal, 1);

    let conflicts = this.getConflicts(queen);
    let solved = false;
    while (queen.static || conflicts.length === 0) {
      randVal = Math.floor(Math.random() * unvisitedQueens.length);
      queen = unvisitedQueens[randVal];
      unvisitedQueens.splice(randVal, 1);
      conflicts = this.getConflicts(queen);
      // console.log("CSP: WHILE QUEEN AFTER ",queen, conflicts, unvisitedQueens, this.queens.length);

      if (unvisitedQueens.length === 0) {
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
    console.log("CSP: GETTING CONFLICTS: ", queen);
    let conflicts = [];
    for (let j = 0; j < queen.boardSize; j++) { // loops through one column
      let conflict = 0;

      // loops through all of the queens
      for (let q = 0; q < this.queens.length; q++) {
        if (!this.queens[q].y) { // if value isn't set
          continue;
        }

        if (q.y === j) { // in same row
          conflict++;
        } else if (queen.x !== this.queens[q].x && j !== this.queens[q].y) { // if not in same row or column
          if (Math.abs(queen.x - this.queens[q].x) === Math.abs(j - this.queens[q].y)) { // if in same diagonal
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
    for(const queen of this.queens) {
      console.log("CSP: QUEEN IN STATE: ", queen.y);
      if (conflictIndex && queen.x === conflictIndex) {
        conflicts[queen.y] = null;
        state.push(conflicts);
      } else {
        state.push(queen.y);
      }
    }

    return state
  }

  /**
   * Function that checks if the current state of the board is a solution.
   */
  checkSolved() {
    var solved = true;
    this.queens.forEach((queen) => {
      if (this.conflicts.length > 0) {
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