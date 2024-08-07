import { BrowserRouter, Routes, Route } from 'react-router-dom'

//USER
import Inicio from './pages/user/Inicio'
import ContaUser from './pages/user/ContaUser'
import Salas from './pages/user/Salas'
import MinhaSala from './pages/user/MinhaSala'
import Trilha from './pages/user/Trilha'
import Atividade from './pages/user/Atividade'
import Licoes from './pages/user/Licoes'
import Aviso from './pages/user/Aviso'
import Transmissao from './pages/user/Transmissao'

//ADMIN
import ContaProfessor from './pages/admin/ContaProfessor'
import MinhasSalas from './pages/admin/MinhasSalas'
import Criacao from './pages/admin/Criacao'

export default function Routess(){
    return(
        <BrowserRouter>
            <Routes>
                {/* USER */}
                <Route path='/' element={<Inicio/>} />

                <Route path='/aluno/minhaconta' element={<ContaUser/>} /> 
                <Route path='/aluno/minhasala' element={<MinhaSala/>} /> 
                <Route path='/aluno/salas' element={<Salas/>} />
                <Route path='/aluno/minhasala/:idsala/trilha/:idtrilha' element={<Trilha/>} /> 
                <Route path='/aluno/minhasala/:idsala/trilha/:idtrilha/atividade/:idatividade/assistir' element={<Atividade/>} /> 
                <Route path='/aluno/minhasala/:idsala/trilha/:idtrilha/atividade/:idatividade/lições' element={<Licoes/>} /> 
                <Route path='/aluno/minhasala/:idsala/aviso/:idaviso' element={<Aviso/>} />
                <Route path='/aluno/minhasala/:idsala/transmissão/:idtransmissao' element={<Transmissao/>} />

                {/* ADMIN */}
                <Route path='/professor/minhaconta' element={<ContaProfessor/>} /> 
                <Route path='/professor/minhassalas' element={<MinhasSalas/>} /> 
                <Route path='/professor/criação' element={<Criacao/>} /> 
            </Routes>
        </BrowserRouter>
    )
}