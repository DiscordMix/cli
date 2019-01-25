import Command from "../core/command";

export default class $Remote extends Command {
    public readonly name: string = "remote";
    public readonly description: string = "manage remote clone url";

    public run(): void {
        console.log("Not yet implemented.");
    }
}
