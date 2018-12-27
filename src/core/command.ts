export default interface ICommand {
    readonly name: string;
    readonly description: string;

    run(args: any): void;
}