import sqlalchemy as sql
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer, Float
from config import user, password

import pandas as pd

Base = declarative_base()

# create schema
class Champion(Base):
    __tablename__ = 'champions'
    year = Column(Integer, primary_key=True)
    team = Column(String)

class SeasonStats(Base):
    __tablename__ = 'season_stats'
    stat_id = Column(Integer, primary_key=True)
    season = Column(Integer)
    team = Column(String)
    conf = Column(String)
    div = Column(String)
    wins = Column(Integer)
    losses = Column(Integer)
    win_loss_pct = Column(Float)
    mov = Column(Float)
    ortg = Column(Float)
    drtg = Column(Float)
    nrtg = Column(Float)
    mov_adj = Column(Float)
    ortg_adj = Column(Float)
    drtg_adj = Column(Float)
    nrtg_adj = Column(Float)

# initialize database connection
db_name = 'nba_db'
engine = sql.create_engine(f'postgresql://{user}:{password}@localhost/{db_name}')
conn = engine.connect()

# create tables
Base.metadata.create_all(engine)

# read in csv data
champions_list_csv = "Data/champions_list.csv"
season_stats_csv = "Data/all_stats.csv"

# clean champions data and load to database
champions_df = pd.read_csv(champions_list_csv)
clean_champions_df = champions_df.rename(columns={'Year':'year', 'Team':'team'}).set_index('year')
clean_champions_df.to_sql('champions', con=engine, if_exists='append')

# clean season data and load to database
season_stats_df = pd.read_csv(season_stats_csv)
clean_df = season_stats_df.dropna().reset_index(drop=True)
stats_df = clean_df.rename(columns={
    'Season': 'season', 
    'Team': 'team', 
    'Conf': 'conf', 
    'Div': 'div', 
    'W': 'wins', 
    'L': 'losses', 
    'W/L%': 'win_loss_pct', 
    'MOV': 'mov', 
    'ORtg': 'ortg',
    'DRtg': 'drtg', 
    'NRtg': 'nrtg', 
    'MOV/A': 'mov_adj', 
    'ORtg/A': 'ortg_adj', 
    'DRtg/A': 'drtg_adj',
    'NRtg/A': 'nrtg_adj'})

stats_df.index.name ='stat_id'
stats_df.to_sql('season_stats', con=engine, if_exists='append')
