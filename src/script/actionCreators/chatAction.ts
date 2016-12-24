import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import { List } from "immutable";
import * as Firebase from "firebase";

const PUSH_MESSAGE = "PUSH_MESSAGE";
const PUSH_CLOUD_MESSAGE = "PUSH_CROUD_MESSAGE";

export interface IMessage {
    name: string;
    content: string;
}

export class ChatAction {
    private d: Dispatcher;
    private chatRef: Firebase.database.Reference;

    constructor(dispatcher: Dispatcher, chatRef: Firebase.database.Reference) {
        this.d = dispatcher;
        this.chatRef = chatRef;
    }

    public pushCouldMessage(message: IMessage) {
        this.d.push(PUSH_CLOUD_MESSAGE, message);
    }

    public pushMessage(message: IMessage) {
        this.d.push(PUSH_MESSAGE, message);
    }

    public createProperty(): Bacon.Property<IMessage, List<IMessage>> {
        return Bacon.update<IMessage, IMessage, List<IMessage>, List<IMessage>>(List<IMessage>(),
            [this.d.stream(PUSH_MESSAGE)], this._pushMessage.bind(this),
            [this.d.stream(PUSH_CLOUD_MESSAGE)], this._pushCloudMessage.bind(this)
        );
    }

    private _pushMessage(oldMessages: List<IMessage>, message: IMessage): List<IMessage> {
        return oldMessages.push(message);
    }

    private _pushCloudMessage(oldMessages: List<IMessage>, message: IMessage): List<IMessage> {
        this.chatRef.push(message);
        return oldMessages;
    }
}