from flask_restful import Resource, reqparse
from bson import json_util
from bson.objectid import ObjectId
from db import mongo

import datetime
import traceback
import random


class GameCreator(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('time_limit',
                        type=int,
                        required=True,
                        help="time_limit field cannot be left bank!"
                        )

    def post(self):
        data = GameCreator.parser.parse_args()

        try:
            count = mongo.db.questions.count()
            if count < 1:
                return {'message': 'No questions found'}, 500
            question_indices = random.sample(range(count),min(10, count))
            questions_db = mongo.db.questions.find()
            questions = [questions_db[x]
                for x in range(0,count)
                if x in question_indices]

            game_id = mongo.db.games.insert_one({
                "time_limit": data['time_limit'],
                "game_state": "waiting",
                "questions": questions,
                "players": [],
                "cur_question": -1,
                "cur_time": datetime.datetime.now(),
                "cur_question_end_time": datetime.datetime.now() + datetime.timedelta(seconds=data['time_limit']),
                "next_question_start_time": datetime.datetime.now() + datetime.timedelta(seconds=60),
                "next_question_end_time": datetime.datetime.now() + datetime.timedelta(seconds=(60 + data['time_limit']))
            }).inserted_id
            game_created = mongo.db.games.find_one({"_id": game_id})
        except:
            return {'message': 'An error occured creating the Game'}, 500

        return json_util._json_convert(game_created), 201


class Game(Resource):

    def get(self, id):
        try:
            game = mongo.db.games.find_one({"_id": ObjectId(id)})
        except:
            return {'message': 'An error occured trying to look up this Game'}, 500
        if game:
            return json_util._json_convert(game), 200
        return {'message': 'Game not found'}, 404

    # this move the game to the next question
    def put(self, id):
        try:
            game = mongo.db.games.find_one({"_id": ObjectId(id)})
        except:
            return {'message': 'An error occured trying to look up this Game'}, 500

        if not game:
            return {'message': 'Game not found'}, 404

        updates = {}
        # increment the cur_question
        updates['cur_question'] = game['cur_question'] + 1
        # if the game state is waiting, then change it to active
        if game['game_state'] == 'waiting':
            updates['game_state'] = 'active'
        # if the game state is active and the cur_question is not <= to the length of questions, then change the game state to done
        if game['game_state'] == 'active' and updates['cur_question'] >= len(game['questions']):
            updates['game_state'] = 'done'
        # set the cur_question_end_time equal to time_limit seconds after the current time
        # set the next_question_time equal to time_limit + 10 seconds after the current time
        updates['cur_time'] = datetime.datetime.now()
        updates['cur_question_end_time'] = datetime.datetime.now(
        ) + datetime.timedelta(seconds=game['time_limit'])
        updates['next_question_start_time'] = datetime.datetime.now(
        ) + datetime.timedelta(seconds=(game['time_limit'] + 10))
        updates['next_question_end_time'] = updates['next_question_start_time'] + \
            datetime.timedelta(seconds=game['time_limit'])

        try:
            mongo.db.games.update_one({"_id": ObjectId(id)}, {"$set": updates})
        except:
            return {'message': 'An error occured trying to update this Game'}, 500

        try:
            new_game = mongo.db.games.find_one({"_id": ObjectId(id)})
        except:
            return {'message': 'An error occured trying to look up this Game'}, 500

        return json_util._json_convert(new_game), 200

    def delete(self, id):
        try:
            game = mongo.db.games.find_one({"_id": ObjectId(id)})
        except:
            return {'message': 'An error occured trying to look up this Game'}, 500

        if game:
            try:
                mongo.db.games.delete_one({"_id": ObjectId(id)})
            except:
                return {'message': 'An error occured trying to delete this Game'}, 500
            return {'message': 'Game was deleted'}, 200
        return {'message': 'Game not found'}, 404
