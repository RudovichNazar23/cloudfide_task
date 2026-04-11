import { JSX } from "react";

import { useState } from "react";

import type {FolderNode} from "../interfaces/FolderNode.ts";
import type {FileNode} from "../interfaces/FileNode.ts";

import { Link } from "react-router-dom";

type TreeNodeProps = {
    node: FolderNode | FileNode;
    path: string;
};

export default function TreeNode({ node, path }: TreeNodeProps): JSX.Element {
    const [expanded, setExpanded] = useState(false);

    const currentPath = path ? `${path}/${node.name}` : node.name;

    if (node.type === "file") {
        return (
            <div className={"row ms-3 mt-3"}>
                <div className={"col-12 container d-flex flex-row align-content-center gap-1"}>
                    <div className={"align-self-center"}><img className={"img-fluid"} src={"/file.png"} height={"25"} width={"25"} alt={"file"}/></div>
                    <Link to={`/tree/${currentPath}`} state={{node: node, fullPath: currentPath}}>
                        {node.name}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={"row ms-3 mt-3"}>
            <div className={"col-12 container d-flex flex-row align-content-center gap-1"}>
                <div className={" align-self-center"}><img className={"img-fluid"} src={"/folder.png"} height={"25"} width={"25"} alt={"folder"}/></div>
                <button className={"btn border align-self-center"} onClick={() => setExpanded((prev) => !prev)}>
                    {node.name}
                </button>
                <div className={" align-self-center"}>
                    <Link to={`/tree/${currentPath}`} state={{node: node, fullPath: currentPath}}>[details]</Link>
                </div>
            </div>

            {expanded &&
                node.children.map((child) => (
                    <TreeNode
                        key={child.name}
                        node={child}
                        path={currentPath}
                    />
                ))
            }
        </div>
    );
};
