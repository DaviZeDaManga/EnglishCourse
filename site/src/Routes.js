import { BrowserRouter, Routes, Route } from 'react-router-dom'

//USER
import MinhaSala from './pages/user/MinhaSala'
import Trilha from './pages/user/Trilha'
import Atividade from './pages/user/Atividade'

export default function Routess(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/minhasala/:idsala' element={<MinhaSala/>} /> 
                <Route path='/minhasala/:idsala/trilha/:idtrilha' element={<Trilha/>} /> 
                <Route path='/minhasala/:idsala/trilha/:idtrilha/atividade/:idatividade' element={<Atividade/>} /> 
            </Routes>
        </BrowserRouter>
    )
}