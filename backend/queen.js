/**
 * Class that represents a queen on the board.
 * 
 * @property {int} domain The domain of the queen in format 0b111111111 
 *  where 1 means that the square is in the domain and 0 means that it is not.
 * @property {int} column The column of the queen.
 */

export class Queen {
  /**
   * Constructor for the queen class.
   * 
   * @param {Object of x,y} position col and row position of the queen, null if not placed.
   */
  constructor (position=null, boardSize, static){
    this.x = position.x;
    this.y = position.y;
    this.boardSize = boardSize;
    this.static = static;

    if (this.y) {
      this.domain = 1<<this.y;
    } else {
      this.domain = (1<<boardSize) - 1;
    }

  }

  reviseDomain(position) {
    if (this.static) {
      return false;
    }

    // queen in the same row
    this.clearBit(position.y); // remove the row from the domain

    // queen in the same diagonal
    const xDiff = Math.abs(this.x - position.x);
    if (position.y - xDiff >= 0) {
      this.clearBit(position.y - xDiff);
    } else if (this.y + xDiff < this.boardSize) {
      this.clearBit(position.y + xDiff);
    }

    // check if the domain is empty
    if (this.domain == 0) {
      throw new Error("Domain is empty");
    } else if (this.domain & this.domain-1 == 0) {
      this.y = Math.log2(this.domain);
      return true;
    }

    return false;
  }

  setBit(bit) {
    this.domain |= (1<<bit);
  }

  clearBit(bit) {
    this.domain &= ~(1<<bit);
  }
}