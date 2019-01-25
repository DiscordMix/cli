import ICommand from "./command";
import yargs from "yargs";
import Package from "./package";

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
        // Setup usage
        yargs.usage("$0 <cmd> [args]");

        for (const command of this.commands.values()) {
            yargs.command(command.name, command.description, command.setup as any, (args: any): Promise<void> | void => {
                if (command.dependOnManifest && !Package.exists) {
                    console.log("No package manifest found. Use 'mix init' to initialize a new manifest.");

                    return;
                }

                return command.run(args);
            });
        }

        // Finish setup
        yargs.help().argv;

        return this;
    }
}
