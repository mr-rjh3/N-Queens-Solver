// import logo from './logo.svg';
import './App.css';
import Board from './components/Board';
import { useState } from 'react';


function App() { // This returns HTML code
        const [boardSize, setBoardSize] = useState(8); // This is a hook that allows us to use state in a functional component
        const [buttonsEnabled, setButtonsEnabled] = useState(true);

        const disableArrows = (event) => {
          setButtonsEnabled(false);
        }
        const enableArrows = (event) => {
            setButtonsEnabled(true);
        }
        
        const findQueens = () => {
          // Find all the queens
          const collection = document.getElementsByClassName("hasQueen");
          // TODO: if there are no queens on the boards however the input queens has a value greater than 0 then allow the program to find the best possible places for the queens
          // TODO: if the user attempts to solve with the number of queens less than the board size, have the CSP place the rest of the queens

          if(collection.length === 0) {
            console.log("NO QUEENS FOUND: ", collection.length);
          }
          else{
            // Find all the queens and their positions  
            for (let i = 0; i < collection.length; i++) {
              console.log("FOUND QUEEN AT: ", collection[i].id);
              collection[i].firstChild.style.opacity = "0.6";
            }
            enableArrows();
          }
          // TODO: Run the backend code that solves the n-queens problem here

        }
        
        const clearBoard = () => {
          // Clear the board
          const collection = document.getElementsByClassName("hasQueen");
          disableArrows();
          // console.log("REMOVING QUEENS: ", collection);
          // Go through each queen and remove it by clicking it
          for (let i = 0; i < collection.length; i++) {
            collection[i].click();
          }
        }

        const inputEnter = (event) => {
          if(event.key === "Enter") {
            console.log("ENTER PRESSED");
            randPositions();
          }
        }

        const randPositions = (event) => {
          // randomize the positions of the queens
          const queens = document.getElementsByClassName("input")[0].value;
          const queenSquares = document.getElementsByClassName("hasQueen").length;

          console.log("RANDBOARD: ", boardSize);
          // check if there is an input or if there are queens on the board currently, if there is an input we must make sure the input is not greater than the size of the board
          if((queens > 0 || queenSquares > 0) && queens <= boardSize * boardSize) {
            clearBoard();
            const squares = document.getElementsByClassName("square");
            const numSet = new Set();
            // if there are queens on the board and the user didn't enter a number randomize those queens
            if(queenSquares > 0 && queens === "") { 
              console.log("NO INPUT RANDOMIZING BOARD");

              while(numSet.size < queenSquares) {
                numSet.add(Math.floor(Math.random() * (boardSize * boardSize)));
              }
            }
            // otherwise randomize the number of queens the user entered
            else if(queens > 0) { 
              console.log("INPUT RANDOMIZING ", queens, " QUEENS");
              while(numSet.size < queens) {
                numSet.add(Math.floor(Math.random() * (boardSize * boardSize)));
              }
            }
            const nums = Array.from(numSet);
            // console.log(nums.length);
            console.log("RANDS: ", nums);
            for (let i = 0; i < nums.length; i++) {
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
      <header className="buttonContainer">
        <button className="button" onClick={clearBoard}>Clear Board</button>
        <button className="button" onClick={findQueens}>Solve!</button>
        <input className='input' type="number" placeholder="# of Queens" title="Enter number of queens to randomize." onKeyUp={inputEnter}/>
        <button className="button" onClick={randPositions}>Randomize</button>
        {/* <input className='input' type="number" placeholder="Board Size" title="Enter board size." onKeyDown={changeBoardSize}/> */}
      </header>
      <Board size={boardSize} setSize={setBoardSize} enabled={buttonsEnabled} setEnabled={setButtonsEnabled}/>
    </div>
  );
}

export default App; // Exports the App function which returns HTML code