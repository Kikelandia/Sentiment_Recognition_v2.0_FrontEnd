import React, { Component } from "react";
import Webcam from 'react-webcam';
import { Link } from "react-router-dom";
import io from 'socket.io-client'

/*
#Date-----------User--------------------Change-----------
#16/06/2021     Enrique Ramos Garcia    Original creation
#--------------------------------------------------------


WebcamPage component
Developed using React, React WebCam and Web Sockets

Used to open WebCam get current screenshot and sent it to the backend
Backend will respond with a base 64 encoded image which will be rendered in
an image tag
*/

class WebcamPage extends Component{
  constructor(props) {
    super();
    this.startWebCam = this.startWebCam.bind(this);
    this.stopWebCam = this.stopWebCam.bind(this);
    this.socket = null;
    this.webcam = null;
    this.windowInterval = null;
    this.imageToPredict = "";
    this.imageWithPrediction = null;
    this.showJsTnsrFlwDtction = false ;
    this.state = {
      webcamActive : false,
      startButtonDisabled : false,
      stopButtonDisabled : true,
      finalImage : null
    }
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  startWebCam() {
  this.socket = io('http://127.0.0.1:5000');
    this.setState(
      {
        startButtonDisabled : true,
        webcamActive : true,
        stopButtonDisabled : false
      })
    this.socket.on('connect', function(){
      //console.log('Connected... ', this.connected);
    });
    const FPS = 24;

    this.windowInterval = setInterval(() => {
      if (this.state.webcamActive){
        this.imageToPredict = this.webcam.getScreenshot();
      }
      if (this.imageToPredict){
        this.socket.emit('fullImage', this.imageToPredict);
      }
    }, 10000/FPS);
    this.socket.on('response_back', (image) => {
      this.setState(
        {
          finalImage : image
        });
    });
  };

  stopWebCam(){
    this.setState(
      {
        startButtonDisabled : false,
        stopButtonDisabled : true,
        webcamActive : false,
        finalImage : null
      })
    this.imageToPredict = null;
    this.socket.close();
    clearInterval(this.windowInterval)
    this.showJsTnsrFlwDtction = true;
  };

  componentWillUnmount(){
    this.setState(
      {
        startButtonDisabled : false,
        stopButtonDisabled : true,
        webcamActive : false,
        finalImage : null
      })
    if (this.socket !== null){
      this.socket.close();
    }
    clearInterval(this.windowInterval)
  }

  render() {
    let webcamComp = null;
    let renderJsFaceDetLink = null;

    if (this.state.webcamActive){
      webcamComp = <Webcam
        ref = {this.setRef}
        audio = {false}
        height = {360}
        screenshotFormat = "image/jpeg"
      />
    }

    if (this.showJsTnsrFlwDtction){
      renderJsFaceDetLink =
      <div>
        Try it with TensorFlow face detection for JS
        <br/>
        <Link
          to = "/tensorFlowDetection"
          >TensorFlow
        </Link>
        <br/>
        <br/>
        <Link
          to = "/faceApi"
          >Face Api
        </Link>
      </div>
    }
    return (
      <div className = "videosContainer">
        <div>
          {webcamComp}
          <br/>
          <button
            className = "WebCamButton"
            onClick = {this.startWebCam}
            disabled = {this.state.startButtonDisabled}
          >Start Analysis
          </button>
          <button
            className = "WebCamButton"
            onClick = {this.stopWebCam}
            disabled = {this.state.stopButtonDisabled}
          >Stop
          </button>
        </div>
        <div className = 'videoResponse'>
          {this.state.finalImage ?
            <img
              src = {`data:image/jpeg;base64,${this.state.finalImage}`}
              id = "imagePrediction" alt = "Final Prediction"
              />
            : ''
          }
        </div>
        {renderJsFaceDetLink}
      </div>
    )
  }
}

export default WebcamPage;
