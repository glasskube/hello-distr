from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from os import environ

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DB_URL')

# Enable CORS for development
@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

db = SQLAlchemy(app)

class Message(db.Model):
  __tablename__ = 'messages'

  id = db.Column(db.Integer, primary_key=True)
  text = db.Column(db.String(80), unique=True, nullable=False)

  def json(self):
    return {'id': self.id, 'text': self.text}

def init_db():
  """Initialize the database tables. Called on first request."""
  try:
    with app.app_context():
      db.create_all()
  except Exception as e:
    print(f"Database initialization error: {e}")

@app.before_request
def before_first_request():
  """Create tables before handling the first request."""
  if not hasattr(app, '_db_initialized'):
    init_db()
    app._db_initialized = True

@app.route('/health', methods=['GET'])
def health():
  """Health check endpoint."""
  try:
    # Try to ping the database
    db.session.execute(db.text('SELECT 1'))
    return make_response(jsonify({'status': 'healthy', 'database': 'connected'}), 200)
  except Exception as e:
    return make_response(jsonify({'status': 'unhealthy', 'database': 'disconnected', 'error': str(e)}), 500)

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
