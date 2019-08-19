from flask import Flask
from flask import render_template
from flask import request

app = Flask(__name__)


@app.route('/')
def hello_world():
    user_agent = request.headers.get('User_Agent')
    print('user_agent is %s' % user_agent)
    return 'Hello World!'

@app.route('/test/')
@app.route('/test/<name>')
def show_template(name=None):
    return render_template('test.html',name=name)

if __name__ == '__main__':
    app.run(
        #host='0.0.0.0',
        port=9990,
        debug=True

    )
