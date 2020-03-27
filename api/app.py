import os

from flask import Flask, jsonify
from flask_restful import Api
from flask_pymongo import PyMongo
from flask_cors import CORS

from resources.question import QuestionCreator, Question, QuestionList
from resources.game import GameCreator, Game
from resources.player import PlayerCreator, PlayerList, Player


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['MONGO_URI'] = os.environ.get(
        'MONGO_URI') or 'mongodb://localhost:27017/kahoot'
    api = Api(app)

    api.add_resource(QuestionCreator, '/createquestion')
    api.add_resource(Question, '/question/<string:id>')
    api.add_resource(QuestionList, '/questions')

    api.add_resource(GameCreator, '/creategame')
    api.add_resource(Game, '/game/<string:id>')

    api.add_resource(PlayerCreator, '/createplayer')
    api.add_resource(PlayerList, '/player/game/<string:game_id>')
    api.add_resource(Player, '/player/<string:id>')

    from db import mongo
    mongo.init_app(app)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(port=5000, debug=True)
