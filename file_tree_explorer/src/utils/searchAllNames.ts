import type {FileNode} from "../interfaces/FileNode.ts";
import type {FolderNode} from "../interfaces/FolderNode.ts";

export function searchAllNames(
    searchedName: string,
    data: FileNode | FolderNode,
    path = ""
): Array<string> {
    const currentPath: string = path ? `${path}/${data.name}` : data.name;

    let results: Array<string> = [];

    if (data.name.toLowerCase().includes(searchedName.toLowerCase())) {
        results.push(`/${currentPath}`);
    }

    if (data.type === "folder") {
        for (const child of data.children) {
            results.push(...searchAllNames(searchedName, child, currentPath));
        }
    }

    return results;
}