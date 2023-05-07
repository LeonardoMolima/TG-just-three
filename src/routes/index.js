import {Routes, Route} from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Feed from '../pages/Feed';
import Perfil from '../pages/Perfil';
import PerfilConfig from '../pages/PerfilConfig';
import PerfilAnotherUser from '../pages/PerfilAnotherUser';
import Comentarios from '../pages/Comentarios';

import Private from './Private';

function RoutesApp(){
    return(
        <Routes>
            <Route path='/' element={ <Login/> }/>
            <Route path='/cadastro' element={ <Register/> }/>

            <Route path='/feed' element={ <Private> <Feed/> </Private> }/>
            <Route path='/perfil' element={ <Private> <Perfil/> </Private> }/>
            <Route path='/perfil/config' element={ <Private> <PerfilConfig/> </Private> }/>
            <Route path='/perfilUser/:idUser' element={ <Private> <PerfilAnotherUser/> </Private> }/>
            <Route path='/comentarios/:idPost' element={ <Private> <Comentarios/> </Private> }/>
        </Routes>
    )
}

export default RoutesApp;