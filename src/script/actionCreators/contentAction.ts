import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";

const CHANGE_CONTENT = "CHANGE_CONTENT";

export default class ContentAction {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public changeContent(content: string) {
        this.d.push(CHANGE_CONTENT, content);
    }

    public createProperty(): Bacon.Property<string, string> {
        return Bacon.update<string, string, string>("",
            [this.d.stream(CHANGE_CONTENT)], this._changeContent.bind(this)
        );
    }

    private _changeContent(_, newContent: string): string {
        return newContent;
    }
}