/**
 * Created By : Lalit
 * Created On : 30/06/20
 */
import {log} from "./popup_handler";

const xlsx = require('node-xlsx');

export const getFragmentedFileList = (fs, dateCol) => {
    try {
        const ws = xlsx.parse(new Uint8Array(fs), {type: 'array', cellDates: true});
        log("Started creating fragments");
        const sheetName = ws[0].name;
        let remData = [...ws[0].data];
        // Remove the header row
        remData.splice(0, 1);
        // Remove all empty rows
        remData = remData.filter((row) => row.length);
        // Replace Date object with timestamp
        console.log("bef", remData[0], dateCol);
        if (dateCol)
            remData.map((row) => row[dateCol - 1] = localTime(row[dateCol - 1]));
        console.log("aft", remData[0]);
        return {headerList: ws[0].data[0], rows: remData, sheetName};
    } catch (e) {
        return {};
    }
}

function localTime(d) {
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).getTime() + (10 * 1000);
    // return new Date(d.getTime()).getTime() + (10 * 1000);
    // return d.getTime() + (10 * 1000);
    // return d.getTime();
}

