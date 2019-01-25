import ICommand from "../core/command";
import fs from "fs";
import Package from "../core/package";

/**
 * Arguments
 * 
 * 1. relativePath: The location of the module to export.
 */

export default class $Export implements ICommand {
    readonly name: string = "export";
    readonly description: string = "package and export modules";

    public run(args: string[]): void {
        Package.ensure();

        const modPath: string = `${args[0]}.js`;

        if (!fs.existsSync(modPath)) {
            console.log(`Module path '${modPath}' does not exist.`);

            return;
        }
    }
}
