export default interface ICommand {
    readonly name: string;
    readonly description: string;

    run(args: string[]): void;
}
