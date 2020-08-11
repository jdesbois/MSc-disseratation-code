# MSc-dissertation-code: Paired Kidney Exchange Graph Visualisation App

## Purpose
This app was designed in order to faciliate the visualising of data associated with Paired Kidney Exchanges. We present the data as a graph with a donor/recipient pair as a vertex and the associated potential match between donor -> recipient as an edge netween each vertex.

The app is able to take a specific JSON or XML file datsaset, plot this data set using the VisJs library as a network. 
Once the intial graph is plot a request to the kidney optimal matching algorithm can be made and the resulting matching data plot onto the initial graph.
