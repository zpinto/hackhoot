from flask_restful import Resource, reqparse
from bson import json_util
from bson.objectid import ObjectId
from db import mongo
import traceback


class QuestionSetRegister(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('questions',
                        type=list,
                        location='json',
                        required=True,
                        help="Questions field cannot be left blank!"
                        )
    parser.add_argument('name',
                        type=str,
                        required=True,
                        help="Name field cannot be left bank!"
                        )

    def post(self):
        data = QuestionSetRegister.parser.parse_args()

        for question in data['questions']:
            if not all(key in question for key in ('question', 'choice1', 'choice2', 'choice3', 'choice4', 'answer')):
                return {'message': 'One or more questions is incorrectly formatted'}, 400

        try:
            question_set_id = mongo.db.questions.insert_one(
                {"name": data['name'], "questions": data['questions']}).inserted_id
            question_set_created = mongo.db.questions.find_one(
                {"_id": question_set_id})
        except:
            traceback.print_exc()
            return {'message': 'An error occured inserting the Question Set'}, 500

        return json_util._json_convert(question_set_created), 201


class QuestionSet(Resource):

    def get(self, id):
        question_set = mongo.db.questions.find_one({"_id": ObjectId(id)})
        print("I got to the get")
        if question_set:
            return json_util._json_convert(question_set), 200
        return {'message': 'Question set not found'}, 404

    def put(self, id):
        return

    def delete(self, id):
        return
