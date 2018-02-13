import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { startGame, changeActivePlayer } from '../ducks/games.js';
import { guessHigh, guessLow } from '../ducks/guesses.js';
import { Button, ButtonGroup } from 'react-bootstrap';

const GameButtons = props => { return evalStarted(props) };

const evalStarted = props => {
  return (
    <ButtonGroup>
     {{
       true: evalPass(props),     
       false: <Button onClick={ props.startGame }>Start Game</Button>
     }[props.gameStarted]}
    </ButtonGroup>
  );
}

const evalPass = props => {
  let elements = [
    <Button key="high" bsStyle="primary" onClick={() => props.guessHigh(props.lastCardDealt) }>Guess High</Button>,
    <Button key="low" bsStyle="primary" onClick={() => props.guessLow(props.lastCardDealt) }>Guess Low</Button>
  ];

  if (props.guessThreshold) {
    elements.unshift(
      <Button key="pass" bsStyle="success" onClick={ props.pass }>Pass Turn</Button>
    );
  }

  return elements;
}

GameButtons.propTypes = {
  gameStarted: PropTypes.bool.isRequired,
  lastCardDealt: PropTypes.object,
  guessThreshold: PropTypes.bool.isRequired
}

function mapStateToProps(state, ownProps) {
  return { ...ownProps, lastCardDealt: state.decks.lastCardDealt }
}

function mapDispatchToProps(dispatch) {
  return {
    startGame: () => dispatch(startGame()),
    guessHigh: (lastCardDealt) => dispatch(guessHigh(lastCardDealt)),
    guessLow: (lastCardDealt) => dispatch(guessLow(lastCardDealt)),
    pass: () => dispatch(changeActivePlayer())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameButtons);