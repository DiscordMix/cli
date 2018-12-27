import ICommand from "../core/command";

export default class NewCmd implements ICommand {
    readonly name: string = "new";
    readonly description: string = "create a new project";

    public run(args: string[]): void {

    }
}