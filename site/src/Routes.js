import { BrowserRouter, Routes, Route } from 'react-router-dom'

//USER
import MinhaSala from './pages/web/MinhaSala'
import Trilha from './pages/web/Trilha'

export default function Routess(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/minhasala/:id' element={<MinhaSala/>} /> 
                <Route path='/minhasala/:id/trilha/:id' element={<Trilha/>} /> 
            </Routes>
        </BrowserRouter>
    )
}