import SideMenu from "../../components/SideMenu";
import {AiOutlineSearch} from "react-icons/ai";
import avatarPerfil from '../../assets/img/avatar.png';

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { query, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../services/FirebaseConnection";

import "./buscarPessoas.css";

function BuscarPessoas(){

    const [pesquisa, setPesquisa] = useState('');
    const [resultados, setResultados] = useState([]);

    useEffect(()=>{
        buscaPosts();
    },[pesquisa])

    async function buscaPosts(){

        const queryPessoas = await query(collection(db,"users"))

        const postsRef = onSnapshot(queryPessoas, (snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
            lista.push({
                id: doc.id,
                nome: doc.data().nome,
                nomeUser: doc.data().nomeUser,
                fotoPerfil: doc.data().fotoPerfil,
                biografia: doc.data().biografia,
                dataNascimento: doc.data().dataNascimento,
                genero: doc.data().genero,
                nvlProgramacao: doc.data().nvlProgramacao,
            })
        });

        setResultados(lista);
        console.log("POSTS LISTA: ",lista);

        })
        

    }

    return(
        <div>
            <SideMenu/>

            <div className="content">
                <div className="container-buscar">
                    <input type="text" className="input-buscar" placeholder="Buscar..." value={pesquisa} onChange={(e)=>{setPesquisa(e.target.value)}}/>
                    <button className="btn-buscar"><AiOutlineSearch size={24} color="#fff" /></button>
                </div>

                <div className="container-opcoes-pesquisa">
                    <Link to="/buscar/postagens" className="btn-opcoes-pesquisa"><button className="btn-opcoes-pesquisa" >Postagens</button></Link>
                    <button className="btn-opcoes-pesquisa" id="btn-pessoas">Pessoas</button>
                </div>

                <div className="container-resultados">

                {
                pesquisa!== '' && pesquisa.length > 2 ? 
                    resultados.map( (pessoa) => {
                        if(pessoa.nome.includes(pesquisa) || pessoa.nomeUser.includes(pesquisa)){
                            console.log("Achou");
                        
                            return (
                                <div className="posts-feed">
                                    <div className="infos-autor-post">
                                        <div className="img-names">
                                            {pessoa.fotoPerfil === null ? <img src={avatarPerfil}/> : <img src={pessoa.fotoPerfil}/>}
                                            <div className="nome-nomeUser">
                                                <strong>{pessoa.nome}</strong>
                                                <Link to={"/perfilUser/"+pessoa.id}>@{pessoa.nomeUser}</Link>
                                            </div>
                                        </div>

                                        <div className="data-hora-post">
                                            <span>Gênero: {pessoa.genero}</span>
                                        </div>
                                    </div>
                                    <h6 className="nvlProg-autor-post">Programador nível: <strong>{pessoa.nvlProgramacao}</strong></h6>
                                        <div className="conteudo-post">
                                            <h1></h1>
                                            <span>{pessoa.biografia}</span><br/>             
                                        </div>
                                    
                                </div>
                            )
                    }
                    }) : <h1>Digite sua pesquisa...</h1>
                    }
                    

                </div>
            </div>

        </div>
    )
}

export default BuscarPessoas;