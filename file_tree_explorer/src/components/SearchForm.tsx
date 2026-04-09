// @ts-ignore
import { JSX } from "react";

export default function SearchForm(): JSX.Element {
    return (
        <nav className="navbar bg-body-secondary">
            <div className="container-fluid">
                <a className="navbar-brand" href={"/"}>File tree explorer</a>
                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </nav>
    );
};