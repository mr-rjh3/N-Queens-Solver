import { Queen } from "./queen"
export default class CSP {
  constructor (queenPositions=null, boardSize=10) {
    console.log("CSP: ", queenPositions);

    this.queens = [];
    this.conflicts = [];
    this.maxSteps = boardSize*boardSize*boardSize;

    console.log("CSP: CHECK BOARD QUEENS: ");
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
        throw new Error("Duplicate columns");
      }
    }

    for (let queen of this.queens) {
      var conflicts = this.getConflicts(queen);
      if (conflicts[queen.y] > 0) throw new Error("There are conflicts in the initial board");
    }
    
    // assign the remaining queens to columns
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

    // sort the queens left to right for simplicity
    this.queens.sort((q1, q2) => {
      if (q1.x < q2.x) {
        return -1;
      } else if (q1.x > q2.x) {
        return 1;
      }
      return 0;
    });
    
    // min conflicts algorithm
    var states = [this.getState()];
    for (let i = 0; i < this.maxSteps; i++) {
      console.log("CSP: SOLVING: ", i, " of ", this.maxSteps, " steps");   
  
      var {queen, conflicts, solved} = this.selectQueen();
      states.push(this.getState(queen, conflicts));
      if (solved) {
        // states.push(this.getState(queen));
        return {states: states, solved: solved};
      }
      console.log("SAMSON REPLACE: SELECTED QUEEN FROM ", queen, conflicts);
      conflicts[queen.y] = queen.boardSize + 1;
      var minConflictIndex = this.minConflicts(conflicts);
      console.log("SAMSON REPLACE: SELECTED QUEEN TO ", minConflictIndex);

      queen.y = minConflictIndex; // COULD EXPLODE
      console.log(states);
    }

    return {states: states, solved: this.isSolved()}; // TODO CHECK IF RAN OUT OF STEPS
  }

  selectQueen() {
    // select a conflicting queen randomly
    
    var unvisitedQueens = [...this.queens];
    console.log("CSP: SELECTING QUEEN ", unvisitedQueens.length, this.queens.length);
    var randVal = Math.floor(Math.random() * unvisitedQueens.length);
    var queen = unvisitedQueens[randVal];
    unvisitedQueens.splice(randVal, 1);

    var conflicts = this.getConflicts(queen);
    var solved = false;
    console.log('currentqueensconflics:',conflicts[queen.y])
    while (queen.static || conflicts[queen.y] === 0) {
      randVal = Math.floor(Math.random() * unvisitedQueens.length);
      queen = unvisitedQueens[randVal];
      unvisitedQueens.splice(randVal, 1);
      conflicts = this.getConflicts(queen);
      // console.log("CSP: WHILE QUEEN AFTER ",queen, conflicts, unvisitedQueens, this.queens.length);

      if (this.isSolved()) {
        solved = true;
        conflicts = null;
        break;
      }
    }
    return {queen: queen, conflicts: conflicts, solved: solved};
  }

  isSolved() {
    var totalConflicts = 0;
    for (let i = 0; i < this.queens.length; i++) {
      totalConflicts += this.getConflicts(this.queens[i])[this.queens[i].y];
    }
    return totalConflicts === 0;
  }

  minConflicts(conflicts) {
    var minConflict = conflicts[0];
    var minIndex = 0;
    for (let i = 0; i < conflicts.length; i++) {
      if (conflicts[i] < minConflict) {
        console.log('SAMSON SETTING MIN TO ', minIndex, minConflict);
        minConflict = conflicts[i];
        minIndex = i;
      }
    }
    return minIndex;
  }

  getConflicts(queen) {
    var conflicts = [];
    for (let j = 0; j < queen.boardSize; j++) { // loops through one column
      var diagonals = {ul: false, ur: false, dl: false, dr: false};
      var rows = {left: false, right: false};
      var conflict = 0;

      // loops through all of the queens
      for (let q = 0; q < this.queens.length; q++) {
        if (this.queens[q].y === null) { // if value isn't set
          continue;
        }

        if (this.queens[q].y == j) { // in same row
          if (this.queens[q].x !== queen.x) { // if not the same queen
            if (this.queens[q].x < queen.x) {
              if (!rows.left) {
                conflict++;
                rows.left = true;
              }
            } else if (this.queens[q].x > queen.x) {
              if (!rows.right) {
                conflict++;
                rows.right = true;
              }
            }
          }
        } 
        
        if (queen.x !== this.queens[q].x && j !== this.queens[q].y) { // if not in same row or column
          if (!diagonals.ul && queen.x - this.queens[q].x === j - this.queens[q].y) // up and left
          {
            conflict++;
            diagonals.ul = true;
          } else if (!diagonals.ur && this.queens[q].x - queen.x === j - this.queens[q].y) // up and right
          {
            conflict++;
            diagonals.ur = true;
          } else if (!diagonals.dl && queen.x - this.queens[q].x === this.queens[q].y - j) // down and left
          {
            conflict++;
            diagonals.dl = true;
          } else if (!diagonals.dr && this.queens[q].x - queen.x === this.queens[q].y - j) // down and right
          {
            conflict++;
            diagonals.dr = true;
          }
        }
      }
      conflicts.push(conflict);
    }
    console.log("SAM: CONFLICTS: ", conflicts)
    return conflicts;
  }

  getState(masterQueen=null, conflicts=null) {
    // get the state of the board
    if (conflicts) var conf = [...conflicts];
    console.log("fuck", masterQueen, conflicts);
    var state = [];
    for(const queen of this.queens) {
      console.log("CSP: QUEEN IN STATE: ", queen.y);
      if (masterQueen && queen === masterQueen && conf) {
        conf[queen.y] = null;
        state.push(conf);
      } else {
        state.push(queen.y);
      }
    }

    return state
  }
}

// make a function that returns an array of all of the conflicting queens minus those that have a domain of 1 value
// this is the function that is going to have a random queen selected from