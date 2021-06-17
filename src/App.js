import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import WelcomePage from "./components/welcomePage"
import WebcamPage from "./components/openWebcamSendStreaming"
import TensorFlowDetectionPage from "./components/webcamTensorFlowComp"
import FaceApiDetector from "./components/faceApiComp"
import './App.css';

/*
#Date-----------User--------------------Change-----------
#16/06/2021     Enrique Ramos Garcia    Original creation
#--------------------------------------------------------

App developed to intereact with final user through WebCam
In all components main WebCam will open and depending on the component it will
send the complete camera screenshot or work with a TensorFlow prebuilt model

Class App main application componet used to load the availables routes
to navigate
*/
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      //Router creation with all the respective paths for each component
      <Router>
        <Switch>
            <Route exact path = "/" >
              <Link
                to = "/startStreaming"
                label = "startStreaming"
                className = "App-link"
              > Start Facial Analisis
              </Link>
              <WelcomePage />
            </Route>
            <Route path = "/startStreaming">
              <Link
                to = "/"
                className = "App-link"
              > Back Home
              </Link>
              <WebcamPage />
            </Route>
            <Route path = "/tensorFlowDetection">
              <TensorFlowDetectionPage />
            </Route>
            <Route path = "/faceApi">
              <FaceApiDetector />
            </Route>
          </Switch>
      </Router>
    );
  }
}

export default App;
