import React from 'react';
import { connect } from 'react-redux';
import '../css/App.css';
import Game from './Game';

const App = (props) => {
  return (
    <div className="App">
      <header className="App-header">
        Hi - Lo
      </header>
      <Game {...props} />
    </div>
  )
};

function mapStateToProps(state) {
  return {
    gameStarted: state.games.gameStarted,
    turnNumber: state.games.turnNumber,
    activePlayer: state.games.activePlayer,
    scores: {}
  };
}

export default connect(mapStateToProps)(App);
