import ICommand from "../core/command";

export default class VersionCmd implements ICommand {
    readonly name: string = "version";
    readonly description: string = "display the version";

    public run(): void {
        // TODO
        console.log(`Version x.x.x`);
    }
}