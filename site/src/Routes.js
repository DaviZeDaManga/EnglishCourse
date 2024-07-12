import { BrowserRouter, Routes, Route } from 'react-router-dom'

//USER
import MinhaSala from './pages/user/MinhaSala'
import Trilha from './pages/user/Trilha'

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