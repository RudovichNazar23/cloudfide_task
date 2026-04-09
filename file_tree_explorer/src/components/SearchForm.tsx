// @ts-ignore
import { JSX } from "react";

export default function SearchForm(): JSX.Element {
    return (
        <>
            <div className={"col-2"} />
            <div className={"col-6"}>
                <input className={"form-control p-2"} placeholder={"Search for file or folder"} type={"text"}/>
            </div>
            <button className={"col-2 btn btn-success"}>
                Search
            </button>
        </>
    );
};