import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import DecksReducer, { drawCardEpic, shuffleDeckEpic } from './decks';
import GamesReducer, { startGameEpic, drawFirstCardEpic, endGameEpic, cleanupGameEpic } from './games';
import GuessesReducer, { guessEpic, guessHighEpic, guessLowEpic, guessIncorrectEpic } from './guesses';

export const rootEpic = (...args) => {
  return combineEpics(drawCardEpic,
                      drawFirstCardEpic,
                      shuffleDeckEpic,
                      startGameEpic,
                      endGameEpic,
                      cleanupGameEpic,
                      guessIncorrectEpic,
                      guessEpic,
                      guessHighEpic, 
                      guessLowEpic)(...args);
  };

export const rootReducer = combineReducers({
  decks: DecksReducer,
  games: GamesReducer,
  guesses: GuessesReducer
});