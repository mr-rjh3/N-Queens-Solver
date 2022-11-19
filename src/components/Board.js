import React, {useState} from "react"; // ES6 js

const BOARD_SIZE = 8;

function Board () { // This is a class that extends the React.Component class
    // This returns HTML code
 
    function Square(props) {
        const [isActive, setIsActive] = useState(false);
        const squareClick = (event) => {
            let highlight;
            // console.log(event.target);
            if(event.target.className === "square " || event.target.className === "square hasQueen") {
                highlight = event.target.childNodes[0];
            }
            else if(event.target.className === "highlight") {
                highlight = event.target;
            }
            else if(event.target.className === "image") {
                highlight = event.target.parentNode.childNodes[0];
            }
            // console.log(highlight);
                
            // If the square is already red, make it not that
            if(highlight.style.opacity !== "0") {
                highlight.style.opacity = "0";
            }
            setIsActive(current => !current);
        }
        return (
            <button id = {props.id} className={`square ${isActive ? 'hasQueen' : ''}`}  style={{backgroundColor: props.backgroundColor,}} 
                                        onClick={squareClick}> 
                <div className="highlight"/>
                <img className="image" src="https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg" style={{scale: isActive ? '1' : '0'}}/>
            </button>
        );
    }
    
    
    // arrow func to make board
    const createBoard = () => {
        const board = [];
        let count = 0;
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if(i % 2 === 0) {
                    if((j % 2 === 0)) {
                        board.push(<Square id={count} backgroundColor="var(--white)"/>);
                    } else {
                        board.push(<Square id={count} backgroundColor="var(--black)"/>);
                    }
                } else {
                    if((j % 2 === 0)) {
                        board.push(<Square id={count} backgroundColor="var(--black)"/>);
                    } else {
                        board.push(<Square id={count} backgroundColor="var(--white)"/>);
                    }
                }
                count++;
            }
        }
        return board;
    }

    return (
        <div className="board">
            {createBoard()}
        </div>
    );
}

export default Board;
