import React, {useEffect, useState} from 'react';
import './App.css';


const StarsDisplay = props => (
    <>
        {utils.range(1, props.stars).map(starId => <div key={starId} className="star"/>)}
    </>
);


const PlayNumber = props => (
    <button className="number"
            style={{background: colors[props.status]}}
            onClick={() => props.onClick(props.number, props.status)}
    >
        {props.number}
    </button>
);


const PlayAgain = props => (
    <div className="game-done">
        <div className="message"
             style={{color: props.gameStatus === "won" ? "green" : "red "}}
        >
            {props.gameStatus === "won" ? "You Won! ^_^" : "you lost T_T"}
        </div>
        <button onClick={props.onClick}>Play Again</button>
    </div>
)


// creating a hook for the game
const useGameState = () => {
    const [stars, setStars] = useState(utils.random(1, 9));
    const [candidateNumbers, setCandidateNumbers] = useState([]);
    const [availableNumbers, setAvailableNumbers] = useState(utils.range(1, 9));
    const [secondsLeft, setSecondsLeft] = useState(10);

    useEffect(() => {
        if (secondsLeft > 0 && availableNumbers.length > 0) {
            const timer = setTimeout(() => {
                setSecondsLeft(secondsLeft - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    })

    const setGameState = (newCandidateNumbers) => {
        if (utils.sum(newCandidateNumbers) !== stars) {
            setCandidateNumbers(newCandidateNumbers);
        } else {
            const newAvailableNumbers = availableNumbers.filter(
                x => !newCandidateNumbers.includes(x)
            );
            setAvailableNumbers(newAvailableNumbers);
            setCandidateNumbers([]);
            setStars(utils.randomSumIn(newAvailableNumbers, 9));
        }

    };

    return {stars, availableNumbers, candidateNumbers, secondsLeft, setGameState};

};

const Game = (props) => {
    // using the hook
    const {stars, availableNumbers, candidateNumbers, secondsLeft, setGameState} = useGameState();

    const candidateWrong = utils.sum(candidateNumbers) > stars;
    const gameStatus = availableNumbers.length === 0 ? "won" : secondsLeft === 0 ? "lost" : "playing"

    // const resetGame = () => {
    //     setStars(utils.random(1, 9));
    //     setAvailableNumbers(utils.range(1, 9));
    //     setCandidateNumbers([]);
    //     setSecondsLeft(10)
    // }

    const numberStatus = (number) => {
        if (!availableNumbers.includes(number)) {
            return 'used';
        }
        if (candidateNumbers.includes(number)) {
            return candidateWrong ? 'wrong' : 'candidate'
        }
        return 'available'
    };


    const onNumberClick = (number, currentStatus) => {
        if (currentStatus === "used" || gameStatus !== "playing")
            return;

        let newCandidateNumbers;
        if (currentStatus === "available") {
            newCandidateNumbers = candidateNumbers.concat(number);
        } else {
            newCandidateNumbers = candidateNumbers.filter(x => x !== number);
        }

        // setting the state from the custom hook
        setGameState(newCandidateNumbers);

    }


    return (
        <div className="game">
            <div className="help">
                Pick 1 or more numbers that sum to the number of stars
            </div>
            <div className="body">
                <div className="left">
                    {
                        gameStatus !== "playing" ? <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus}/> :
                            <StarsDisplay stars={stars}/>
                    }
                </div>
                <div className="right">
                    {utils.range(1, 9).map(number =>
                        <PlayNumber
                            key={number}
                            number={number}
                            status={numberStatus(number)}
                            onClick={onNumberClick}
                        />
                    )}

                </div>
            </div>
            <div className="timer">Time Remaining: {secondsLeft}</div>
        </div>
    )
}


function App() {
    return (
        <StarMatch/>
    );
}

export default App;

const StarMatch = () => {
    const [gameId, setGameId] = useState(1);

    return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>
}
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

    range: (min, max) => Array.from({length: max - min + 1}, (_, i) => min + i),

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

