import {useState} from 'react';

function Arrow(props) {
    const [isEnabled, setEnabled] = useState(props.enabled);
    const arrowClick = (event) => {
        console.log("ARROW CLICKED");
        setEnabled(current => !current);
    }
    return (
        <div className={props.className}><button disabled={isEnabled} onClick={arrowClick}></button></div>
    );
}

export default Arrow;