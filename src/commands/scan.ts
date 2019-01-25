import Command from "../core/command";
import Loader, {Export} from "../core/loader";
import colors from "colors";

export default class $Scan extends Command {
    public readonly name: string = "scan";
    public readonly description: string = "view package information";

    public run(): void {
        const exports: Export[] = Loader.fetchExportsSync();

        for (const ex of exports) {
            const desc: string = ex.meta.description !== undefined ? colors.gray(`: ${ex.meta.description}`) : "";
            const size: string = colors.cyan(`[${ex.size} b]`);

            console.log(`  ${ex.meta.name}${desc} ${size}`);
        }

        if (exports.length === 0) {
            console.log("No items found.");
        }
    }
}
