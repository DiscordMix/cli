import fs from "fs";
import Package from "../core/package";
import Command from "../core/command";

interface IArgs {
    readonly path: string;
}

export default class $Export extends Command {
    public readonly name: string = "export";
    public readonly description: string = "package and export modules";

    public run($: IArgs): void {
        Package.ensure();

        const modPath: string = `${$.path}.js`;

        if (!fs.existsSync(modPath)) {
            console.log(`Module path '${modPath}' does not exist.`);

            return;
        }
    }

    public setup(): void {
        //
    }
}
