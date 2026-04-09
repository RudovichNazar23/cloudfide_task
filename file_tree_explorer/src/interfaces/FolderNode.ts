import type {FileNode} from "./FileNode.ts";

export interface FolderNode {
    name: string;
    size: number;
    type: "folder";
    children: Array<FolderNode | FileNode>;
}