import {Routes, Route} from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Feed from '../pages/Feed';
import Perfil from '../pages/Perfil';
import PerfilConfig from '../pages/PerfilConfig';
import PerfilAnotherUser from '../pages/PerfilAnotherUser';
import Comentarios from '../pages/Comentarios';
import Buscar from '../pages/Buscar';
import BuscarPessoas from '../pages/BuscarPessoas';
import Favoritos from '../pages/Favoritos';
import FavoritosPessoas from '../pages/FavoritosPessoas';

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
            <Route path='/buscar/postagens' element={ <Private> <Buscar/> </Private> }/>
            <Route path='/buscar/pessoas' element={ <Private> <BuscarPessoas/> </Private> }/>
            <Route path='/favoritos/postagens' element={ <Private> <Favoritos/> </Private> }/>
            <Route path='/favoritos/pessoas' element={ <Private> <FavoritosPessoas/> </Private> }/>
        </Routes>
    )
}

export default RoutesApp;