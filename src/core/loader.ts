import {IFragment} from "./fragment";
import Package, {IPackage} from "./package";
import fs from "fs";
import path from "path";

export type RecursiveScanRule = (item: string) => boolean;

export enum ExportType {
    Command,
    Task,
    Service,
    Unknown
}

export interface Export extends IFragment {
    readonly path: string;
    readonly size: number;
    readonly type: ExportType;
}

export default abstract class Loader {
    protected static resolveExportPaths(): string[] {
        const pckg: IPackage = Package.getSync();

        // TODO: Also check for recursive folders?
        if (typeof pckg.export === "string" && !fs.existsSync(pckg.export)) {
            return [];
        }
        else if (Array.isArray(pckg.export)) {
            return Loader.recursiveScan(pckg.export);
        }

        return Loader.filterItems(pckg.export, fs.readdirSync(pckg.export));
    }

    protected static recursiveScan(items: string[], rule: RecursiveScanRule = Loader.isValidItem): string[] {
        const queue: string[] = [...items];
        const result: string[] = [];

        for (const item of queue) {
            if (rule(item)) {
                result.push(item);
            }
            else if (Loader.isDirSync(item)) {
                queue.push(item);
            }
        }

        return result;
    }

    protected static filterItems(base: string, items: string[]): string[] {
        return items.map((item: string) => path.join(process.cwd(), base, item)).filter((item: string) => {
            return Loader.isValidItem(item);
        });
    }

    protected static isDirSync(item: string): boolean {
        return fs.lstatSync(item).isDirectory();
    }

    protected static isValidItem(item: string): boolean {
        return item.endsWith(".js") && fs.lstatSync(item).isFile();
    }

    public static fetchExportsSync(): Export[] {
        const paths: string[] = Loader.resolveExportPaths();
        const result: Export[] = [];

        for (const itemPath of paths) {
            // TODO: Validate fragment modules
            const mod: IFragment = new (require(itemPath).default)();
            const size: number = fs.lstatSync(itemPath).size;

            result.push({
                meta: mod.meta,
                path: itemPath,
                size,

                // TODO
                type: ExportType.Unknown
            });
        }

        return result;
    }
}
