import { BrowserRouter, Routes, Route } from 'react-router-dom'

//USER
import MinhaSala from './pages/web/MinhaSala'

export default function Routess(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/minhasala' element={<MinhaSala/>} /> 
            </Routes>
        </BrowserRouter>
    )
}