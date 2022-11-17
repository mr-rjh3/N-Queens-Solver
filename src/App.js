// import logo from './logo.svg';
import './App.css';
import Board from './components/Board';

function App() { // This returns HTML code
  return (
    <div className="App">
      <button className="button">Start Game</button>
      <Board />
    </div>
  );
}

export default App; // Exports the App function which returns HTML code
