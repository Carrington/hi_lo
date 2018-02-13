import Rx from 'rxjs';
import { drawCard, CARD_DRAWN } from './decks';
import { changeActivePlayer, activePlayerScores, CHANGE_ACTIVE_PLAYER } from './games';

const Observable = Rx.Observable;

export const GUESS_HIGH = 'guesses/GUESS_HIGH';
export const GUESS_LOW = 'guesses/GUESS_LOW';
export const GUESS_CORRECT = 'guesses/GUESS_CORRECT';
export const GUESS_INCORRECT = 'guesses/GUESS_INCORRECT';
export const DISCARD_DRAWS = 'guesses/DISCARD_DRAWS';

export function guessHigh(lastCardDealt) {
  return { type: GUESS_HIGH, lastCardDealt };
}

export function guessLow(lastCardDealt) {
  return { type: GUESS_LOW, lastCardDealt };
}

export function guessCorrect() {
  return { type: GUESS_CORRECT };
}

export function guessIncorrect() {
  return { type: GUESS_INCORRECT };
}

export function discardDraws() {
  return { type: DISCARD_DRAWS }
}

const initialState = {
  minuend: null,
  guessStreak: 0,
  guessThreshold: false,
  pointsOnTheLine: 0
};

export default function(state = initialState, action = {}) {
  switch (action.type) {
    case GUESS_HIGH:
    case GUESS_LOW:
      return { ...state, 
               minuend: action.lastCardDealt.value, 
               pointsOnTheLine: state.pointsOnTheLine + 1 }
    case GUESS_CORRECT:
      let newState = { ...state,
                       guessStreak: state.guessStreak + 1
      };
      if (newState.guessStreak > 2) {
        newState.guessThreshold = true;
      }
      return newState;
    case CHANGE_ACTIVE_PLAYER:
      return { ...state, guessStreak: 0, guessThreshold: false }
    case DISCARD_DRAWS:
      return { ...state, pointsOnTheLine: 0 }
    default:
      return state;
  }
}

export const guessEpic = (action$, store) => {
  return action$.ofType(GUESS_HIGH, GUESS_LOW)
    .mergeMap(() => Observable.of(drawCard()));
};

export const guessHighEpic = (action$, store) => {
  return action$.ofType(GUESS_HIGH)
    .mergeMap(() => {
      return action$.ofType(CARD_DRAWN)
        .take(1)
        .mergeMap(() => Observable.if(
          () => {
            const subtrahend = store
              .getState()
              .decks
              .lastCardDealt
              .value;
            
            const difference = parseInt(store.getState().guesses.minuend, 10) - parseInt(subtrahend, 10);

            return difference < 0;
          },
          Observable.of(guessCorrect()),
          Observable.of(guessIncorrect())
        ))
  });
};

export const guessLowEpic = (action$, store) => {
  return action$.ofType(GUESS_LOW)
    .mergeMap(() => 
      action$.ofType(CARD_DRAWN)
        .take(1)
        .mergeMap(() => Observable.if(
          () => {
            const subtrahend = store
              .getState()
              .decks
              .lastCardDealt
              .value;
            
            const difference = parseInt(store.getState().guesses.minuend, 10) - parseInt(subtrahend, 10);

            return difference > 0;
          },
          Observable.of(guessCorrect()),
          Observable.of(guessIncorrect())
        ))
    );
};

export const guessIncorrectEpic = (action$, store) => {
  return action$.ofType(GUESS_INCORRECT)
    .mergeMap(() => Observable.concat(
      Observable.of(activePlayerScores(store.getState().guesses.pointsOnTheLine)),
      Observable.of(changeActivePlayer()),
      Observable.of(discardDraws())
    ));
};