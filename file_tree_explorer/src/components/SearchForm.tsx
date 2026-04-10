// @ts-ignore
import { JSX } from "react";
import { useState, useEffect } from "react";

import { searchAllNames } from "../utils/searchAllNames.ts";
import type {FileNode} from "../interfaces/FileNode.ts";
import type {FolderNode} from "../interfaces/FolderNode.ts";

interface SearchFormProps {
    loadedData: FileNode | FolderNode;
    setSearchResults: (searchResults: Array<string>) => void;
}


export default function SearchForm({ loadedData, setSearchResults }: SearchFormProps): JSX.Element {
    const [inputValue, setInputValue] = useState<string>("");

    useEffect(() => {
        const savedInputValue = localStorage.getItem("inputValue");
        if(savedInputValue) setInputValue(JSON.parse(savedInputValue));
    }, [])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        localStorage.setItem("inputValue", JSON.stringify(e.target.value))
        setInputValue(e.target.value);
    };

    const onClick = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const searchedNames: Array<string> = searchAllNames(inputValue, loadedData);
        localStorage.setItem("searchResults", JSON.stringify(searchedNames));
        setSearchResults(searchedNames);
    };

    return (
        <nav className="navbar bg-body-secondary">
            <div className="container-fluid">
                <a className="navbar-brand" href={"/"}>File tree explorer</a>
                <form className="d-flex" role="search">
                    <input className="form-control me-2"
                           type="search"
                           value={inputValue}
                           placeholder="Search"
                           onChange={onChange}
                    />
                    <button className="btn btn-success"
                            type="submit"
                            onClick={onClick}
                    >
                        Search
                    </button>
                </form>
            </div>
        </nav>
    );
};