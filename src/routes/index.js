import {Routes, Route} from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Feed from '../pages/Feed';

import Private from './Private';

function RoutesApp(){
    return(
        <Routes>
            <Route path='/' element={ <Login/> }/>
            <Route path='/cadastro' element={ <Register/> }/>

            <Route path='/feed' element={ <Private> <Feed/> </Private> }/>
        </Routes>
    )
}

export default RoutesApp;