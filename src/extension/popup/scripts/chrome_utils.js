/**
 * Created By : Lalit
 * Created On : 04/07/20
 */
import {log} from "./popup_handler";


export const getCurrentTabId = (afterGet) => {
    chrome.tabs.query({active: true, currentWindow: true}, (currentActiveTabs) => {
        for (let eachTab of currentActiveTabs) {
            if (!eachTab) {
                log("Tab not found");
                continue;
            }
            log(`Got current Tab ID ${eachTab.id}`);
            if (afterGet) afterGet(eachTab.id);
            return;
        }
    });
};

export const updateStore = (_store, afterUpdate) => {
    chrome.storage.local.set({..._store}, () => {
        if (afterUpdate) afterUpdate();
    });
};

export const getStore = (keyList, afterGet) => {
    chrome.storage.local.get(keyList, (storeVal) => {
        if (afterGet) afterGet(storeVal);
    });
};

export const attachScript = (tabId, afterAttach) => {
    setTimeout(() => {
        chrome.tabs.executeScript(tabId, {file: './popup/public/mswc_uploader-bundle.js'}, () => {
            if (afterAttach) afterAttach();
        });
    }, 500);
}

export const attachOnTabLoadListener = (tabId, onLoad) => {
    chrome.tabs.onUpdated.addListener((_tId, changeInfo) => {
        if (tabId !== _tId)
            return;
        if (!changeInfo["status"] || changeInfo["status"] !== "complete")
            return;
        if (onLoad) onLoad();
    });
};

export const attachRequestCompletedListener = (tabId, onComplete) => {
    chrome.webRequest.onCompleted.addListener((requestDetails) => {
        const {requestId, url, method, type, tId, statusCode} = requestDetails;
        console.log(`getting req for `, requestId, url, method, type, tId, statusCode);
        if (method !== "POST")
            return;
        log(`Update ${JSON.stringify({requestId, url, method, type, statusCode})}`);
        if (onComplete)
            onComplete(statusCode);
    }, {urls: ["*://mswcebill.azurewebsites.net/*"], tabId});
};
