import { Form } from "react-router-dom";

import "./login.css";
import setaLogo from "../../assets/img/setas-logo.png";

function Login(){
    return(
        <div className="container-center">
            <div className="container-login">
                <div className="logo">
                    <label>JustThree</label>
                </div>

                <form>
                    <h1>Email</h1>
                    <input type="text"/>
                    <br/>
                    <h1>Senha</h1>
                    <input type="password"/>
                    <br/>
                    <button className="btn-entrar">Entrar</button>
                    <a href="/">Esqueceu a senha?</a>
                    <br/>
                        <hr/>
                    <br/>
                    <button className="btn-cadastrar">Cadastrar</button>
                </form>

            </div>
            <footer>
                <span>JustThree © 2023</span>
            </footer>
        </div>
    )
}

export default Login;