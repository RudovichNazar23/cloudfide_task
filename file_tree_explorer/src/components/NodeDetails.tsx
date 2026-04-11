import { JSX } from "react";

import { useLocation } from "react-router-dom";
import type {FileNode} from "../interfaces/FileNode.ts";
import type {FolderNode} from "../interfaces/FolderNode.ts";

import { formatSize } from "../utils/formSize.ts";
import { countFolderSize } from "../utils/countFolderSize.ts";

import { Link } from "react-router-dom";

interface LocationState {
    node: FileNode | FolderNode;
    fullPath: string;
}

export default function NodeDetails(): JSX.Element {
    const location = useLocation();

    const state: LocationState = location.state;

    return (
        <div>
            <nav className={"navbar bg-body-secondary"}>
                <div className={"container-fluid"}>
                    <Link to={"/tree"} className={"navbar-brand"}>Back to tree explorer</Link>
                </div>
            </nav>
            {
                state ? (
                    <div className={"row p-0 m-0"}>
                        {
                            <div className={"container-fluid m-2 p-2"}>
                                {
                                    state.node.type === "file" ? (
                                        <>
                                            <p><strong>Name</strong>: {state.node.name}</p>
                                            <p><strong>Size</strong>: {formatSize(state.node.size)}</p>
                                            <p><strong>Full path</strong>: {state.fullPath}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p><strong>Folder name</strong>: {state.node.name}</p>
                                            <p>
                                                <strong>Children</strong>: { state.node.children.length ||
                                                "This folder doesn't have any children yet..." }
                                            </p>
                                            <p><strong>Size</strong>: { formatSize(countFolderSize(state.node)) }</p>
                                            <div>
                                                <strong>Children links</strong>: <ul>
                                                    {
                                                        state.node.children.map(
                                                            (child: FileNode | FolderNode): JSX.Element => {
                                                                const childPath: string = `${state.fullPath}/${child.name}`;

                                                                return <li key={child.name}>
                                                                    <Link to={`${childPath}`}
                                                                          state={{node: child, fullPath:childPath}}>
                                                                        { child.type === "folder" ?
                                                                            `${child.name}/` :
                                                                            child.name
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            }
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        }
                    </div>
                ) : <p>No data can be provided, check the url address...</p>
            }
        </div>
    )
};