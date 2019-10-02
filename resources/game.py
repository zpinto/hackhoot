from flask_restful import Resource, reqparse
from bson import json_util
from bson.objectid import ObjectId
from db import mongo


class GameRegister(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('question_set_id',
                        type=str,
                        required=True,
                        help="question_set_id field cannot be left blank!"
                        )
    parser.add_argument('time_limit',
                        type=str,
                        required=True,
                        help="time_limit field cannot be left bank!"
                        )

    def post(self):
        data = GameRegister.parser.parse_args()

        try:
            # need to verify the game_id exists
            game_id = mongo.db.games.insert_one({
                "question_set_id": data['question_set_id'],
                "time_limit": data['time_limit'],
                "cur_question": None,
                "cur_question_start_time": None,
                "players": []
            }).inserted_id
            game_created = mongo.db.games.find_one(
                {"_id": game_id})
        except:
            return {'message': 'An error occured inserting the Player'}, 500

        return json_util._json_convert(game_created), 201


class Game(Resource):

    def get(self, id):
        game = mongo.db.games.find_one({"_id": ObjectId(id)})
        if game:
            return json_util._json_convert(game), 200
        return {'message': 'Game not found'}, 404

    def put(self, id):
        return

    def delete(self, id):
        return
