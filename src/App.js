// import logo from './logo.svg';
import './App.css';
import Board from './components/Board';
import { useState, useEffect} from 'react';
import React from 'react';
import CSP from './backend/csp.js';

const ThemeContext = React.createContext('light');

function App() { // This returns HTML code
        const [boardSize, setBoardSize] = useState(8); // This is a hook that allows us to use state in a functional component
        const [buttonsEnabled, setButtonsEnabled] = useState(true);
        const [states, setStates] = useState([]);
        const [currState, setCurrState] = useState(0);

        useEffect(() => {
          if(states.length <= 0) {
            console.log("NO STATES FOUND");
          }
          else {
            console.log("STATES: ", states);
          }
        }, [states]);


        
        // array of the states of the squares for when we solve it
        // array of states [
        //   state 1 
        //     [
        //       3,                        // queen is at position 3 in col 1
        //       [10, 11, 13, 5, 3, 1, 0], // no queen, array min conflicts of column 2 
        //       4,                        // queen is at position 4 in col 3
        //       [10, 11, 13, 5, 3, 1, 0], // no queen, array of min conflicts of column 4
        //       ...
        //     ]
        //   ,
        //   state 2 [...],
        //   ...
        // ]

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

          const queenPositions = [];
          if(collection.length === 0) {
            console.log("NO QUEENS FOUND: ", collection.length);
          }
          else{
            // Find all the queens and their positions  
            for (let i = 0; i < collection.length; i++) {
              let x = collection[i].id % boardSize;
              let y = Math.floor(collection[i].id / boardSize);
              console.log("FOUND QUEEN AT: ", x, y);
              queenPositions.push({x: x, y: y});
              collection[i].firstChild.style.opacity = "0.6";
            }
            enableArrows();
          }
          // TODO: Run the backend code that solves the n-queens problem here
          // setStates(getStates(queenPositions));
          // console.log("STATES: ", states);
          console.log("APP: Queen positions: ", queenPositions);

          const csp = new CSP(queenPositions, boardSize);
          console.log("APP: BEFORE MIN CONFLICTS: ");

          setStates(csp.solve());

          // populate the states array with random values based on the board size
          // let tempStates = [];
          // for (let i = 0; i < 10; i++) { // amount of states
          //   let tempState = [];
          //   for (let j = 0; j < boardSize; j++) {
          //     // randomly choose to do an array of length boardSize or just a number
          //     if(Math.random() > 0.9) {
          //       let tempArray = [];
          //       for (let k = 0; k < boardSize; k++) {
          //         tempArray.push(Math.floor(Math.random() * boardSize));
          //       }
          //       tempState.push(tempArray);
          //     }
          //     else{
          //       if(Math.random() > 0.5)
          //         tempState.push(Math.floor(Math.random() * boardSize));
          //     }
          //   }
          //   tempStates.push(tempState);
          // }

          // setStates([[null, null, null, null, null, null, null, null]
          //            ,[0, [10,3,0,null,0,0,4,10], null, null, 7, null, null, 1]
          //           ,[null, 1, null, 3, null, 1, null, null]
          //           ,[null, null, 2, null, null, [10,3,0,17,0,0,4,10], null, 3]
          //           ,[null, null, null, 3, null, null, null, null]  
          //           ,[null, [10,3,0,17,0,0,4,10], null, null, 4, null, 4, null]  
          //           ,[null, null, null, null, null, 5, null, null]  
          //           ,[[10,3,0,17,0,0,4,10], null, null, null, null, null, 6, null]  
          //           ,[null, null, null, null, null, 5, null, 7]  
          //           ]);
          // setStates(tempStates);

         
        }
        
        const clearBoard = () => {
          // Clear the board of queens and any text 
          const queens = document.getElementsByClassName("hasQueen");
          console.log("QUEENS: ", queens);
          while (queens.length > 0) {
            console.log("CLEARING QUEEN: ", queens[0]);
            queens[0].firstChild.style.opacity = "0";
            queens[0].classList.remove("hasQueen");
          }
          const text = document.getElementsByClassName("conflict");
          for (let i = 0; i < text.length; i++) {
            text[i].innerText = "";
          }
          setStates([]);
          setCurrState(0);
        }
        const clearStates = () => {
          // Clear the states array
          // Clear the board of queens and any text 
          const queens = document.getElementsByClassName("hasQueen");
          console.log("QUEENS: ", queens);
          for(let i = 0; i < queens.length; i++) {
            console.log("CLEARING QUEEN: ", queens[0]);
            queens[i].firstChild.style.opacity = "0";
          }
          const text = document.getElementsByClassName("conflict");
          for (let i = 0; i < text.length; i++) {
            text[i].innerText = "";
          }
          setStates([]);
          setCurrState(0);
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
        <button className="button" disabled={states.length>0} onClick={findQueens}>Solve!</button>
        <input className='input' type="number" placeholder="# of Queens" title="Enter number of queens to randomize." onKeyUp={inputEnter}/>
        <button className="button" onClick={randPositions}>Randomize</button>
        {/* <input className='input' type="number" placeholder="Board Size" title="Enter board size." onKeyDown={changeBoardSize}/> */}
      </header>
      <Board states={states} setStates={setStates} currState={currState} setCurrState={setCurrState} size={boardSize} setSize={setBoardSize} enabled={buttonsEnabled} setEnabled={setButtonsEnabled} clearStates={clearStates} clearBoard={clearBoard}/>
    </div>
  );
}

export default App; // Exports the App function which returns HTML code
