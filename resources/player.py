import datetime
from flask_restful import Resource, reqparse
from bson import json_util
from bson.objectid import ObjectId
from db import mongo

import traceback


class PlayerCreator(Resource):
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
        data = PlayerCreator.parser.parse_args()

        # check to see that the given game Id exists
        try:
            game = mongo.db.games.find_one({"_id": ObjectId(data['game_id'])})
        except:
            return {'message': 'An error occured trying to look up this Game'}, 500

        if not game:
            return {'message': 'Game not found. game_id must be a Game that exists.'}, 404

        if game['game_state'] != 'waiting':
            return {'message': 'This Game is no longer allowing Players to join'}, 400

        # create the Player
        try:
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

        # add the Player to the game
        try:
            mongo.db.games.update_one({"_id": ObjectId(data['game_id'])}, {
                                      "$set": {"players": game['players'] + [str(player_id)]}})
        except:
            return {'message': 'An error occured trying to update this Game with the new Player'}, 500

        return json_util._json_convert(player_created), 201

# TODO: add resource for getting/deleting multiple players


class Player(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('answer',
                        type=str,
                        required=True,
                        help="answer field cannot be left blank!"
                        )

    def get(self, id):
        player = mongo.db.players.find_one({"_id": ObjectId(id)})
        if player:
            return json_util._json_convert(player), 200
        return {'message': 'Player not found'}, 404

    def put(self, id):
        data = Player.parser.parse_args()
        data['answer_time'] = datetime.datetime.now()

        # TODO: update answer and answer_time
        try:
            player = mongo.db.players.find_one({"_id": ObjectId(id)})
        except:
            return {'message': 'An error occured trying to look up this Player'}, 500

        if not player:
            return {'message': 'Player not found'}, 404

        # TODO: calculate the points based on question start time in games cur_question_start_time
        try:
            game = mongo.db.games.find_one(
                {"_id": ObjectId(player['game_id'])})
        except:
            return {'message': 'An error occured trying to look up this Game'}, 500

        # check the answers to see if they are correct
        data['points'] = 0
        data['is_correct'] = False

        print(game['questions'][game['cur_question']]['answer'])
        print(data['answer'])
        print(data['answer_time'])
        print(game['cur_question_end_time'])

        print(game['questions'][game['cur_question'] - 1]['answer'] ==
              data['answer'] and data['answer_time'] < game['cur_question_end_time'])

        if game['questions'][game['cur_question']]['answer'] == data['answer'] and data['answer_time'] < game['cur_question_end_time']:
            # TODO: further define point values
            data['points'] = player['points'] + 1
            data['is_correct'] = True

        try:
            mongo.db.players.update_one({"_id": ObjectId(id)}, {
                "$set": {"answer": data['answer'], "points": data['points']}})
        except:
            traceback.print_exc()
            return {'message': 'An error occured trying to update this Player with the answer'}, 500

        print(game['next_question_start_time'])

        return json_util._json_convert({
            "is_correct": data['is_correct'],
            "points": data['points'],
            "next_question_start_time": game['next_question_start_time'],
            "next_question_end_time": game['next_question_end_time'],
        }), 200

    def delete(self, id):
        # TODO: delete user from db
        return


class PlayerList(Resource):
    def get(self, game_id):
        # TODO: look up players that with a specific game_id
        return

    def delete(self, game_id):
        # TODO: look up players that with a specific game_id and delete them
        return
