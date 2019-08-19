# -*- coding: utf-8 -*-
# @Time    : 2019-08-15 17:18
# @Author  : Kelly
# @Email   : 289786098@qq.com
# @File    : news.py.py
# @Description:主模块

# all the imports
import os
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash

app = Flask(__name__, instance_path='/Users/henry/Documents/application/newsExtract/instance/folder')
app.config['SECRET_KEY'] = '123456'

def connect_db():
    """Connects to the specific database."""
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv

@app.route('/')
def hello_world():
    return render_template('input.html')

@app.route('/login', methods=['POST'])
def login():
    print('login')
    error = None
    if request.method == 'POST' :
        if request.form['username'] != 'admin' or \
                request.form['password'] != 'secret':
            error = 'Invalid credentials'
        else:
            flash('You were successfully logged in')
            return redirect(url_for('index'))

    flash('You were successfully logged in')
    return render_template('login.html', error=error)

@app.route('/testredirect')
def index():
    return redirect(url_for('login'))

def log_the_user_in():pass
def valid_login():pass

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('show_entries'))

@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404


@app.route('/test/')
@app.route('/test/<name>')
def show_template(name=None):
    return render_template('test.html',name=name)

@app.route('/test/<int:post_id>')
def show_template2(post_id=None):
    return render_template('test.html',post_id=post_id)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=9990,
        debug=True#Flask配置文件在开发环境中，在生产线上的代码是绝对不允许使用debug模式，正确的做法应该写在配置文件中，这样我们只需要更改配置文件即可但是你每次修改代码后都要手动重启它。这样并不够优雅，而且 Flask 可以做到更好。如果你启用了调试支持，服务器会在代码修改后自动重新载入，并在发生错误时提供一个相当有用的调试器。
    )

