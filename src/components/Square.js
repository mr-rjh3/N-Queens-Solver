import {useState} from 'react';

function Square(props) {
    const [hasQueen, setHasQueen] = useState(false);
    const squareClick = (event) => {
        let highlight;
        // find component was clicked
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
    }
    return (
        <button id = {props.id} className={`square ${hasQueen ? 'hasQueen' : ''}`}  style={{backgroundColor: props.backgroundColor,}} 
                                    onClick={squareClick}> 
            <div className="highlight"/>
            <img className="image" src="https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg" alt="" style={{scale: hasQueen ? '1' : '0'}}/>
        </button>
    );
}

export default Square;