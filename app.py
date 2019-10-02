from flask import Flask, jsonify
from flask_restful import Api
from flask_pymongo import PyMongo

from resources.question import QuestionSetRegister, QuestionSet

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/kahoot'
api = Api(app)

# api.add_resource(Store, '/store/<string:name>')
# api.add_resource(StoreList, '/stores')
# api.add_resource(Item, '/item/<string:name>')
# api.add_resource(ItemList, '/items')
# api.add_resource(UserRegister, '/register')
# api.add_resource(User, '/user/<int:user_id>')
# api.add_resource(UserLogin, '/login')
# api.add_resource(TokenRefresh, '/refresh')
# api.add_resource(UserLogout, '/logout')

api.add_resource(QuestionSetRegister, '/questionset')
api.add_resource(QuestionSet, '/quetionset/<int:id>')


if __name__ == '__main__':
    from db import mongo
    mongo.init_app(app)
    app.run(port=5000, debug=True)
