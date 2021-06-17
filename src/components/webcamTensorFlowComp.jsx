import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import io from 'socket.io-client'

//Do not delete the next line TF model "facemesh" depends on it to load correctly
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";

/*
#Date-----------User--------------------Change-----------
#16/06/2021     Enrique Ramos Garcia    Original creation
#--------------------------------------------------------

TensorFlowDetectionPage funtional component
Developed using React, React WebCam, Web Sockets and tensorflow pre-trained models

Used to open WebCam find faces inside the picture and surround them with a rectangle
Then the component will send the complete picture to the back end to analyze it
With the Sk-Learn model which is not related to TensorFlow,
Back end will respond with an array(Python list) with up to 10 predictions.

*/

function TensorFlowDetectionPage (props){
  const socket = io('http://127.0.0.1:5000');

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var imageToPredict = null;
  var localInterval = null;

  let returnedPrediction = [];

  const runFacemesh = async () => {
    const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    localInterval = setInterval(() => {
      detect(net);
      if (imageToPredict){
        socket.emit('tensorFlowImage', imageToPredict);
      };
      socket.on('predsList', (array) => {
        returnedPrediction = array
      });
    }, 10000/24);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const faces = await net.estimateFaces({input:video});

      // Get canvas context
      if (canvasRef.current !== null){
        const ctx = canvasRef.current.getContext("2d");
        if (faces.length > 0){
          for (let i = 0; i < faces.length; i++) {
            const start = faces[i].boundingBox.topLeft;
            const end = faces[i].boundingBox.bottomRight;
            const size = [end[0] - start[0], end[1] - start[1]];

            ctx.rect(start[0], start[1], size[0], size[1]);
            //ctx.stroke();
            ctx.fillStyle = "blue";
            ctx.font = "bold 20px sans-serif";
            ctx.fillText( returnedPrediction[0], start[0], start[1] );
            ctx.stroke();
            imageToPredict = webcamRef.current.getScreenshot();
          }
        }
      }
    }
  };

  useEffect(() => {
        runFacemesh();
        return () => {
          console.log(localInterval)
          if (socket !== null){
            socket.close();
          };
          localInterval = null;
        }
    }, [])

  return(
    <div>
      <div>
        <Link
          to = "/"
          className = "App-link"
          >Home
        </Link>
        <Link
          to = "/startStreaming"
          label = "startStreaming"
          className = "App-link"
          >SkLearn Model
        </Link>
      </div>
        <br/>
      <div>
        <header className="App-header">
          <Webcam
            ref={webcamRef}
            audio = {false}
            height = {360}
            screenshotFormat = "image/jpeg"
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: 640,
              height: 480,
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: 640,
              height: 480,
            }}
          />
        </header>
      </div>
    </div>
  )
}

export default TensorFlowDetectionPage;
