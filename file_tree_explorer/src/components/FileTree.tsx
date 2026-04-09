import { useEffect, useState } from "react";
import type {FileNode} from "../interfaces/FileNode.ts";
import type {FolderNode} from "../interfaces/FolderNode.ts";

import TreeNode from "./TreeNode.tsx";
import SearchForm from "./SearchForm.tsx";

export default function FileTree() {
    const [data, setData] = useState<FileNode| FolderNode | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("treeData");
        if (stored) setData(JSON.parse(stored));
    }, []);

    if (!data) return <p>No data</p>;

    return (
        <div className={"row p-0 m-0"}>
            <SearchForm />
            <TreeNode node={data} path="" />
        </div>
    );
}