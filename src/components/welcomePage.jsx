import React, { Component } from "react";
import logo from '../logo.svg';
import '../App.css';
/*
#Date-----------User--------------------Change-----------
#16/06/2021     Enrique Ramos Garcia    Original creation
#--------------------------------------------------------

WelcomePage component for general presentation of the app
*/
class WelcomePage extends Component{
  constructor(props) {
    super();
  }

  render() {
    return (
      <div className = "App-header">
        <h1
          className = "indexDiv"
        >
        Sentiment Recognition
        </h1>
        <div>
            This app was developed in Python using SkLearn, and Flask<br/>
            It is a small step in my path to become a Data Scientist<br/>
            <br/>
            Please click in the "Start Facial Analisis" (Web Camera is needed) link, to start running the app <br/>
            It will use your webcam for real time sentiment prediction, based in your facial expression<br/>
            Due to lack of public facial expressions databases, it is not 100% accurate<br/>
            Currently its accuracy is around 75-80%<br/>
            Model is able to predict the following emotions:<br/>
            <li>Sad</li>
            <li>Anger</li>
            <li>Happy</li>
            <li>Neutral</li>
            <li>Surprised</li>
        </div>
        <div className = "indexDiv">
            <br/>
            App and Sk-Learn Model developed by Enrique Ramos García<br/>
            Any question, feedback or collaboration please contact<br/>
            <br/>
            <a href = "mailto:gilgamesh_0@hotmail.com">gilgamesh_0@hotmail.com</a>
        </div>
          <img
            src = {logo}
            className = "App-logo"
            alt = "logo"
          />
          <a
            className = "App-link"
            href = "https://reactjs.org"
            target = "_blank"
            rel = "noopener noreferrer"
          >Learn React
          </a>
      </div>
    )
  }
}
export default WelcomePage;
