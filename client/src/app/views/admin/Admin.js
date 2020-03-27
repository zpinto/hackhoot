import React, { useState }  from "react";
import { Link } from "react-router-dom";
import './Admin.scss';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Admin() {

  const [gameName, setGameName] = useState();

  function handleSubmit(e) {
    alert(e.target.value)
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
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="game_name">
                <Form.Label>HackHoot Game Name</Form.Label>
                <Form.Control placeholder="Enter Game Name"></Form.Control>
                <Form.Text className="text-muted">
                  Make sure to make it not too scary for the kids
                </Form.Text>
              </Form.Group>
              <Link to="/admin/create-questions">
                <Button type="submit">Create Game</Button>
              </Link>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
