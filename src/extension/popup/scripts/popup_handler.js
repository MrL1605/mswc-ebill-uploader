/**
 * Created By : Lalit
 * Created On : 04/07/20
 */

import {afterUpload, altStatus, onUpload, uploadDateColInput, uploadInput, uploadNumRecInput} from "./constants";

let altStatusEle;

export const log = (line, clear, noNewLine) => {
    if (!altStatusEle)
        altStatusEle = document.getElementById(altStatus);
    console.log(line);
    if (clear)
        altStatusEle.innerText = "";
    if (!noNewLine)
        altStatusEle.innerText += "\n";
    altStatusEle.innerText += line;
};


export const attachWindowOnLoadListener = (onFileRead) => {

    const onUploadEle = document.getElementById(onUpload);
    const afterUploadEle = document.getElementById(afterUpload);
    const uploadInputEle = document.getElementById(uploadInput);
    const uploadDateColEle = document.getElementById(uploadDateColInput);
    const uploadNumRecEle = document.getElementById(uploadNumRecInput);

    uploadInputEle.onchange = (e) => {
        onUploadEle.setAttribute("style", "display: none");
        afterUploadEle.setAttribute("style", "display: block");
        const {dateCol, numRecords} = validateFields(uploadInputEle, uploadDateColEle, uploadNumRecEle);
        if (!dateCol || !numRecords)
            return;
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            const fs = fileReader.result;
            const fileName = e.target["files"][0]["name"];
            const fileType = e.target["files"][0]["type"];
            onFileRead(fs, fileName, fileType, dateCol, numRecords);
        };
        fileReader.readAsArrayBuffer(e.target["files"][0]);
    };
};

const validateFields = (uploadInputEle, uploadDateColEle, uploadNumRecEle) => {
    if (!uploadInputEle.files.length) {
        log("");
        return {};
    }
    let dateCol = uploadDateColEle.value;
    try {
        parseInt(dateCol);
    } catch (e) {
        log("Date Column must be greater than 1", true);
        return {};
    }
    if (dateCol <= 0) {
        dateCol = 0;
    }
    const numRecords = uploadNumRecEle.value;
    if (numRecords <= 0) {
        log("Number of records to be uploaded at a time must be greater than 1", true);
        return {};
    }
    return {dateCol, numRecords};
};


