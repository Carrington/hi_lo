import React from 'react';

const ScoreBoard = (props) => {
  return (
    <div className="scoreBoard">
      {{
        true: <h3>{ props.winner } has won the game!</h3>,
        false: scores(props)
      }[props.won]}
    </div>
   );
};

const scores = props => (
  <div>
    <p>Points on the Line: { props.points }</p>
    Player 1: {props.player1}<br />
    Player 2: {props.player2}
  </div>
);

export default ScoreBoard;