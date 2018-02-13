import React from 'react';
import Deck from '../components/Deck';
import Card from '../components/Card';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const DeckContainer = (props) => {
  return (
    <div className="deckContainer">
      <Deck cardsRemaining={props.cardsRemaining} />
      <div className="cardsDealtContainer">
        <h5>Cards Dealt: {props.cardsDealt}</h5>
        <Card card={props.lastCardDealt} />
      </div>
    </div>
  );
};

//Soap Box: PropTypes should provide a way to define isRequiredOrNull, but the community's split 
//about it. Normally I would define a custom validator, but due to time I've let that slide here. 
//C.F. https://github.com/facebook/react/issues/3163, https://github.com/facebook/prop-types/pull/90
DeckContainer.propTypes = {
  cardsRemaining: PropTypes.number.isRequired,
  cardsDealt: PropTypes.number.isRequired,
  lastCardDealt: PropTypes.object,
  deckIdentifier: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
  return { ...ownProps, 
    cardsRemaining: state.decks.cardsRemaining,
    cardsDealt: state.decks.cardsDealt,
    lastCardDealt: state.decks.lastCardDealt,
    deckIdentifier: state.decks.deckIdentifier };
}

export default connect(mapStateToProps)(DeckContainer);