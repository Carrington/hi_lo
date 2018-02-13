import React from 'react';
import PropTypes from 'prop-types';

const Deck = (props) => {
  return (
    <div className="deck">
      <h5>Cards Remaining: {props.cardsRemaining}</h5>
    </div>
  );
};

Deck.propTypes = {
  cardsRemaining: PropTypes.number.isRequired
};

export default Deck;