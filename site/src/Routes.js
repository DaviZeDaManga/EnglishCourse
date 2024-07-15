import { BrowserRouter, Routes, Route } from 'react-router-dom'

//ADMIN
import MinhasSalas from './pages/admin/MinhasSalas'

//USER
import MinhaSala from './pages/user/MinhaSala'
import Trilha from './pages/user/Trilha'
import Atividade from './pages/user/Atividade'
import Licoes from './pages/user/Licoes'
import Conteudo from './pages/user/Conteudo'

export default function Routess(){
    return(
        <BrowserRouter>
            <Routes>
                {/* ADMIN */}
                <Route path='/admin/minhassalas' element={<MinhasSalas/>} /> 

                {/* USER */}
                <Route path='/minhasala/:idsala' element={<MinhaSala/>} /> 
                <Route path='/minhasala/:idsala/trilha/:idtrilha' element={<Trilha/>} /> 
                <Route path='/minhasala/:idsala/trilha/:idtrilha/atividade/:idatividade/assistir' element={<Atividade/>} /> 
                <Route path='/minhasala/:idsala/trilha/:idtrilha/atividade/:idatividade/lições' element={<Licoes/>} /> 
                <Route path='/minhasala/:idsala/:tipoconteudo/:idconteudo' element={<Conteudo/>} />
            </Routes>
        </BrowserRouter>
    )
}