import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../../contexts/auth";

import './register.css';

function Register(){
    const [nome, setNome] = useState('');
    const [nomeUser, setNomeUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [genero, setGenero] = useState('');
    const [nvlProgramacao, setNvlProgramacao] = useState('');

    const { addUser, loadingAuth } = useContext(AuthContext);

    async function handleSubmit(e){
        e.preventDefault();

        if(nome !== '' && nomeUser !== '' && email !== '' && password !== '' && genero !== '' && nvlProgramacao !== ''){
            await addUser(nome, nomeUser, email, password, genero, nvlProgramacao);
        }else{
            toast.error("Todos os campos precisam estar preenchidos.");
        }
    }


    return(
        <div className="container-center">
            <div className="container-login">
                <div className="logo">
                    <label>Novo Cadastro</label>
                </div>

                <form onSubmit={handleSubmit}>
                    <input type="text" onChange={(e)=>{ setNome(e.target.value)}} placeholder='Nome e Sobrenome'/>
                    <br/>
                    <input type="text" onChange={(e)=>{ setNomeUser(e.target.value)}} placeholder='Nome de usuário'/>
                    <br/>
                    <input type="text" onChange={(e)=>{ setEmail(e.target.value)}} placeholder='Email'/>
                    <br/>
                    <input type="password"  onChange={(e)=>{ setPassword(e.target.value)}} placeholder='Senha'/>
                    <br/>
                    <h4>Gênero</h4>
                    <select name="genero" onChange={(e)=>{ setGenero(e.target.value)}}>
                        <option value="" disabled selected>Selecione...</option>
                        <option value={'masculino'}>Masculino</option>
                        <option value={'feminino'}>Feminino</option>
                        <option value={'outro'}>Outro</option>
                    </select>
                    <br/>
                    <h4>Nível na Programação</h4>
                    <select name="nvlProgramacao" onChange={(e)=>{ setNvlProgramacao(e.target.value)}}>
                        <option value="" disabled selected>Selecione...</option>
                        <option value={'Iniciante'}>Iniciante</option>
                        <option value={'Estagiário'}>Estagiário</option>
                        <option value={'Junior'}>Junior</option>
                        <option value={'Pleno'}>Pleno</option>
                        <option value={'Sênior'}>Sênior</option>
                    </select>
                    <br/>
                    <input type="submit" value={loadingAuth ? 'Carregando...' : 'Cadastrar'} className='btn-entrar'/>
                    <br/>
                    
                    <Link to='/'>
                    Conectar em uma conta existente.
                    </Link>
                </form>

            </div>
        </div>
    )
}

export default Register;