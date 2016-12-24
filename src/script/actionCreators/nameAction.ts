import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";

const CHANGE_NAME = "CHANGE_NAME";

export default class NameAction {
    private d: Dispatcher;
    private defaultName: string;

    constructor(dispatcher: Dispatcher, defaultName: string) {
        this.d = dispatcher;
        this.defaultName = defaultName;
    }

    public changeName(name: string) {
        this.d.push(CHANGE_NAME, name);
    }

    public createProperty(): Bacon.Property<string, string> {
        return Bacon.update<string, string, string>(this.defaultName,
            [this.d.stream(CHANGE_NAME)], this._changeName.bind(this)
        );
    }

    private _changeName(_, newName: string): string {
        window.localStorage.setItem("name", newName);
        return newName;
    }
}