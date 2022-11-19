import React, {useState} from "react"; // ES6 js


function Board (props) { // This is a class that extends the React.Component class
    const [boardSize, setBoardSize] = useState(parseInt(props.size)); // This is a hook that allows us to use state in a functional component
    console.log("BOARD: ", boardSize);

    
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
    
    const changeBoardSize = (event) => {
        if(event.key === "Enter" && event.target.value > 0 && event.target.value <= 20) {
            console.log("ENTER PRESSED");
            setBoardSize(event.target.value);

        }
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
        <div className="boardContainer">
            <input className='input' type="number" placeholder="Board Size" title="Enter board size." onKeyUp={changeBoardSize}/>
            <div className="board" size={props.size} style={{grid: `repeat(${boardSize}, 1fr) / repeat(${boardSize}, 1fr)`}}>
                {createBoard()}
            </div>
        </div>
    );
}

export default Board;
