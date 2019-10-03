from flask_restful import Resource, reqparse
from bson import json_util
from bson.objectid import ObjectId
from db import mongo


class PlayerRegister(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('game_id',
                        type=str,
                        required=True,
                        help="game_id field cannot be left blank!"
                        )
    parser.add_argument('name',
                        type=str,
                        required=True,
                        help="Name field cannot be left bank!"
                        )

    def post(self):
        data = PlayerRegister.parser.parse_args()

        try:
            # TODO: need to verify the game_id exists
            player_id = mongo.db.players.insert_one({
                "name": data['name'],
                "game_id": data['game_id'],
                "points": 0,
                "answer": None,
                "answer_time": None
            }).inserted_id
            player_created = mongo.db.players.find_one(
                {"_id": player_id})
        except:
            return {'message': 'An error occured inserting the Player'}, 500

        return json_util._json_convert(player_created), 201

# TODO: add resource for getting/deleting multiple players


class Player(Resource):

    def get(self, id):
        player = mongo.db.players.find_one({"_id": ObjectId(id)})
        if player:
            return json_util._json_convert(player), 200
        return {'message': 'Player not found'}, 404

    def put(self, id):
        # TODO: update answer and answer_time
        # TODO: calculate the points based on question start time in games cur_question_start_time
        return

    def delete(self, id):
        return
