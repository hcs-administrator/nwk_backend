require('dotenv').config()

const express = require('express')
const { google } = require("googleapis");

const port = process.env.PORT
const app = express()

const cors = require('cors')

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

app.get('/drivelist', async function (req, res) {

    // Instance of Google Drive API
    const googleDrive = google.drive({ version: "v3", auth: client })

    // Get metadata about spreadsheet
    const metaData = await googleDrive.files.list({
        auth,
        includeItemsFromAllDrives: false,
        supportsAllDrives: true,
        corpora: "user",
        fields: 'files(id,name, mimeType)', //,size,mimeType,parents
        q: "'1NdyvY6y4d3uGQjdgZXFobkOD8O48q3R_' in parents and name != '__Pages' and mimeType = 'application/vnd.google-apps.folder'"
    })

    res.send(metaData.data)
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