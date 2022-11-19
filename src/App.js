// import logo from './logo.svg';
import './App.css';
import Board from './components/Board';

const BOARD_SIZE = 8;

function App() { // This returns HTML code
        const findQueens = () => {
          // Find all the queens
          const collection = document.getElementsByClassName("hasQueen");
          for (let i = 0; i < collection.length; i++) {
            console.log("FOUND QUEEN AT: ", collection[i].id);
            collection[i].firstChild.style.opacity = "0.8";
          }
        }
        const resetBoard = () => {
          // refresh the board
          const collection = document.getElementsByClassName("hasQueen");
          for (let i = 0; i < collection.length; i++) {
            console.log("REMOVING QUEEN: ", collection[i].id);
            collection[i].click();
          }
        }
        const randPositions = (event) => {
          // randomize the positions of the queens
          const queens = document.getElementsByClassName("input")[0].value;
          console.log(queens);
          if(queens !== "" && queens <= (BOARD_SIZE * BOARD_SIZE)) {
            resetBoard();
            const squares = document.getElementsByClassName("square");
            const numSet = new Set();
            while(numSet.size < queens) {
              numSet.add(Math.floor(Math.random() * (BOARD_SIZE * BOARD_SIZE)));
            }
            const nums = Array.from(numSet);
            // console.log(nums.length);
            for (let i = 0; i < nums.length; i++) {
                console.log("RANDS: ", nums[i]);
                squares[nums[i]].click();
            }
          }
        }
      /*
      VISUALIZATION OF BOARD COORDS
        A8 B8 C8 D8 E8 F8 G8 H8
        A7 B7 C7 D7 E7 F7 G7 H7
        A6 B6 C6 D6 E6 F6 G6 H6
        A5 B5 C5 D5 E5 F5 G5 H5
        A4 B4 C4 D4 E4 F4 G4 H4
        A3 B3 C3 D3 E3 F3 G3 H3
        A2 B2 C2 D2 E2 F2 G2 H2
        A1 B1 C1 D1 E1 F1 G1 H1
      */
            
  return (
    <div className="App">
      <header className="App-header">
        <button className="button" onClick={resetBoard}>Reset Board</button>
        <button className="button" onClick={findQueens}>Solve!</button>
        <input className='input' type="number" placeholder="# of Queens" title="Enter number of queens to randomize." required/>
        <button className="button" onClick={randPositions}>Randomize</button>
      </header>
      <Board />
    </div>
  );
}

export default App; // Exports the App function which returns HTML code
