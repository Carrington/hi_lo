import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import DeckContainer from './DeckContainer';
import GameButtons from '../components/GameButtons';
import ScoreBoard from '../components/ScoreBoard'

const Game = (props) => {
  return ( 
    <div className="gameContainer">
      <DeckContainer />
      <GameButtons {...props} />
      <ScoreBoard 
        won= { props.won }
        winner={ props.winner }
        points={ props.pointsOnTheLine }
        player1={ props.scores.PLAYER_1 }
        player2={ props.scores.PLAYER_2 } />
    </div>
  );
};

Game.propTypes = {
  gameStarted: PropTypes.bool.isRequired,
  activePlayer: PropTypes.string.isRequired,
  scores: PropTypes.object.isRequired,
  guessThreshold: PropTypes.bool.isRequired,
  won: PropTypes.bool.isRequired,
  winner: PropTypes.string,
  pointsOnTheLine: PropTypes.number.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return { ...ownProps,
           state,
           won: state.games.won,
           winner: (state.games.winner === 'PLAYER_1') ? 'Player 1' : 'Player 2',
           guessThreshold: state.guesses.guessThreshold,
           pointsOnTheLine: state.guesses.pointsOnTheLine,
           scores: state.games.scores };
};

export default connect(mapStateToProps)(Game);
