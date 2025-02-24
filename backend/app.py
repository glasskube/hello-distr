from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from os import environ

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DB_URL')
db = SQLAlchemy(app)

class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(80), unique=True, nullable=False)

    def json(self):
        return {'id': self.id,'text': self.text}

# TODO fix db setup:
# db.create_all()

@app.route('/latest-message', methods=['GET'])
def test():
    # TODO get from db
  return make_response(jsonify({'message': 'test route'}), 200)

@app.route('/message', methods=['POST'])
def create_user():
  try:
    data = request.get_json()
    new_user = Message(text=data['text'])
    db.session.add(new_user)
    db.session.commit()
    return make_response(jsonify({}), 201)
  except e:
    return make_response(jsonify({'message': 'error creating user'}), 500)
