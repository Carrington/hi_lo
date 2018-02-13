import React from 'react';
import PropTypes from 'prop-types';
import '../css/Card.css';

const Card = (props) => {
  return (
    <div className="PlayingCard">
      { props.card.images.png &&
        <img src={props.card.images.png} alt='last card' />
      }
    </div>
  );
};

Card.propTypes = {
  cardFace: PropTypes.string
};

export default Card;