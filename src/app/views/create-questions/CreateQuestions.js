import React, { useState }  from "react";
import axios from 'axios';
import './CreateQuestions.scss';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function CreateQuestions(props) {

  const [allQuestions, setAllQuestions] = useState([]);
  const [question, setQuestion] = useState(
    {
      'question': '',
      'A': '',
      'B': '',
      'C': '',
      'D': '',
      'answer': ''
    }
  );
  
  function addQuestion() {
    setAllQuestions([...allQuestions, question]);
    setQuestion({
      'question': '',
      'A': '',
      'B': '',
      'C': '',
      'D': '',
      'answer': ''
    })
    createQuestion(question);
  }

  function handleInputChange(e) {
    setQuestion({
      ...question,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    axios.post('/creategame', {'time_limit': 30}).then(res => {
      return props.history.push('/admin/start-game/' + res.data._id["$oid"]);
    }).catch(err => {
      console.log("could not create game");
    });
  }

  function createQuestion(q) {
    axios.post('/createquestion', q).then(res => {
      console.log(res.data);
    }).catch(err => {
      console.log("could not create question");
    });
  }

  return (
    <div className="Admin">
      <div className="admin-card">
        <div>
          <div className="game-title">
            <h1>HackHoot</h1>
            <p> Administrative Portal </p>
          </div>
          <div className="game-form">
            <Form
             onSubmit={handleSubmit}>

              <Form.Group controlId="question">

                <Form.Label>Question and Answer Choices</Form.Label>
                <Form.Control className="question-input" placeholder="Enter Question" name="question" onChange={handleInputChange} value={question.question} required></Form.Control>
                <div className="choices">
                  <div>
                    <Form.Check type="radio" name="answer" value="a" onChange={handleInputChange}/>
                    <Form.Control placeholder="Answer Choice" name="A" onChange={handleInputChange} value={question.A}></Form.Control>
                  </div>
                  <div>
                    <Form.Check type="radio" name="answer" value="b" onChange={handleInputChange} />
                    <Form.Control placeholder="Answer Choice" name="B" onChange={handleInputChange} value={question.B}></Form.Control>
                  </div>
                  <div>
                    <Form.Check type="radio" name="answer" value="c" onChange={handleInputChange} />
                    <Form.Control placeholder="Answer Choice" name="C" onChange={handleInputChange} value={question.C}></Form.Control>
                  </div>
                  <div>
                    <Form.Check type="radio" name="answer" value="d" onChange={handleInputChange} />
                    <Form.Control placeholder="Answer Choice" name="D" onChange={handleInputChange} value={question.D}></Form.Control>
                  </div>
                </div>

              </Form.Group>
              <Button onClick={addQuestion} block>Add Question to Game</Button>

              <div className="created-questions">
                {allQuestions.map((q, i) => (
                  <div index={i} key={i} className="question">
                    <p>{i + 1}. {q.question}</p>
                    <div className="indent">
                      <p>A: {q.A}</p>
                      <p>B: {q.B}</p>
                      <p>C: {q.C}</p>
                      <p>D: {q.D}</p>
                      <p>Correct Answer: {q.answer}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={handleSubmit} className="create-game-btn" type="submit">Start Game</Button>

            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateQuestions;
