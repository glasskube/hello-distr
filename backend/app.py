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
    return {'id': self.id, 'text': self.text}

with app.app_context():
  db.create_all()

@app.route('/latest-message', methods=['GET'])
def test():
  try:
    msg = Message.query.order_by(Message.id.desc()).first()
    if msg:
      return make_response(msg.text, 200)
    return make_response('hello distr!', 200)
  except Exception as e:
    print(e)
    return make_response(jsonify({'message': 'error getting message'}), 500)


@app.route('/messages', methods=['POST'])
def create_message():
  try:
    data = request.get_json()
    new_user = Message(text=data['text'])
    db.session.add(new_user)
    db.session.commit()
    return make_response(jsonify({}), 201)
  except Exception as e:
    print(e)
    return make_response(jsonify({'message': 'error creating message'}), 500)
