import React, {useState} from "react";
import './Home.scss';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from "axios";

function Home(props) {
  const [showForm, setShowForm] = useState(true);
  const [name, setName] = useState("");
  const [gameKey, setGameKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    let tempGameKey = e.target.elements.gameKey.value 
    let name = e.target.elements.name.value 

    setGameKey(tempGameKey);
    
    //
    let nextQuestionStartTime = 0;
    let currentTime = 0
    
    // handle logic for checking if the game id is valid here
    console.log(tempGameKey);
    const getGame = axios.get("/game/" + tempGameKey).then((res) => {
      return res.data
    }).then((data)=>{
      nextQuestionStartTime = data["next_question_start_time"]["$date"]
      // fcurrentTime = data["cur_time"]["$date"]
      // currentTime = new Date().getTime();
      const now = new Date();
      currentTime = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
      console.log("cur time:", currentTime)
      // console.log(fcurrentTime);
      console.log("next q:", nextQuestionStartTime);
    })
    const createPlayer = axios.post("/createplayer", {
      "game_id": tempGameKey, 
      "name": name
    }).then((res)=>{
      localStorage.setItem("player", JSON.stringify(res.data));
      setShowForm(false);
      changePage((nextQuestionStartTime -  currentTime), tempGameKey);
    }).catch((e) =>{
      setErrorMessage("game doesn't exist")
    })
    getGame.then(createPlayer);
  }

  function changePage(timeInMS, gameKey) {
    console.log(timeInMS / 1000);
    setTimeout(function() {
      props.history.push('/gameplay/' + gameKey);
    }, timeInMS);
  }
  
  return (
    <div className='Home'>
      <div>
        <h1>HackHoot</h1>
        <h3>A HackUCI Workshop Production</h3>
        { showForm ?<Form className="join-game-form" onSubmit={handleSubmit}>
          <Form.Group controlId="gameKey">
            <Form.Control placeholder="Enter Game Key" type="text"></Form.Control>
            <Form.Text>
              Make sure to enter the right game key!
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="name">
            <Form.Control placeholder="Enter your name"></Form.Control>
            <Form.Text>
              PG-13 Hard Limit
            </Form.Text>
          </Form.Group>
          <Button variant="light" type="submit">Join Game</Button>
          <div>{errorMessage}</div>
        </Form>
        :
        <div className="registered">
        <h1>
          You are now registered as:
        </h1>
        <h3>
          { name } 
        </h3>
      </div>
      }

      </div>
    </div>
  );
}

export default Home;
