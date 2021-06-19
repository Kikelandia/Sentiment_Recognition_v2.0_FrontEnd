import React from "react";
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

TensorFlowPage component
Developed using React, React WebCam, TensorFlow and Web Sockets

Used to open WebCam get current screenshot and sent it to the backend
Backend will respond with a array(Python list) with the predictions for each face
up to 10 each, prediction will be a string like var
*/

class TensorFlowPage extends React.Component{
  constructor(props) {
    super();
    this.socket = null
    this.webcamRef = React.createRef();
    this.canvasRef = React.createRef();
    this.imageToPredict = null;
    this.localInterval = null;
    this.returnedPrediction = [" "];
  }

  runFacemesh = async () => {
    const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    this.localInterval = setInterval(() => {
      this.detect(net);
      if (this.imageToPredict){
        this.socket.emit('tensorFlowImage', this.imageToPredict);
      };
      this.socket.on('predsList', (array) => {
        this.returnedPrediction = array
      });
    }, 10000/24);
  };

  detect = async (net) => {
    if (
      typeof this.webcamRef.current !== "undefined" &&
      this.webcamRef.current !== null &&
      this.webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = this.webcamRef.current.video;
      const videoWidth = this.webcamRef.current.video.videoWidth;
      const videoHeight = this.webcamRef.current.video.videoHeight;

      // Set video width
      this.webcamRef.current.video.width = videoWidth;
      this.webcamRef.current.video.height = videoHeight;

      // Set canvas width
      this.canvasRef.current.width = videoWidth;
      this.canvasRef.current.height = videoHeight;

      // Make Detections
      const faces = await net.estimateFaces({input:video});

      // Get canvas context
      if (this.canvasRef.current !== null){
        const ctx = this.canvasRef.current.getContext("2d");
        if (faces.length > 0){
          for (let i = 0; i < faces.length; i++) {
            const start = faces[i].boundingBox.topLeft;
            const end = faces[i].boundingBox.bottomRight;
            const size = [end[0] - start[0], end[1] - start[1]];

            ctx.rect(start[0], start[1], size[0], size[1]);
            ctx.fillStyle = "blue";
            ctx.font = "bold 20px sans-serif";
            ctx.fillText( this.returnedPrediction[0], start[0], start[1] );
            ctx.stroke();
            this.imageToPredict = this.webcamRef.current.getScreenshot();
          }
        }
      }
    }
  };

  componentWillUnmount(){
    if (this.socket !== null){
      this.socket.close();
    };
    clearInterval(this.localInterval)
  }

  componentDidMount(){
    this.socket = io('http://127.0.0.1:5000');
    this.runFacemesh();
  }
  render() {
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
              ref={this.webcamRef}
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
              ref={this.canvasRef}
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
}
export default TensorFlowPage;
