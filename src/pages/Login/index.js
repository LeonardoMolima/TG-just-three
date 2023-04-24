import { Form } from "react-router-dom";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

import "./login.css";
import setaLogo from "../../assets/img/setas-logo.png";

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { logIn, loadingAuth } = useContext(AuthContext);

   async function handeLogIn(e){
        e.preventDefault();

        if(email !== '' & password !== ''){
            await logIn(email, password);
        }
    }

    return(
        <div className="container-center">
            <div className="container-login">
                <div className="logo">
                    <label>JustThree</label>
                </div>

                <form onSubmit={handeLogIn}>
                    <h1>Email</h1>
                    <input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                    <br/>
                    <h1>Senha</h1>
                    <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                    <br/>
                    <input type="submit" value={loadingAuth ? 'Carregando...' : 'Entrar'} className='btn-entrar'/>
                    <a href="/">Esqueceu a senha?</a>
                    <br/>
                        <hr/>
                    <br/>
                </form>

                <Link to='/cadastro'>
                    <button className="btn-cadastrar">Cadastrar</button>
                </Link>

            </div>
            <footer>
                <span>JustThree © 2023</span>
            </footer>
        </div>
    )
}

export default Login;