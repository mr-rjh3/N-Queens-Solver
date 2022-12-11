// import logo from './logo.svg';
import './App.css';
import Board from './components/Board';
import { useState, useEffect} from 'react';
import React from 'react';
import CSP from './backend/csp.js';

function App() { // This returns HTML code
        const [boardSize, setBoardSize] = useState(8); // This is a hook that allows us to use state in a functional component
        const [buttonsEnabled, setButtonsEnabled] = useState(true);
        const [states, setStates] = useState([]);
        const [currState, setCurrState] = useState(0);
        useEffect(() => {
          if(states.length <= 0) {
            // console.log("NO STATES FOUND");
          }
          else {
            const squares = document.getElementsByClassName("square");
            for(let i = 0; i < states[0].length; i++) {
              if(states[0][i] != null) {
                  if(typeof states[0][i] == "number") { // if the element is a number, then draw the queen on the square in ith column
                      // console.log("NUMBER: ", states[0][i]);
                      // TODO: Squares useState "hasQueen" is not updated
                      squares[states[0][i] * boardSize + i].classList.add("hasQueen");
                  }
                  else{ // if the element is an array, draw all the confilct numbers on the squares in the ith column
                      // console.log("ARRAY: ", states[0][i]);
                      for(let j = 0; j < states[0][i].length; j++) {
                          if(states[0][i][j] != null){
                              // console.log(i+(boardSize*j));
                              squares[i+(boardSize*j)].querySelector('.conflict').innerText = states[0][i][j];
                          }
                          else{
                              squares[i+(boardSize*j)].classList.add("hasQueen");
  
                          }
                      }
                  }
              }
          }
          }
        }, [states]);
        
        const solve = () => {
          // Find all the queens
          const collection = document.getElementsByClassName("hasQueen");
          // TODO: if there are no queens on the boards however the input queens has a value greater than 0 then allow the program to find the best possible places for the queens
          // TODO: if the user attempts to solve with the number of queens less than the board size, have the CSP place the rest of the queens

          const queenPositions = [];
          if(collection.length === 0) {
            // console.log("NO QUEENS FOUND: ", collection.length);
          }
          else{
            // Find all the queens and their positions  
            for (let i = 0; i < collection.length; i++) {
              let x = collection[i].id % boardSize;
              let y = Math.floor(collection[i].id / boardSize);
              // console.log("FOUND QUEEN AT: ", x, y);
              queenPositions.push({x: x, y: y});
              collection[i].firstChild.style.opacity = "0.6";
            }
          }

          try {
            console.log("APP: CREATING CSP ", boardSize);
            const csp = new CSP(queenPositions, boardSize);
            console.log("APP: SOLVING ", boardSize);
            var {states, solved} = csp.solve();
            if (!solved) alert("Maximum Steps Reached, No Solution Found");
            console.log("APP: STATES: ", states.length, states);
            // alert("Solved!!!");
            setStates(states);
          } catch (error) {
            console.log(error);
            alert(error);
          }
        }
        
        const clearBoard = () => {
          // Clear the board of queens and any text 
          const queens = document.getElementsByClassName("hasQueen");
          // console.log("QUEENS: ", queens);
          while (queens.length > 0) {
            // console.log("CLEARING QUEEN: ", queens[0]);
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
          const queens = document.getElementsByClassName("hasQueen");
          for(let i = 0; i < queens.length; i++) { // Make the red highlight disappear
            queens[i].firstChild.style.opacity = "0";
          }
          const text = document.getElementsByClassName("conflict");
          for (let i = 0; i < text.length; i++) { // Clear the text
            text[i].innerText = "";
          }
          setStates([]);
          setCurrState(0);
        }

        const inputEnter = (event) => {
          if(event.key === "Enter") {
            // console.log("ENTER PRESSED");
            randPositions();
          }
        }

        const randPositions = (event) => {
          // randomize the positions of the queens
          const queens = document.getElementsByClassName("input")[0].value;
          const queenSquares = document.getElementsByClassName("hasQueen").length;

          // console.log("RANDBOARD: ", boardSize);
          // check if there is an input or if there are queens on the board currently, if there is an input we must make sure the input is not greater than the size of the board
          if((queens > 0 || queenSquares > 0) && queens <= boardSize * boardSize) {
            clearBoard();
            const squares = document.getElementsByClassName("square");
            const numSet = new Set();
            // if there are queens on the board and the user didn't enter a number randomize those queens
            if(queenSquares > 0 && queens === "") { 
              // console.log("NO INPUT RANDOMIZING BOARD");
              while(numSet.size < queenSquares) {
                // make sure the random number is not conflicting with the queens already on the board
                numSet.add(Math.floor(Math.random() * (boardSize * boardSize)));
              }
            }
            // otherwise randomize the number of queens the user entered
            else if(queens > 0) { 
              // console.log("INPUT RANDOMIZING ", queens, " QUEENS");
              while(numSet.size < queens) {
                numSet.add(Math.floor(Math.random() * (boardSize * boardSize)));
              }
            }
            const nums = Array.from(numSet);
            // console.log(nums.length);
            // console.log("RANDS: ", nums);
            for (let i = 0; i < nums.length; i++) {
                squares[nums[i]].classList.add("hasQueen");
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
        <button className="button" disabled={states.length>0} onClick={solve}>Solve!</button>
        <input className='input' type="number" placeholder="# of Queens" title="Enter number of queens to randomize." onKeyUp={inputEnter}/>
        <button className="button" onClick={randPositions}>Randomize</button>
        {/* <input className='input' type="number" placeholder="Board Size" title="Enter board size." onKeyDown={changeBoardSize}/> */}
      </header>
      <Board states={states} setStates={setStates} currState={currState} setCurrState={setCurrState} size={boardSize} setSize={setBoardSize} enabled={buttonsEnabled} setEnabled={setButtonsEnabled} clearStates={clearStates} clearBoard={clearBoard}/>
    </div>
  );
}

export default App; // Exports the App function which returns HTML code
