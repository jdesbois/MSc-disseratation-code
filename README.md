# MSc-dissertation-code: Paired Kidney Exchange Graph Visualisation App

## Purpose
This app was designed in order to faciliate the visualising of data associated with Paired Kidney Exchanges. We present the data as a graph with a donor/recipient pair as a vertex and the associated potential match between donor -> recipient as an edge netween each vertex.

The app is able to take a specific JSON or XML file datsaset, plot this data set using the VisJs library as a network. 
Once the intial graph is plot a request to the kidney optimal matching algorithm can be made and the resulting matching data plot onto the initial graph.


## Running Application
In order to run the application you must first make sure you have Node and NPM installed, you can do this by following the node official documentation. 
Once installed download the code repo as you normal would, navigate to the folder containing the package.json and run npm install, this should install all the necessary dependencies to run the application.

Once the initial install is complete to run the development branch of the application you can type npm run dev or for the production branch type npm start. 

You should be provided with an address in which to access the running application.


## Deployment
The application is currently deployed on the free tier of Heroku Application Platform and can be accessed via https://pke-graph-visualiser.herokuapp.com
