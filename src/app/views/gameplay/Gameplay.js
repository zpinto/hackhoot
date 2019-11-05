import React, { useState, useEffect } from "react";
import './Gameplay.scss';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faLinkedInIn, faReddit, faSnapchat, faVine } from '@fortawesome/fontawesome-svg-core'

import { Trail } from 'react-spring/renderprops';
import axios from "axios";

const colors = [
  {
    title: 'a',
    hex: '#fc3835',
    icon: 'reddit'
  },
  { 
    title: 'b',
    hex: '#5567f2',
    icon: 'linkedin-in'
  },
  {
    title: 'c',
    hex: '#42d458',
    icon: 'vine'
  },
  {
    title: 'd',
    hex: '#f5e236',
    icon: 'snapchat'
  }
];
//create questions
function Gameplay(props) {
  // Get questions through unique id
  const [timeLimit, setTimeLimit] = useState(60)
  const [displayAnswer, setDisplayAnswer] = useState(false)

  const lobbyId = props.match.params.lobbyId;
  
  useEffect(()=>{
      //changePage((gameData["next_question_start_time"] -  curr)/1000);
    axios.get("/game/"+ lobbyId).then(res => {
      let curr = new Date()
      setTimeLimit((res.data["next_question_start_time"] -  curr)/1000)
      setTimeout(function() {
        setDisplayAnswer(true);  
        setTimeout(function() {
          props.history.push('/gameplay/' + lobbyId);
        }, 10);
      }, timeLimit);
      
    })
  })

  async function submitAnswer(answer){
    let player = localStorage.getItem("player");
    try {
      let result = await axios.put("/player", {"_id": player._id, "answer": answer})
      
    } catch(err){
      console.log(err);
    }

  }
  return (
    <div className="Gameplay">
      <div className="gameplay-content">
      { displayAnswer ?
        <div>
          <Trail 
            items={colors} 
            keys={item => item} 
            from={{opacity: 0}} 
            to={{opacity: 1}}
            duration={1000}
          >
            {
              item => props => 
              <div 
                className="flex-center" 
                style={{...props, 'backgroundColor': item.hex}}
                onClick={()=>{submitAnswer(item.title)}}
              >
                 <span>{item.title}</span> 
              </div>
            }
          </Trail>
        </div>
        :
        <div>
          qpwoeiryqpwoeiryqwpoy
        </div>
      }
      </div>
    </div>
  );
}

export default Gameplay;
