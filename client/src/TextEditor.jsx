import "quill/dist/quill.snow.css"
import Quill from 'quill'
import { useEffect } from "react"
import { useRef } from "react"
import { io } from 'socket.io-client'
import { useState } from "react"
import { useParams } from "react-router-dom"


const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
]

export default function TextEditor() {
    const {id: documentId} = useParams()
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()
    const wrapperRef = useRef()
    
    useEffect(() => {
        const editor = document.createElement('div')
        wrapperRef.current.appendChild(editor)
        const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } })
        q.disable()
        q.setText("Loading...")
        setQuill(q)
        
        const s = io('http://localhost:3001')
        setSocket(s)
        
        return () => {
            wrapperRef.current.innerHTML = ""
            s.disconnect()
        }

    }, [])

    useEffect(() => {
        if (socket == null || quill == null) return


        socket.once('load-document', doc => {
            quill.setContents(doc)
            quill.enable()
        })
        socket.emit('get-document', documentId)
    }, [socket, quill, documentId])

    useEffect(() => {
        if (socket == null || quill == null) return

        const interval = setInterval(() => {
            socket.emit('save-document', quill.getContents())
        }, SAVE_INTERVAL_MS)

        return () => {
            clearInterval(interval)
        }
    }, [socket, quill])

    useEffect(() => {
        if (socket == null || quill == null) return

        const handleReceiveChanges =  (delta) => {
            quill.updateContents(delta)
        }    
        socket.on('receive-changes', handleReceiveChanges)

        return () => {
            socket.off('receive-changes', handleReceiveChanges)
        }
    }, [socket, quill])

    useEffect(() => {
        if (socket == null || quill == null) return

        const handleTextChange =  (delta, oldDelta, source) => {
            if (source !== 'user') return
            socket.emit('send-changes', delta)
        }    
        quill.on('text-change', handleTextChange)

        return () => {
            quill.off('text-change', handleTextChange)
        }
    }, [socket, quill])

    return (
        <div id="container" ref={wrapperRef}></div>
    )
}