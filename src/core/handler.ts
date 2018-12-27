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
        const args :string[] = process.argv.slice(2);

        if (args.length === 0 || args[0] === "help") {
            this.help();
        }
        else if (this.commands.has(args[0])) {
            (this.commands.get(args[0]) as ICommand).run(args.slice(1));
        }
        else {
            console.log("Command not recognized; Use \"forge help\" to view commands");
        }

        return this;
    }
}