import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';


const StarsDisplay = props => (
    <>
      {utils.range(1, props.stars).map(starId => <div key={starId} className="star" /> )}
    </>
);


const PlayNumber = props => (
    <button className="number"
            style={{background: colors[props.status]}}>
      {props.number}
    </button>
);


const StarMatch = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [candidateNumbers, setCandidateNumbers] = useState([5]);
  const [availableNumbers, setAvailableNumbers] = useState([1, 2, 5 ]);

  const candidateWrong = utils.sum(candidateNumbers) > stars;

  const numberStatus = (number) => {
    if(!availableNumbers.includes(number)) {
      return 'used';
    }
    if(candidateNumbers.includes(number)) {
      return candidateWrong ? 'wrong' : 'candidate'
    }
    return 'available'
  };

  return (
      <div className="game">
        <div className="help">
          Pick 1 or more numbers that sum to the number of stars
        </div>
        <div className="body">
          <div className="left">
            <StarsDisplay stars={stars} />
          </div>
          <div className="right">
            {utils.range(1, 9).map(number =>
                <PlayNumber key={number} number={number} status={numberStatus(number)} />
            )}

          </div>
        </div>
        <div className="timer">Time Remaining: 10</div>
      </div>
  )
}


function App() {
  return (
    <StarMatch />
  );
}

export default App;


// copied from the  starting code
// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};



const utils = {
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

