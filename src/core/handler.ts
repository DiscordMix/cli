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

    public help(): this {
        if (this.commands.size === 0) {
            console.log("No commands available");

            return this;
        }

        for (const command of this.commands.values()) {
            console.log(`${command.name}: ${command.description}`);
        }

        return this;
    }

    public handle(): this {
        if (process.argv.length === 0) {
            this.help();
        }
        else if (this.commands.has(process.argv[0])) {
            (this.commands.get(process.argv[0]) as ICommand).run(process.argv.slice(1, process.argv.length));
        }

        return this;
    }
}