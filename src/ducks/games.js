import Rx from 'rxjs';
import { drawCard, shuffleDeck, DECK_SHUFFLED, CARD_DRAWN } from './decks';
import { discardDraws } from './guesses';

const Observable = Rx.Observable;

export const START_GAME = 'games/START_GAME';
export const END_GAME = 'games/END_GAME';
export const CHANGE_ACTIVE_PLAYER = 'games/CHANGE_ACTIVE_PLAYER';
export const ACTIVE_PLAYER_SCORES = 'games/ACTIVE_PLAYER_SCORES';

export function activePlayerScores(score) {
  return { type: ACTIVE_PLAYER_SCORES, score }
}

export function startGame() {
  return { type: START_GAME };
}

export function endGame() {
  return { type: END_GAME };
}

export function changeActivePlayer() {
  return { type: CHANGE_ACTIVE_PLAYER };
}

export function empty() {
  return { type: 'empty' };
}

export const endGameEpic = (action$, store) => {
  return action$.ofType(CARD_DRAWN)
    .switchMap(() => Observable.if(
      () => store.getState().decks.cardsRemaining < 1,
      Observable.of(endGame()),
      Observable.of(empty()) //annoyingly, I can't find any way to make redux-observable behave nicely with Observable.empty outside of typescript
    ));
}

export const cleanupGameEpic = (action$, store) => {
  return action$.ofType(END_GAME)
    .switchMap(() => Observable.concat(
      Observable.of(discardDraws())
    ));
}

export const startGameEpic = (action$, store) => {
  return action$.ofType(START_GAME)
    .mergeMap(action => {
      return Observable.of(shuffleDeck())
    })
}

export const drawFirstCardEpic = (action$) => {
  return action$.ofType(START_GAME)
  .mergeMap(() =>
    action$.ofType(DECK_SHUFFLED)
    .take(1)
    .mergeMap(() => Observable.of(drawCard()))
  );
}

const initialState = {
  gameStarted: false,
  activePlayer: 'PLAYER_1',
  scores: {
    PLAYER_1: 0,
    PLAYER_2: 0
  },
  winner: null,
  won: false
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case START_GAME:
      return { ...state, gameStarted: true, won: false };
    case END_GAME:
      const winner = Object
        .keys(state.scores)
        .reduce((result, player) => state.scores[result] < state.scores[player] ? result : player)

      return { ...state, 
               activePlayer: initialState.activePlayer,
               gameStarted: initialState.gameStarted,
               scores: initialState.scores,
               winner: winner,
               won: true
      }
    case CHANGE_ACTIVE_PLAYER:
      if (state.gameStarted) {
        const player = (state.activePlayer === 'PLAYER_1') ? 'PLAYER_2' : 'PLAYER_1';

        return { ...state, activePlayer: player };
      }
    break;
    case ACTIVE_PLAYER_SCORES:
      if (state.gameStarted) {
        let scores = { ...state.scores };
        scores[state.activePlayer] = scores[state.activePlayer] + action.score;

        return { ...state, scores: scores  }
      }
    break;
    default:
      return state;
  }

  return state;
}