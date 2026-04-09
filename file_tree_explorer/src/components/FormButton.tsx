// @ts-ignore

import { JSX } from "react";

interface FormButtonProps {
    buttonText: string;
    textPlace: "start" | "end";
    buttonColor: "success" | "danger";
    onClickEvent: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function FormButton({ buttonText, textPlace, buttonColor, onClickEvent }: FormButtonProps): JSX.Element {
    return (
        <div className={`col-3 text-${textPlace}`}>
            <button className={`col-12 btn btn-${buttonColor}`} type={"submit"} onClick={onClickEvent}>
                { buttonText }
            </button>
        </div>
    );
};
