import wins from "./wins.json";
import { createStore } from "redux";
import {
  binarySearchListForObjectWithComparator,
  compareByTotalGames,
  first,
  prev,
  next,
  last,
  randomMatchup,
} from "./MatchupNavigator";
console.log("in store.js");

console.log("defined first, next, last");

let initialState = {
  bestScores: {},
  currentIndex: 1,
  guessedMatchups: {},
  minimumGames: 8000,
  orderBy: "Left Win %",
  quizMode: false,
  quizResults: [],
  selectedGames: [],
  seenMatchups: {},
  winsDisplay: [0, 0],
};

//searches for a matchup by minimum games
let firstMatchup = randomMatchup(initialState);

// let totalGamesList = sortedMatchupLists["Total Games"];
// let totalGamesIndex = binarySearchListForObjectWithComparator(
//   totalGamesList,
//   firstMatchup,
//   compareByTotalGames
// );
// let matchupsPossible = totalGamesList.length - totalGamesIndex;
// totalGamesIndex =
  // totalGamesIndex + Math.floor(Math.random() * matchupsPossible);

// initialState.matchup = totalGamesList[totalGamesIndex];

initialState.matchup = firstMatchup;

initialState.seenMatchups = {
  [[initialState.matchup.left, initialState.matchup.right]
    .sort()
    .join("")]: true,
};

const getWinsDisplayForMatchup = (matchup) => {
  return [
    wins[matchup.videogameId][matchup.left][matchup.right],
    wins[matchup.videogameId][matchup.right][matchup.left],
  ];
};

let state = initialState;
const reducer = (prevState = initialState, action) => {
  switch (action.type) {
    case "setGameId":
      return {
        ...prevState,
        gameId: action.gameId,
      };
    case "updateWinsDisplay":
      return {
        ...prevState,
        winsDisplay: action.winsDisplay,
      };
    case "prev":
      return {
        ...prevState,
        matchup: prev(prevState),
      };
    case "next":
      return {
        ...prevState,
        matchup: next(prevState),
      };
    case "first":
      return {
        ...prevState,
        matchup: first(prevState),
      };
    case "last":
      return {
        ...prevState,
        matchup: last(prevState),
      };
    case "random": {
      let newMatchup = randomMatchup(prevState);
      if (prevState.lockedSide == "left") {
        while (newMatchup.left !== prevState.matchup.left) {
          newMatchup = randomMatchup(prevState);
        }
      }
      if (prevState.lockedSide == "right") {
        while (newMatchup.right !== prevState.matchup.right) {
          newMatchup = randomMatchup(prevState);
        }
      }

      return {
        ...prevState,
        matchup: newMatchup,
        seenMatchups: {
          ...prevState.seenMatchups,
          [[newMatchup.left, newMatchup.right].sort().join("")]: true,
        },
        winsDisplay: prevState.quizMode
          ? [50, 50]
          : getWinsDisplayForMatchup(newMatchup),
      };
    }

    case "setOrderBy":
      return {
        ...prevState,
        orderBy: action.orderBy,
      };
    // quiz muts
    case "pushQuizResult":
      return {
        ...prevState,
        quizResults: [...prevState.quizResults, action.result],
      };
    case "toggleQuizMode":
      return {
        ...prevState,
        quizMode: action.val,
        winsDisplay: action.val
          ? [50, 50]
          : getWinsDisplayForMatchup(prevState.matchup),
      };
    default:
      return prevState;
  }
};

const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
