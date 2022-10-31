import TextEditor from "./TextEditor"
import './styles.css'
import {
  BrowserRouter,
  Route,
  Navigate,
  Routes
} from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Navigate replace to={`/documents/${uuidV4()}`}/>}/>
        <Route path="/documents/:id" element={<TextEditor />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
