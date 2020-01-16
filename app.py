from flask import Flask, render_template, redirect

import sqlalchemy as sql
from config import user, password

db_name = "nba_db"
engine = sql.create_engine(f'postgresql://{user}:{password}@localhost/{db_name}')
conn = engine.connect()

app = Flask(__name__)

@app.route('/')
def index():
    champ_data = [dict(row) for row in conn.execute('SELECT * FROM champions').fetchall()]
    season_data = [dict(row) for row in conn.execute('SELECT * FROM season_stats').fetchall()]

    # Return template and data
    return render_template('index.html', champions = champ_data, season_stats = season_data)

if __name__=="__main__":
    app.run(debug=True)
