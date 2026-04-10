import type {FolderNode} from "../interfaces/FolderNode.ts";
import type {FileNode} from "../interfaces/FileNode.ts";

export function countFolderSize(folder: FolderNode): number {
    let count: number = 0;

    const folderFiles: Array<FileNode> = folder.children.filter((node: FolderNode | FileNode) => node.type === "file");

    folderFiles.forEach(file => count += file.size);

    return count;
}