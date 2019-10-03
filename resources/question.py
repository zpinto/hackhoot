from flask_restful import Resource, reqparse
from bson import json_util
from bson.objectid import ObjectId
from db import mongo
import traceback


class QuestionCreator(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('question',
                        type=str,
                        required=True,
                        help="Questions field cannot be left blank!"
                        )
    parser.add_argument('A',
                        type=str,
                        required=True,
                        help="A field cannot be left blank!"
                        )
    parser.add_argument('B',
                        type=str,
                        required=True,
                        help="B field cannot be left blank!"
                        )
    parser.add_argument('C',
                        type=str,
                        required=True,
                        help="C field cannot be left blank!"
                        )
    parser.add_argument('D',
                        type=str,
                        required=True,
                        help="D field cannot be left blank!"
                        )
    parser.add_argument('answer',
                        type=str,
                        required=True,
                        help="answer field cannot be left blank!"
                        )

    def post(self):
        data = QuestionCreator.parser.parse_args()

        try:
            # try **data later
            question_id = mongo.db.questions.insert_one({
                "question": data['question'],
                "A": data['A'],
                "B": data['B'],
                "C": data['C'],
                "D": data['D'],
                "answer": data['answer']
            }).inserted_id
            question_created = mongo.db.questions.find_one(
                {"_id": question_id})
        except:
            return {'message': 'An error occured inserting the Question'}, 500

        return json_util._json_convert(question_created), 201


class Question(Resource):
    def get(self, id):
        try:
            question = mongo.db.questions.find_one({"_id": ObjectId(id)})
        except:
            return {'message': 'An error occured trying to look up this Question'}, 500

        if question:
            return json_util._json_convert(question), 200
        return {'message': 'Question not found'}, 404

    def delete(self, id):
        try:
            question = mongo.db.questions.find_one({"_id": ObjectId(id)})
        except:
            return {'message': 'An error occured trying to look up this Question'}, 500

        if question:
            try:
                mongo.db.questions.delete_one({"_id": ObjectId(id)})
            except:
                return {'message': 'An error occured trying to delete this Question'}, 500
            return {'message': 'Question was deleted'}, 200
        return {'message': 'Question not found'}, 404


class QuestionList(Resource):
    def get(self):
        try:
            questions = mongo.db.questions.find()
        except:
            return {'message': 'An error occured trying to look up these Questions'}, 500

        return json_util._json_convert(questions), 200

    def post(self):
        # TODO: make a post for creating lists of questions at once
        return 

# class QuestionSetRegister(Resource):
#     parser = reqparse.RequestParser()
#     parser.add_argument('questions',
#                         type=list,
#                         location='json',
#                         required=True,
#                         help="Questions field cannot be left blank!"
#                         )
#     parser.add_argument('name',
#                         type=str,
#                         required=True,
#                         help="Name field cannot be left bank!"
#                         )

#     def post(self):
#         data = QuestionSetRegister.parser.parse_args()

#         for question in data['questions']:
#             if not all(key in question for key in ('question', 'choice1', 'choice2', 'choice3', 'choice4', 'answer')):
#                 return {'message': 'One or more questions is incorrectly formatted'}, 400

#         try:
#             question_set_id = mongo.db.questions.insert_one(
#                 {"name": data['name'], "questions": data['questions']}).inserted_id
#             question_set_created = mongo.db.questions.find_one(
#                 {"_id": question_set_id})
#         except:
#             traceback.print_exc()
#             return {'message': 'An error occured inserting the Question Set'}, 500

#         return json_util._json_convert(question_set_created), 201


# class QuestionSet(Resource):

#     def get(self, id):
#         question_set = mongo.db.questions.find_one({"_id": ObjectId(id)})
#         if question_set:
#             return json_util._json_convert(question_set), 200
#         return {'message': 'Question set not found'}, 404

#     def put(self, id):
#         return

#     def delete(self, id):
#         return
