const mongoose = require('mongoose')
const Document = require('./Document')
const PORT = process.env.PORT || 3001

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/text-processor')
}

const defaultValue = ""

const io = require('socket.io')(PORT, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
})

io.on('connection', socket => {
    console.log(socket.id);

    socket.on('get-document', async documentId => {
        const doc = await findOrCreateDocument(documentId)
        socket.join(documentId)
        socket.emit('load-document', doc.data)

        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })

        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data })
        })
    })

})

async function findOrCreateDocument(id) {
    if (id == null) return

    const doc = await Document.findById(id)
    if (doc) return doc
    return await Document.create({
        _id: id,
        data: defaultValue
    })
}