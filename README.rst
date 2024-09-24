=============================================
Time Series Data Handling and API Development
=============================================

Task Description
----------------

Turbine 1: https://nextcloud.turbit.com/s/GTbSwKkMnFrKC7A
Turbine 2: https://nextcloud.turbit.com/s/G3bwdkrXx6Kmxs3

Load time series data from the CSV files above into a MongoDB collection 
and make the data accessible through the FastAPI.

1. Data Preparation and Loading into MongoDB
Develop a python script to read the data from the CSV files and load it into a single MongoDB collection.

2. Add FastAPI Endpoint
Add an FastAPI endpoint that allows to retrieve the data based on turbine id and time ranges

3. Create a Webapp
Use React to create a power curve plot (power over wind speed) where one can adjust the plotting date range.


Local Development
-----------------

To create a python virtual environment:

.. code-block:: bash

    pyenv install 3.12.3
    pyenv local 3.12.3
    python3 -m venv .venv
    source .venv/bin/activate

To install the dependencies:

.. code-block:: bash

    pip install -r requirements.txt


To run MongoDB locally, you can use Docker. MongoDB will be available at `mongodb://root:example@localhost:27017`.:

.. code-block:: bash

    docker compose up -d


To run the FastAPI application, use `uvicorn`. To test the app, you can visit `http://localhost:8000/docs`:

.. code-block:: bash

    uvicorn app.main:app --reload

To run the data retrieval script:

.. code-block:: bash

    python data_retrieval/load_data.py


To tear down the MongoDB container, use the following command:

.. code-block:: bash

    docker compose down


To run the react app, use the following command. The power curve app will be available at `http://localhost:3000`.:

.. code-block:: bash

    cd power-curve-app
    npm start
