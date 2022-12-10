function Square(props) {
    const clearStates = props.clearStates;

    const squareClick = (event) => {
        // if(states.length > 0) {
        //     alert("Please clear the board first");
        //     return;
        // }
        let highlight;
        // find component was clicked
        console.log(event.target);
        var square;
        if(event.target.className === "square " || event.target.className === "square hasQueen") {
            square = event.target;
            highlight = event.target.childNodes[0];
        }
        else if(event.target.className === "highlight") {
            square = event.target.parentNode;
            highlight = event.target;
        }
        else if(event.target.className === "image") {
            square = event.target.parentNode;
            highlight = event.target.parentNode.childNodes[0];
        }
        if(square.className === "square hasQueen") {
            square.classList.remove("hasQueen");
        }
        else {
            square.classList.add("hasQueen");
        }
        // If the square is already red, make it not that
        if(highlight.style.opacity !== "0") 
            highlight.style.opacity = "0";
        
        clearStates();
    }
    return (
        <button id = {props.id} className={`square`}  style={{backgroundColor: props.backgroundColor,}} 
                                    onClick={squareClick}> 
            <div className="highlight"/>
            <p className='conflict'></p>
            <img className="image" src="https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg" alt="" />
        </button>
    );
}

export default Square;