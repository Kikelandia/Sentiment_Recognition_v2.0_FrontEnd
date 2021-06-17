import React from "react";
//Do not delete the next line TF model "facemesh" depends on it to load correctly
import * as tf from "@tensorflow/tfjs";
import * as faceApi from '@vladmandic/face-api';

/*
#Date-----------User--------------------Change-----------
#16/06/2021     Enrique Ramos Garcia    Original creation
#--------------------------------------------------------

FaceApiDetector component

faceApi developed by Vincent Mühler(justadudewhohacks)
code available: https://github.com/justadudewhohacks/face-api.js

Created at the top of the tensorflow.js core API (tensorflow/tfjs-core)

Main page for faceApi model available here:
https://justadudewhohacks.github.io/face-api.js/docs/index.html

Implemented inside this app in order to compare functionalities, differences,
similarities, accuracy, induced bias and other Data Science related topics.

*/

const expressionMap = {
  neutral: "😶",
  happy: "😄",
  sad: "😞",
  angry: "🤬",
  fearful: "😖",
  disgusted: "🤢",
  surprised: "😲"
};


class FaceApiDetector extends React.Component {
  video = React.createRef();

  mounted = false

  state = { expressions: [] };

  componentDidMount() {
    this.mounted = true;
    this.run();
  }

  componentWillUnmount(){
    this.mounted = false;
    this.mediaStream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  log = (...args) => {
    //console.log(...args);
  };

  run = async () => {
    this.log("run started");
    try {
      await faceApi.nets.tinyFaceDetector.load("/models/");
      await faceApi.loadFaceExpressionModel(`/models/`);
      await faceApi.nets.ssdMobilenetv1.loadFromUri('/models')
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });

      this.video.current.srcObject = this.mediaStream;
    } catch (e) {
      this.log(e.name, e.message, e.stack);
    }
  };

  onPlay = async () => {
    if (this.mounted){
      if (
        this.video.current.paused ||
        this.video.current.ended ||
        !faceApi.nets.tinyFaceDetector.params
      ) {
        setTimeout(() => this.onPlay());
        return;
      }


      const result = await faceApi
        .detectAllFaces(this.video.current).withFaceExpressions();

      if (result[0]) {
        this.log(result);
        const expressions = []
        Object.entries(result[0].expressions).forEach(
          (emotion) => {expressions.push(
            [expressionMap[emotion[0]],emotion[1]]);
          }
        );
        this.setState(() => ({ expressions }));
      }

      setTimeout(() => this.onPlay(), 1000);
    }
  };

  render() {
    return (
      <div className="App">
        <h1>Face Recognition Webcam</h1>
        <div>
          {this.state.expressions
            .sort((a, b) => b[1] - a[1])
            .filter((_, i) => i < 3)
            .map(([e, w]) => (
              <p key={e + w}>
                {e} {w}
              </p>
            ))}
        </div>
        <div style={{ position: "relative" }}>
          <video
            height="360"
            ref={this.video}
            autoPlay
            muted
            onPlay={this.onPlay}
            style={{
              position: "absolute",
              width: "100%",
              height: "360",
              left: 0,
              right: 0,
              bottom: 0,
              top: 0
            }}
          />
        </div>
      </div>
    );
  }
}

export default FaceApiDetector;
