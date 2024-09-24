"""This script downloads CSV files from a specified URL and inserts the data into a MongoDB collection."""

import pandas as pd
import requests
from io import BytesIO
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection


mongo_client: MongoClient = MongoClient("mongodb://root:example@localhost:27017")
db: Database = mongo_client["mydatabase"]
collection: Collection = db["turbines"]

csv_urls = [
    "https://nextcloud.turbit.com/s/GTbSwKkMnFrKC7A/download/Turbine1.csv",
    "https://nextcloud.turbit.com/s/G3bwdkrXx6Kmxs3/download/Turbine2.csv",
]

for url in csv_urls:
    response = requests.get(url)
    if response.status_code == 200:

        csv_data = BytesIO(response.content)

        df = pd.read_csv(
            csv_data, header=[0, 1], sep=None, engine="python", quotechar='"'
        )

        # format the column names with trailing spaces and units
        df.columns = pd.Index(
            [
                (
                    f"{col[0].strip()}({col[1].strip()})".strip()
                    if f"{col[1].strip()}"
                    else f"{col[0].strip()}"
                )
                for col in df.columns
            ]
        )

        df["turbine_id"] = url.rsplit("/")[-1].split(".")[0]
        df["Dat/Zeit"] = pd.to_datetime(df["Dat/Zeit"], format="%d.%m.%Y, %H:%M")

        data_dict = df.to_dict("records")

        collection.insert_many(data_dict)
        print(f"Inserted {len(data_dict)} records into the MongoDB collection.")
    else:
        print(f"Failed to download the CSV file. Status code: {response.status_code}")
