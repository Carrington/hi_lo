import { ajax } from 'rxjs/observable/dom/ajax';

const DECK_URL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'

export const DRAW_CARD = 'decks/DRAW_CARD';
export const CARD_DRAWN = 'decks/CARD_DRAWN';
export const SHUFFLE_DECK = 'decks/SHUFFLE_DECK';
export const DECK_SHUFFLED = 'decks/DECK_SHUFFLED';

export function drawCard() {
  return { type: DRAW_CARD };
}

export function cardDrawn(card) {
  return { type: CARD_DRAWN, card };
}

export function shuffleDeck() {
  return { type: SHUFFLE_DECK };
}

export function deckShuffled(deck) {
  return { type: DECK_SHUFFLED, deck }
}

export const shuffleDeckEpic = (action$, store) => {
  return action$.ofType(SHUFFLE_DECK)
    .mergeMap(action => {
      return ajax({
          url: DECK_URL,
          crossDomain: true, 
          createXHR: function () {
            return new XMLHttpRequest();
          }
        })
        .map(response => ({
          type: DECK_SHUFFLED,
          deck: response.response
        }))
    })
};

export const drawCardEpic = (action$, store) => {
  return action$.ofType(DRAW_CARD)
    .mergeMap(action => 
      ajax({
          url: `https://deckofcardsapi.com/api/deck/${store.getState().decks.deckIdentifier}/draw/?count=1`,
          crossDomain: true, 
          createXHR: function () {
           return new XMLHttpRequest();
          }
        })
        .map(response => ({
          type: CARD_DRAWN,
          card: response.response.cards[0]
        }))
    );
}

const initialState = {
  cardsRemaining: 52,
  cardsDealt: 0,
  lastCardDealt: {
    images: {
      png: null
    },
    value: null
  },
  deckIdentifier: null,
  drawingCard: false
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case DRAW_CARD:
      return { ...state, drawingCard: true }
    case CARD_DRAWN:
      let card = action.card;

      switch(action.card.value) {
        case "ACE":
          card.value = 1;
        break;
        case "JACK":
          card.value = 11;
        break;
        case "QUEEN":
          card.value = 12;
        break;
        case "KING":
          card.value = 13;
        break;
        default:
        break;
      }

      return { ...state, 
               drawingCard: false, 
               cardsRemaining: state.cardsRemaining - 1,
               cardsDealt: state.cardsDealt + 1,
               lastCardDealt: card,
      }
    case SHUFFLE_DECK:
      return { ...state, deckIdentifier: initialState.deckIdentifier, shuffling: true }; 
    case DECK_SHUFFLED:
      return { ...state, 
               deckIdentifier: action.deck.deck_id,
               cardsDealt: initialState.cardsDealt,
               cardsRemaining: action.deck.remaining,
               lastCardDealt: initialState.lastCardDealt,
               shuffling: false
      }
    default:
      return state;
  }
};