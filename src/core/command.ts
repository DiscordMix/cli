export default interface ICommand {
    readonly name: string;

    run(args: any): void;
}