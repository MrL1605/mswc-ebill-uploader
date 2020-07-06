/**
 * Created By : Lalit
 * Created On : 03/07/20
 * Organisation: CustomerXPs Software Private Ltd.
 */
import {attachWindowOnLoadListener, log} from "./popup_handler";
import {getFragmentedFileList} from "./xlxs_fragmenter";
import {attachOnTabLoadListener, attachScript, getCurrentTabId, getStore, updateStore} from "./chrome_utils";

const getFirstFile = (firstFile, noFiles) => {
    getStore(["rows"], ({rows}) => {
        if (rows.length)
            if (firstFile) firstFile(rows[0]);
            else if (noFiles) noFiles();
    });
}

const removeFirstFile = (afterRemove) => {
    getStore(["rows", "numRecords"], ({rows, numRecords}) => {
        rows.splice(0, numRecords);
        updateStore({rows}, () => {
            if (afterRemove) afterRemove(rows);
        });
    });
}

window.onload = () => {
    attachWindowOnLoadListener((fs, fileName, fileType, dateCol, numRecords) => {
        const {headerList, rows, sheetName} = getFragmentedFileList(fs, dateCol);
        if (!headerList || !rows || !rows.length || !sheetName) {
            log("Corrupted file or no content found", true);
            setTimeout(() => window.close(), 2500);
            return;
        }
        getCurrentTabId((tabId) => {
            updateStore({headerList, rows, fileName, fileType, sheetName, dateCol, numRecords}, () => {
                runForAllFiles(tabId);
                // Attach a listener to tab for upload POST call
                attachOnTabLoadListener(tabId, () => {
                    getStore(["uploadReady"], ({uploadReady}) => {
                        if (!uploadReady)
                            return;
                        // If it fails refresh the page, to upload again. OR
                        // FIXME: ask the user to start all over again by giving an option to download the remaining of the file
                        log("Page Loaded. Starting upload of new file");
                        // If upload was successful, remove the first file block and then attach the script again
                        removeFirstFile((updatedRows) => {
                            log(`Run recursively ${updatedRows.length}`);
                            updateStore({uploadReady: false});
                            runForAllFiles(tabId);
                        });
                    });
                });
            });
        });

    });
};

const runForAllFiles = (tabId) => {
    getFirstFile((_file) => {
        log("Uploading next File");
        attachScript(tabId, () => {
            updateStore({uploadReady: true});
        });
    }, () => {
        log("Done with all files", true);
        setTimeout(() => window.close(), 2500);
    });
};

