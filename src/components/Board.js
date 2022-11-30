import React, {useState} from "react"; // ES6 js\
import Square from "./Square.js";
import Arrow from "./Arrows.js";

function Board (props) { // This is a class that extends the React.Component class
    const boardSize = props.size;
    const buttonsEnabled = props.enabled;
    const setBoardSize = props.setSize;
    const setButtonsEnabled = props.setEnabled;
    console.log("BOARD: ", boardSize);

    const disableArrows = (event) => {
        setButtonsEnabled(false);
    }
    const enableArrows = (event) => {
        setButtonsEnabled(true);
    }

    const nextState = (event) => {
        console.log("NEXT STATE");
        console.log("EVENT: ", event.target);
    }
    const prevState = (event) => {
        console.log("PREV STATE");
        console.log("EVENT: ", event.target);
    }
    const lastState = (event) => {
        console.log("MAX STATE");
        console.log("EVENT: ", event.target);
    }
    const firstState = (event) => {
        console.log("MIN STATE");
        console.log("EVENT: ", event.target);
    }
    
    const changeBoardSize = (event) => {
        if((event.key === "Enter" && event.target.value > 0 && event.target.value <= 100)) {
            console.log(event.target.className);
            disableArrows();
            console.log("ENTER PRESSED");
            setBoardSize(event.target.value);
        }
        else if((event.target.className === "button" && event.target.parentNode.childNodes[0].value > 0 && event.target.parentNode.childNodes[0].value <= 100)){
            disableArrows();
            console.log("BUTTON PRESSED");
            setBoardSize(event.target.parentNode.childNodes[0].value);
        }
        // TODO: allow larger boards to be entered but do not change the visual board size it will only be used for the backend (display a message saying the board is too large)
        
      }
    
    // arrow func to make board
    const createBoard = () => {
        console.log("CREATING BOARD");
        const board = [];
        let count = 0;
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if(i % 2 === 0) {
                    if((j % 2 === 0)) {
                        board.push(<Square id={count} backgroundColor="var(--white)" hasQueen={false} />);
                    } else {
                        board.push(<Square id={count} backgroundColor="var(--black)" hasQueen={false} />);
                    }
                } else {
                    if((j % 2 === 0)) {
                        board.push(<Square id={count} backgroundColor="var(--black)" hasQueen={false} />);
                    } else {
                        board.push(<Square id={count} backgroundColor="var(--white)" hasQueen={false} />);
                    }
                }
                count++;
            }
        }
        return board;
    }

    return (
        <div className="boardContainer">
            <div className="input">
                <input type="number" placeholder="Board Size" title="Enter board size." onKeyUp={changeBoardSize}/>
                <button className="button" onClick={changeBoardSize}>Change Board Size</button>
            </div>
            <div className="maxLeft"><button disabled={!buttonsEnabled} onClick={firstState}>&#60;&#60;</button></div>
            <div className="leftArrow"><button disabled={!buttonsEnabled} onClick={prevState}>&#60;</button></div>
            <div className="board" size={props.size} style={{grid: `repeat(${boardSize}, minmax(0, 1fr)) / repeat(${boardSize}, minmax(0, 1fr))`}}>
                {createBoard()}
            </div>
            <div className="rightArrow"><button disabled={!buttonsEnabled} onClick={nextState}>&#62;</button></div>
            <div className="maxRight"><button disabled={!buttonsEnabled} onClick={lastState}>&#62;&#62;</button></div>
        </div>
    );
}

export default Board;
