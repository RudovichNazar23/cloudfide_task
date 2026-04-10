import { useEffect, useState } from "react";
import type {FileNode} from "../interfaces/FileNode.ts";
import type {FolderNode} from "../interfaces/FolderNode.ts";

import TreeNode from "./TreeNode.tsx";
import SearchForm from "./SearchForm.tsx";

export default function FileTree() {
    const [data, setData] = useState<FileNode | FolderNode | null>(null);
    const [searchResults, setSearchResults] = useState<Array<string>>([]);

    useEffect(() => {
        const stored = localStorage.getItem("treeData");
        const searchResults = localStorage.getItem("searchResults");
        if (stored) setData(JSON.parse(stored));
        if (searchResults) setSearchResults(JSON.parse(searchResults))
    }, []);

    if (!data) return <p>No data</p>;

    return (
        <div className={"row justify-content-center p-0 m-0 gap-2"}>
            <SearchForm loadedData={data} setSearchResults={setSearchResults} />
            <div className={"col-6"}>
                <TreeNode node={data} path="" />
            </div>
            <div className={"col-4 align-items-end"}>
                {
                    searchResults.length > 0 && (
                        <ul>
                            {
                                searchResults.map((item: string) => <li key={item}>
                                    {item}
                                </li>)
                            }
                        </ul>
                    )
                }
            </div>
        </div>
    );
}