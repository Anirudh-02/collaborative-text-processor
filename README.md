# Text Processor with Collaboration Features

A text processor app made using React JS for the frontend, Express for backend, and MongoDB as the database. The text processing capabilites were implemented into the app with the help of Quill library. Upon visiting the site the user is given a blank document at a unique URL, this URL can be shared with anyone and the changes made will be reflected back and forth, so people can collaborate. This functionality is provided by maintaining a websocket connection using socket.io library. The documents are also saved in a MongoDB database and the changes made can be found to be preserved upon visiting the same URL.

## Screenshots

![A document being edited side by side](./screenshots/Screenshot(18).png)