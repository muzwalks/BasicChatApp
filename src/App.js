import React, { Component } from "react";
import "./App.css";
import Messages from "./Messages";
import Input from "./Input";

function randomName() {
  const bondGirls = [
    "Honey Ryder",
    "Sylvia Trench",
    "Miss Taro",
    "Tatiana Romanova",
    "Zora",
    "Vida",
    "Pussy Galore",
    "Jill Masterson",
    "Tilly Masterson",
    "Bonita"
  ];

  const bondGirl = bondGirls[Math.floor(Math.random() * bondGirls.length)];
  return bondGirl;
}

function getImageTag() {
  var imageURLs = ["bonita.jpg"];
  let styler = {
    backgroundImage: `url(${imageURLs})`
  };
  //var img = '<img src="bonita.jpg"';
  //var randomIndex = Math.floor(Math.random() * imageURLs.length);
  //img += imageURLs[randomIndex];
  //img += '" alt="Some alt text"/>';
  return styler;
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      image: getImageTag()
    }
  };

  constructor() {
    super();
    this.drone = new window.Scaledrone("x11TBr5LYeFuZg7h", {
      data: this.state.member
    });
    this.drone.on("open", error => {
      if (error) {
        return console.error(error);
      }
      const member = { ...this.state.member };
      member.id = this.drone.clientId;
      this.setState({ member });
    });
    const room = this.drone.subscribe("observable-room");
    room.on("data", (data, member) => {
      const messages = this.state.messages;
      messages.push({ member, text: data });
      this.setState({ messages });
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Murray's basic chat app</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input onSendMessage={this.onSendMessage} />
      </div>
    );
  }

  onSendMessage = message => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  };
}

export default App;
