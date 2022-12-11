import React, {useState, useEffect} from "react"; // ES6 js\
import Square from "./Square.js";

function Board (props) { // This is a class that extends the React.Component class
    const boardSize = props.size;
    const setBoardSize = props.setSize;
    const states = props.states;
    const setStates = props.setStates;
    const currState = props.currState;
    const setCurrState = props.setCurrState;
    const clearStates = props.clearStates;
    const clearBoard = props.clearBoard;

    // array of use states for all squares

    // console.log("BOARD: ", boardSize);
    // useEffect, change the state of the board when currState changes
    useEffect(() => {
        if(states.length > 0)
            changeState();
    }, [currState]);
    // when the board size gets updated
    useEffect(() => {
        // change the board size in css :root
        var root = document.querySelector(':root');
        root.style.setProperty('--boardSize', boardSize);
        // clear the board and states
        clearStates();
        clearBoard();
    }, [boardSize]);
    
    const firstState = (event) => {
        // Update board to first state
        setCurrState(0);
    }
    const prevState = (event) => {
        // Update board to prev state
        setCurrState(currState - 1);
    }
    const nextState = (event) => {
        // Update board to next state
        setCurrState(currState + 1); 
    }
    const lastState = (event) => {
        // Update board to last state
        setCurrState(states.length-1);
    }
    const changeState = (event) => {
        const squares = document.getElementsByClassName("square");
        for(let i = 0; i < squares.length; i++) {
            squares[i].querySelector('.conflict').innerText = "";
        }
        const queens = document.getElementsByClassName("hasQueen");
        while(queens.length > 0)
            queens[0].classList.remove("hasQueen");
        // clear any text on the squares

        for(let i = 0; i < states[currState].length; i++) {
            if(states[currState][i] != null) {
                if(typeof states[currState][i] == "number") { // if the element is a number, then draw the queen on the square in ith column
                    // TODO: Squares useState "hasQueen" is not updated
                    squares[states[currState][i] * boardSize + i].classList.add("hasQueen");
                }
                else{ // if the element is an array, draw all the confilct numbers on the squares in the ith column
                    for(let j = 0; j < states[currState][i].length; j++) {
                        if(states[currState][i][j] != null){
                            squares[i+(boardSize*j)].querySelector('.conflict').innerText = states[currState][i][j];
                        }
                        else{
                            squares[i+(boardSize*j)].classList.add("hasQueen");
                        }
                    }
                }
            }
        }
    }

    
    const changeBoardSize = (event) => {
        if((event.key === "Enter" && event.target.value > 0 && event.target.value <= 100)) {
            // console.log(event.target.className);
            // console.log("ENTER PRESSED");
            setBoardSize(event.target.value);
            
        }
        else if((event.target.className === "button" && event.target.parentNode.childNodes[0].value > 0 && event.target.parentNode.childNodes[0].value <= 100)){
            // console.log("BUTTON PRESSED");
            setBoardSize(event.target.parentNode.childNodes[0].value);
        }
        // TODO: allow larger boards to be entered but do not change the visual board size it will only be used for the backend (display a message saying the board is too large)
      }
    
    // arrow func to make board
    const createBoard = () => {
        // console.log("CREATING BOARD");
        const board = [];
        let count = 0;
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if(i % 2 === 0) {
                    if((j % 2 === 0)) {
                        board.push(<Square key={count} id={count} backgroundColor="var(--white)" hasQueen={false} setStates={setStates} clearStates={clearStates}/>);
                    } else {
                        board.push(<Square key={count} id={count} backgroundColor="var(--black)" hasQueen={false} setStates={setStates} clearStates={clearStates} />);
                    }
                } else {
                    if((j % 2 === 0)) {
                        board.push(<Square key={count} id={count} backgroundColor="var(--black)" hasQueen={false} setStates={setStates} clearStates={clearStates} />);
                    } else {
                        board.push(<Square key={count} id={count} backgroundColor="var(--white)" hasQueen={false} setStates={setStates} clearStates={clearStates} />);
                    }
                }
                count++;
            }
        }
        return board;
    }

    return (
        <div className="boardContainer">
            <div className="boardButtons">
                <input type="number" placeholder="Board Size" title="Enter board size." onKeyUp={changeBoardSize}/>
                <button className="button" onClick={changeBoardSize}>Change Board Size</button>
            </div>
            <div className="maxLeft"><button disabled={currState<=0} onClick={firstState}>&#60;&#60;</button></div>
            <div className="leftArrow"><button disabled={currState<=0} onClick={prevState}>&#60;</button></div>
            <div className="board" size={props.size} style={{grid: `repeat(${boardSize}, minmax(0, 1fr)) / repeat(${boardSize}, minmax(0, 1fr))`}}>
                {createBoard()}
            </div>
            <div className="rightArrow"><button disabled={currState>=states.length-1} onClick={nextState}>&#62;</button></div>
            <div className="maxRight"><button disabled={currState>=states.length-1} onClick={lastState}>&#62;&#62;</button></div>
        </div>
    );
}

export default Board;
