// @ts-ignore
import { JSX } from 'react';

import { useState } from "react";

import SearchForm from "./SearchForm.tsx";
import FormHeader from "./FormHeader.tsx";
import FormButton from "./FormButton.tsx";

export default function MainPage(): JSX.Element {
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const selectedFile: File = e.target.files[0];
        const fileType: string = selectedFile.type;

        if(fileType !== "application/json"){
            setErrorMessage("This type is not supported");
        }
        else{
            setErrorMessage("")
            setFile(selectedFile);
        }
    };

    const onDeleteEvent = () => {
        setFile(null);
        window.location.reload();
    }

    return (
        <div className={"row p-0 m-0"}>
            <div className={"row  p-4 bg-body-tertiary"}>
                <SearchForm />
            </div>
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
                        <FormButton buttonText={"Add"} textPlace={"end"} buttonColor={"success"} onClickEvent={() => console.log("Added")}/>
                        <FormButton buttonText={"Delete"} textPlace={"start"} buttonColor={"danger"} onClickEvent={() => onDeleteEvent()}/>
                    </div>
                </div>
            </div>
        </div>
    );
};