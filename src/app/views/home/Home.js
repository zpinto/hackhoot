import React, {useState} from "react";
import './Home.scss';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from "axios";

function Home(props) {
  const [showForm, setShowForm] = useState(true);
  const [name, setName] = useState("");
  const [gameKey, setGameKey] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setGameKey(e.target.elements.gameKey.value);
    //
    
    // handle logic for checking if the game id is valid here
    try
    {
      let player = await axios.post("/createplayer", {"game_id": gameKey, "name": name});
      localStorage.setItem("player", player);
      let gameData = await axios.get("/game/" + gameKey).then((res) => { return res.data });
      let curr = new Date()
      changePage((gameData["next_question_start_time"] -  curr)/1000);
    }
    catch(err){
      console.log(err);
    }
  }

  function changePage(timeInMS) {
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
