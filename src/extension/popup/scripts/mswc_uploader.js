/**
 * Created By : Lalit
 * Created On : 04/07/20
 */

const uploadInputId = "ContentPlaceHolder1_FUMBDetails";

const xlsx = require("node-xlsx");

setTimeout(() => {

    console.log(xlsx);
    chrome.storage.local.get(
        ["headerList", "rows", "fileType", "sheetName", "dateCol", "numRecords"],
        ({headerList, rows, fileType, sheetName, dateCol, numRecords}) => {
            if (!rows.length)
                return;
            // build the xlsx
            let rowsToWork = rows.splice(0, numRecords);
            console.log("got content", headerList, rowsToWork, dateCol);
            if (dateCol)
                rowsToWork.map((row) => row[dateCol - 1] = new Date(row[dateCol - 1]));
            console.log("sending content", JSON.stringify(rowsToWork[0]));
            const content = xlsx.build([{name: sheetName, data: [headerList, ...rowsToWork]}], {
                type: "array"
            });
            const dt = new DataTransfer();
            let _file = new File([content], "somefile.xlsx", {type: fileType});
            dt.items.add(_file);
            const uploadInputEle = document.getElementById(uploadInputId);
            if (!uploadInputEle) {
                return;
            }
            uploadInputEle.files = dt.files;
            for (let eachChild of uploadInputEle.parentNode.children) {
                if (eachChild.type && eachChild.type.toLowerCase() === "submit") {
                    eachChild.click();
                    break;
                }
            }
        });
}, 100);


const parseIt = (_inp_f) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
        const fs = fileReader.result;
        console.log("parsed again", xlsx.parse(new Uint8Array(fs), {type: 'array', cellDates: true}));
    };
    fileReader.readAsArrayBuffer(_inp_f[0]);
};

// let fr2 = new FileReader()
// let org = document.getElementById("ContentPlaceHolder1_FUMBDetails");
// fr2.onloadend = () => {
//     let content = fr2.result;
//     let updatedFile = new File([new Blob([new Uint8Array(content)])], "somefile.xlsx",{type: org.files[0]["type"]})
//     const dt = new DataTransfer()
//     dt.items.add(updatedFile);
//     // let modBuff = new Blob([new Uint8Array(content)], {type: org.files[0]["type"]});
//     const textFileUploadEle = document.createElement("input");
//     textFileUploadEle.setAttribute("type", "file");
//     // org.id="old__";
//     textFileUploadEle.setAttribute("id", "ContentPlaceHolder1_FUMBDetails" + "asd");
//     // org.name="old__";
//     textFileUploadEle.setAttribute("name", "ctl00$ContentPlaceHolder1$FUMBDetails" + "asd");
//     textFileUploadEle.files = dt.files;
//     // console.log(content);
//     // textFileUploadEle.setAttribute("value", content);
//     org.parentNode.appendChild(textFileUploadEle);
// };
// fr2.readAsArrayBuffer(org.files[0]);

// let fr3 = new FileReader();
// fr3.onloadend = (_e) => {
// };
// fr3.readAsArrayBuffer(modBuff);

