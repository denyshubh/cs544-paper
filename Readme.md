Name: Shubham Kumar Singh
Email: ssing163@binghamton.edu
BU ID: B00955182


This is a paper for cs544 course. This paper covers the web programming framework for 3D animation i.e WebGL. 
I have used Three.js library to use the concepts in WebGl.

[Read The Paper](https://github.com/denyshubh/cs544-paper/blob/main/Paper.md)

## About Codes In This Repository

1. ***[Creating Basic Scene](https://github.com/denyshubh/cs544-paper/tree/main/Basic-scene):***
This is a basic implementation of three.js that shows how we can create scenes, objects and handle camera perspective in three.js. We have used a canvas to draw our 3D model. To be able to display anything with three.js, we need three things: **scene**, **camera** and **renderer**, so that we can render the scene with camera. You can look at the [script.js](https://github.com/denyshubh/cs544-paper/blob/main/Basic-scene/script.js) file for details

2. ***[Runnign Three.js on Vite Server](https://github.com/denyshubh/cs544-paper/tree/main/Basic-scene-on-Vite-Server):*** In terms of final output there is no difference between in the code written above and this one. Only difference is that we are using light weight server called Vite.js to setup our project. It is similar to [Parcel Server](https://parceljs.org/) used on our project.

3. ***[Creating a Magical Portal](https://github.com/denyshubh/cs544-paper/tree/main/Advance-Technique) :*** The goal of this project is to create a visually appealing, interactive 3D scene, inspired by the home page of the [Three.js Journey website](https://threejs-journey.com/). This scene will feature a small landscape with a path leading to a magical portal, surrounded by objects such as fences, trees, and rocks. The project aims to use advance techniques in Three.js and enhance the scene's appearance by employing a technique called **baking**. This method involves saving Ray Tracing renders into textures and using them in WebGL to achieve higher quality visuals. 
The project uses Blender for creating the scene and adding additional details such as a portal effect and fireflies using Three.js.
