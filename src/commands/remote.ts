import ICommand from "../core/command";

export default class $Remote implements ICommand {
    readonly name: string = "remote";
    readonly description: string = "manage remote clone url";

    public run(): void {
        console.log("Not yet implemented");
    }
}
