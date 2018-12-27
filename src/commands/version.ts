import ICommand from "../core/command";

export default class VersionCmd implements ICommand {
    readonly name: string = "version";

    public run(): void {
        console.log(`Version x.x.x`);
    }
}