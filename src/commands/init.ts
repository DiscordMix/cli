import Command from "../core/command";
import Package from "../core/package";

export default class $Init extends Command {
    public readonly name: string = "init";
    public readonly description: string = "initiate an existing package";
    public readonly dependOnManifest: boolean = false;

    public run(): void {
        if (Package.exists) {
            console.log("Package manifest already exists.");

            return;
        }

        if (Package.createSync()) {
            console.log("Initialized new package manifest.");
        }
        else {
            console.log("Package manifest creation failed.");
        }
    }

    public setup(): void {
        //
    }
}
