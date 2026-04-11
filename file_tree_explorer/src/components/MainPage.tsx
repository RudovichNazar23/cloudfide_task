// @ts-ignore
import { JSX } from 'react';

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { Link } from "react-router-dom";

import FormHeader from "./FormHeader.tsx";
import FormButton from "./FormButton.tsx";

export default function MainPage(): JSX.Element {
    // @ts-ignore
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [data, setData] = useState<string | null>("");
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem("treeData");
        if(stored) setData(stored);
    }, []);

    const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const selectedFile: File = e.target.files[0];
        const fileType: string = selectedFile.type;

        if(fileType !== "application/json"){
            setErrorMessage("This type is not supported");
        }
        else{
            setErrorMessage("");
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                try {
                    const text = event.target?.result;
                    if (typeof text !== "string") throw new Error();

                    const parsed = JSON.parse(text);

                    localStorage.setItem("treeData", JSON.stringify(parsed));
                } catch {
                    setErrorMessage("Invalid JSON structure");
                }
            };
            reader.readAsText(selectedFile);
        }
    };
    // @ts-ignore
    const onAddFile = (e:MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const data = localStorage.getItem("treeData");

      if (!errorMessage && data){
          setErrorMessage("");
          navigate("/tree");
      }
      else{
          setErrorMessage("Please, upload a JSON file")
      }
    };

    const onDeleteEvent = () => {
        localStorage.clear();
        window.location.reload();
    }

    return (
        <div className={"row p-0 m-0"}>
            {
                data && (
                    <nav className="navbar bg-body-secondary">
                        <div className="container-fluid justify-content-between">
                            <a className="navbar-brand" href={"/"}>File tree explorer</a>
                            <div>
                                <Link to={"/tree"} className={"btn btn-outline-info text-dark"}>Check out your file tree</Link>
                            </div>
                        </div>
                    </nav>
                )
            }
            <div className={"row mt-4"}>
                <FormHeader />
                <div className={"row justify-content-center text-center"}>
                    <div className={"col-6"}>
                        <input
                            type={"file"}
                            className={"form-control"}
                            onChange={onChangeEvent}
                        />
                    </div>
                    {
                        errorMessage && (
                            <div className={"container text-danger p-2"}>
                                { errorMessage }
                            </div>
                        )
                    }
                    <div className={"row mt-2 justify-content-center"}>
                        <FormButton buttonText={"Add"} textPlace={"end"} buttonColor={"success"} onClickEvent={(e) => onAddFile(e)}/>
                        <FormButton buttonText={"Delete"} textPlace={"start"} buttonColor={"danger"} onClickEvent={() => onDeleteEvent()}/>
                    </div>
                </div>
            </div>
        </div>
    );
};