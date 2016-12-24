import * as React from "react";
import * as ReactDOM from "react-dom";
import { List, Range } from "immutable";
import { IMessage, ChatAction } from "../actionCreators/chatAction";
import NameAction from "../actionCreators/nameAction";
import ContentAction from "../actionCreators/contentAction";

interface IAppProps {
    chatAction: ChatAction;
    messages: List<IMessage>;
    nameAction: NameAction;
    name: string;
    contentAction: ContentAction;
    content: string;
}

export default class App extends React.Component<IAppProps, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        const {messages, chatAction, name, nameAction, content, contentAction} = this.props;

        return <div>
            <input value={name} onChange={(e: any) =>
                nameAction.changeName((e.target as HTMLInputElement).value)
            } />
            <input
                value={content}
                onChange={(e: any) =>
                    contentAction.changeContent((e.target as HTMLInputElement).value)
                }
                onKeyPress={(e: any) => {
                    const keyEvent = e as KeyboardEvent;
                    const currentContent: string = (keyEvent.target as HTMLInputElement).value;

                    if ((keyEvent.which === 13 || keyEvent.keyCode === 13) && currentContent !== "") {
                        keyEvent.preventDefault();

                        chatAction.pushCouldMessage({ name, content: currentContent });
                        contentAction.changeContent("");
                    }
                } } />
            <ul>
                {messages.reverse().map((message, idx) =>
                    <li key={idx}>
                        <p>{`${message.name}: ${message.content}`}</p>
                    </li>
                )}
            </ul>
        </div>;
    }
}