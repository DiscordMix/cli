import ICommand from "./command";

export default class Handler {
    protected commands: Map<string, ICommand>;

    public constructor() {
        this.commands = new Map();
    }

    public register(command: ICommand): this {
        if (!this.commands.has(command.name)) {
            this.commands.set(command.name, command);
        }

        return this;
    }
}