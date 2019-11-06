import React, { useState, useEffect }  from "react";
import './PlayGame.scss';

import axios from "axios";

function PlayGame(props) {

  const gameId = props.match.params.gameId;
  const [initialGet, setInitialGet] = useState(false);
  const [timeLimit, setTimeLimit] = useState(60);
  const [curQuestion, setCurQuestion] = useState({
    "_id": {
      "$oid": " "
    },
    'question': ' ',
    'A': ' ',
    'B': ' ',
    'C': ' ',
    'D': ' ',
    'answer': ' '
  });
  const [displayQuestion, setDisplayQuestion] = useState(true);
  const [playersArr, setPlayersArr] = useState([]);

  function renderQuestion () {
    setInitialGet(true);
    axios.get('/game/' + gameId).then(res => {
      setTimeLimit(res.data["time_limit"]);
      setCurQuestion(res.data["questions"][res.data["cur_question"]])
    }).catch(err => {
      console.log("Failed to GET /game");
    });
  }

  function getPlayer (playerId) {
    axios.get('/player/' + playerId).then(res => {
      return {
        name: res.data.name,
        score: res.data.score
      }
    }).catch(err => {
      console.log("failed to GET /player");
    });
  }

  function renderScores () {
    axios.get('/game/' + gameId).then(res => {
      setTimeLimit(res.data["time_limit"]);
      setPlayersArr(res.data["players"]);
    }).catch(err => {
      console.log("failed to GET /game");
    });
  }

  useEffect(() => {
    if (!initialGet) renderQuestion();
    if (!timeLimit) {
      axios.post('/game/' + gameId).catch(res => {
        console.log("Failed to update gamestate");
        if (displayQuestion) {
          renderScores();
        } else {
          renderQuestion();
        }
      });
      setDisplayQuestion(!displayQuestion);
    }
    const intervalId = setInterval(() => {
      setTimeLimit(timeLimit - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLimit]);

  
  return (
    <div className="Admin">
      <div className="admin-card">
        <div>
          <div className="timer">{timeLimit}</div>
          <div className="game-title">
            <h1>HackHoot</h1>
          </div>

          {displayQuestion ? 
          <div>
            <p className="question">{curQuestion.question}</p>
            <div className="choices">
              <div>A: {curQuestion.A}</div>
              <div>B: {curQuestion.B}</div>
              <div>C: {curQuestion.C}</div>
              <div>D: {curQuestion.D}</div>
            </div>
          </div>
          :
          <div>
            <p className="question">Scores</p>
            <div>
              {playersArr.map((p, i) => (
                <div index={i} key={i}>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </div>
          }
          
        </div>
      </div>
    </div>
  );
}

export default PlayGame;
