# -*- coding: utf-8 -*-
"""
Created on Fri Sep 16 16:35:06 2022

@author: timeyer
"""
# install package for sentiment analysis

# !pip install germansentiment

# If a better model will be found -> import this and change the output of the get_sentiment function

from germansentiment import SentimentModel
import pandas as pd

# initiale model 
model = SentimentModel()

# import .json file and create list of municipalities
json_file = 'gemeinde_category_sentences_4.json'
df = pd.DataFrame(pd.read_json(json_file))

#############################
# control panel for columns

municipality = 'gemeinde'
category = 'kategorie'
sentences = 'sentences'

#############################

# dictionary for sentiment scores
dict_score = {'negative': -1, 'neutral': 1, 'positive': 2}

# define function for sentiments and score
def get_sentiment(item_list):
    if not item_list:
        return []
    else:
        return model.predict_sentiment(item_list)

def count_sentiment(item_list, sentiment):
    assert sentiment in ['negative', 'neutral', 'positive'], 'This sentiment ist not allowed. It has to be positive, neutral or negative'
    
    if not item_list:
        return 0
    else:
        return item_list.count(sentiment)

def score(item_list):
    if not item_list:
        return 0
    else:
        score = 0
        for item in item_list:
            score += dict_score[item]
        return score
    
# create columns for count and score
df.insert(2, 'keyword count', df[sentences].apply(lambda x: len(x)))
df['keyword sentiments'] = df[sentences].apply(lambda x: get_sentiment(x))
df.insert(3, 'negative', df['keyword sentiments'].apply(lambda x: count_sentiment(x, 'negative')))
df.insert(4, 'neutral', df['keyword sentiments'].apply(lambda x: count_sentiment(x, 'neutral')))
df.insert(5, 'positive', df['keyword sentiments'].apply(lambda x: count_sentiment(x, 'positive')))
df.insert(6, 'keyword score (-1,1,2)', df['keyword sentiments'].apply(lambda x: score(x)))
        

# create dataframe and delete unneeded columns
df_results = df.copy()
df_results.drop(['keyword sentiments'], axis=1, inplace=True)

# save dataframe to .json and .csv files
df_results.to_json('results.json')
df_results.to_csv('results.csv')