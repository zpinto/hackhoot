from flask import Flask, jsonify
from flask_restful import Api
from flask_pymongo import PyMongo

from resources.question import QuestionCreator, Question, QuestionList
from resources.game import GameCreator, Game

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/kahoot'
api = Api(app)

api.add_resource(QuestionCreator, '/createquestion')
api.add_resource(Question, '/question/<string:id>')
api.add_resource(QuestionList, '/questions')

api.add_resource(GameCreator, '/creategame')
api.add_resource(Game, '/game/<string:id>')


if __name__ == '__main__':
    from db import mongo
    mongo.init_app(app)
    app.run(port=5000, debug=True)
