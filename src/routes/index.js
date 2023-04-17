import {Routes, Route} from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';

function RoutesApp(){
    return(
        <Routes>
            <Route path='/' element={ <Login/> }/>
            <Route path='/cadastro' element={ <Register/> }/>
        </Routes>
    )
}

export default RoutesApp;