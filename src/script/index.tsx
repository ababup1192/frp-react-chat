// import Style Sheet
import "../style/main.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import * as Bacon from "baconjs";
import { List } from "immutable";
import { firebaseConfig } from "./config";

import App from "./components/App";
import Dispatcher from "./actionCreators/dispatcher";
import { IMessage, ChatAction } from "./actionCreators/chatAction";
import NameAction from "./actionCreators/nameAction";
import ContentAction from "./actionCreators/contentAction";

Firebase.initializeApp(firebaseConfig);
const chatRef = Firebase.database().ref("chat");

const storageName = window.localStorage.getItem("name");

const dispatcher = new Dispatcher();
const chatAction = new ChatAction(dispatcher, chatRef);
const chatProperty = chatAction.createProperty();
const nameAction = new NameAction(dispatcher, storageName === null ? "you" : storageName);
const nameProperty = nameAction.createProperty();
const contentAction = new ContentAction(dispatcher);
const contentProperty = contentAction.createProperty();


Bacon.onValues(chatProperty, nameProperty, contentProperty,
    (messages: List<IMessage>, name: string, content: string) => {
        const props = { chatAction, messages, nameAction, name, contentAction, content };

        ReactDOM.render(<App {...props} />, document.getElementById("content"));
    });

chatRef.on("child_added", (snapShot) => {
    const message: IMessage = snapShot.val();
    chatAction.pushMessage(message);
});