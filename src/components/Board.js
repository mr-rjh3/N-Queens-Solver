import React from "react"; // ES6 js

function Square(props) {
    return (
        <div className="square" style={{backgroundColor: props.backgroundColor}}/>
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

class Board extends React.Component { // This is a class that extends the React.Component class
    // This returns HTML code
    render(){
        return (
            <div className="board">
                {createBoard()}
            </div>
        );
    }
}

export default Board;
