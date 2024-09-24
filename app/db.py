from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection


client: MongoClient = MongoClient("mongodb://root:example@localhost:27017")
db: Database = client["mydatabase"]
collection: Collection = db["turbines"]
