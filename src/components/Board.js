import React, {useState} from "react"; // ES6 js
function Board () { // This is a class that extends the React.Component class
    // This returns HTML code

    
    
    
    function Square(props) {
        const [isActive, setIsActive] = useState(false);
        const clickHandler = () => {
            console.log("clicked");
            setIsActive(current => !current);
        }
        return (
            <button className="square"  style={{backgroundColor: props.backgroundColor,}} 
                                        onClick={clickHandler}> 
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg" style={{opacity: isActive ? '1' : '0'}}/>                           
            </button>
        );
    }
    
    
    // arrow func to make board
    const createBoard = () => {
        const board = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if(i % 2 === 0) {
                    if((j % 2 === 0)) {
                        board.push(<Square backgroundColor= "var(--white)"/>);
                    } else {
                        board.push(<Square backgroundColor= "var(--black)"/>);
                    }
                } else {
                    if((j % 2 === 0)) {
                        board.push(<Square backgroundColor= "var(--black)"/>);
                    } else {
                        board.push(<Square backgroundColor= "var(--white)"/>);
                    }
                }
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
