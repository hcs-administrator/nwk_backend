require('dotenv').config()

const express = require('express')
const { google } = require("googleapis");

const port = process.env.PORT
const app = express()

const cors = require('cors');
const { all } = require('express/lib/application');

const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: [
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/documents.readonly",
        "https://www.googleapis.com/auth/presentations.readonly"
    ],
});

// Create client instance for auth
const client = async () => await auth.getClient();

app.use(cors())

app.get('/drivelist/:id', async function (req, res) {

    let dataSet = []

    let folder = req.params.id

    if (req.params.id === undefined) {
        folder = "11pBICyGBEBABnnlwmbCc9I2WS0zIPjHB"
    }

    if (dataSet.length === 0) {
        const getTopLevelFolderId = await getTopLevelFolder(folder)
        dataSet.push(await getTopLevelFolderId.data)
    }

    res.send(dataSet[0])
})

app.get('/getAllFilesFromFolder/:id', async function (req, res) {

    const fileId = req.params.id

    // Instance of Google Drive API
    const googleDrive = google.drive({ version: "v3", auth: client })

    // Get metadata about spreadsheet
    const metaData = await googleDrive.files.list({
        auth,
        fileId,
        q: `'${fileId}' in parents`
    })

    res.send(metaData.data.files)

})

app.get('/getFile/:id', async function (req, res) {

    const documentId = req.params.id

    // Instance of Google Docs API
    const googleDocs = google.docs({ version: "v1", auth: client })

    // Get metadata about spreadsheet
    const metaData = await googleDocs.documents.get({
        auth,
        documentId
    })

    res.send(metaData.data)
})

app.get('/', async function (req, res) {
    res.send('NWK API - Read Documentation...')
})

app.get('*', function(req, res) {
    res.send('')
});

app.listen(port, (req, res) => console.log(`Server running on port ${port}`))

// FUNCTIONS

const getTopLevelFolder = async (folder) => {

    console.log(folder)

    // Instance of Google Drive API
    const googleDrive = google.drive({ version: "v3", auth: client })

    // Get metadata about spreadsheet
    return getTopLevelFolderId = await googleDrive.files.list({
        auth,
        includeItemsFromAllDrives: false,
        supportsAllDrives: true,
        corpora: "user",
        fields: 'files(id, name)', //,size,mimeType,parents
        q: `'${folder}' in parents and name != '__Pages' and mimeType = 'application/vnd.google-apps.folder'`
    })

}