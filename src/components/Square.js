import {useState, useEffect} from 'react';

function Square(props) {
    const [hasQueen, setHasQueen] = useState(false);
    const setStates = props.setStates;
    const setCurrState = props.setCurrState;
    const clearStates = props.clearStates;

    // after user clicks on a square
    useEffect(() => {
        // console.log("SQUARE: ", props.id, hasQueen);
    }, [hasQueen]);

    const squareClick = (event) => {
        let highlight;
        // find component was clicked
        console.log(event.target);
        if(event.target.className === "square " || event.target.className === "square hasQueen") 
            highlight = event.target.childNodes[0];
        else if(event.target.className === "highlight") 
            highlight = event.target;
        else if(event.target.className === "image") 
            highlight = event.target.parentNode.childNodes[0];
        // If the square is already red, make it not that
        if(highlight.style.opacity !== "0") 
            highlight.style.opacity = "0";
        
        setHasQueen(current => !current);
        clearStates();

    }
    return (
        <button id = {props.id} className={`square ${hasQueen ? 'hasQueen' : ''}`}  style={{backgroundColor: props.backgroundColor,}} 
                                    onClick={squareClick}> 
            <div className="highlight"/>
            <p className='conflict'></p>
            <img className="image" src="https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg" alt="" />
        </button>
    );
}

export default Square;