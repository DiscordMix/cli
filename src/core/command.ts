export interface ICommand {
    readonly name: string;
    readonly description: string;
    readonly dependOnManifest: boolean;

    run(args: any): void;
    setup(): void;
}

export default abstract class Command implements ICommand {
    public readonly dependOnManifest: boolean = true;
    public readonly abstract name: string;
    public readonly abstract description: string;

    public abstract run(args: any): void;

    public setup(): void {
        //
    }
}
