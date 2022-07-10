import React from "react";
import { SearchInput } from "../types/types";

interface FileUploaderProps {
    onChange: (searchInput: SearchInput[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onChange }) => {

    const showFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = (e) => {
            const inputList: SearchInput[] =[];
            
            const text = e.target.result as string;
            const lines = text.split('\r\n');
            lines.forEach(line => {
                const words = line.split(',');
                const input: SearchInput = {
                    firstName: words[0],
                    lastName: words[1],
                    location: words[2]
                };
                inputList.push(input);
            });
            
            onChange(inputList);
        };
        reader.readAsText(e.target.files[0]);
    };

    return <label className="file-upload">
        <input type="file" onChange={showFile} accept=".txt"/>
        Upload Text File
    </label>;
};
