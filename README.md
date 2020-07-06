# mswc-ebill-uploader
A Chrome Extension to upload Excel files to MSWC EBill Website

Just another one of my personal projects. Not necessarily helpful to almost anyone.

## HOW-TO:
 - Clone this repo.
 - Run `npm install` and then `npm run ext`
 - Enable Chrome Extensions page and enable developer mode
 - Click on load unpacked and choose `src/extension` directory.
 - Done :tada:

## Usage:

This extension is useful for someone using MSWC E-Bill Website.
E-Billing website does a bad job of maintaining state and does not have large servers.
This is problematic when uploading large files (~600 records or 65KB) gives Server Timeout.
This extension solves the problem by reading content of the large excel, creating chunks of
small data and upload one chunk at a time.

 - Open MSWC EBill Website.
 - Go to upload Excel page
 - Click on popup icon of this extension.
 - Fill the appropriate details and select the large excel file to upload.
 - Upload would have started. Sit back and watch.

## TODOs for this repo:
 - Cleanup. A lot of mess in here.
 - Error Handling. Have an option to force stop eveything.
 - Have an option to start upload after a nth row. (If a chunk was already submitted, start after that)
 - Write a blog post on how I approached the problem.


