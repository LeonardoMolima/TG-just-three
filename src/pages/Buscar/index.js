import SideMenu from "../../components/SideMenu";
import {AiOutlineSearch} from "react-icons/ai";
import { AiOutlineStar } from 'react-icons/ai';
import { BsChatText } from 'react-icons/bs';
import avatarPerfil from '../../assets/img/avatar.png';

import { Link, useParams, Navigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';
import { doc, getDoc, query, collection, where, orderBy, onSnapshot, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/FirebaseConnection";

import "./buscar.css";

function Buscar(){

    const [pesquisa, setPesquisa] = useState('');
    const [resultados, setResultados] = useState([]);

    useEffect(()=>{
        buscaPosts();
    },[pesquisa])

    async function buscaPosts(){

        const queryPosts = await query(collection(db,"posts"),orderBy("dataOrdem","desc"))

        const postsRef = onSnapshot(queryPosts, (snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
            lista.push({
            id: doc.id,    
            titulo: doc.data().titulo,
            tags: doc.data().tags,
            conteudo: doc.data().conteudo,
            imagem: doc.data().imagem,
            data: doc.data().diaPost+'/'+doc.data().mesPost+'/'+doc.data().anoPost,
            hora: doc.data().horaPost,
            id_autor: doc.data().uid_userPost,
            fotoAutor: doc.data().fotoUserPost,
            nomeAutor: doc.data().nomeAutor,
            nomeUserAutor: doc.data().nomeUserAutor
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
                    <button className="btn-opcoes-pesquisa" id="btn-postagens">Postagens</button>
                   <Link to="/buscar/pessoas" className="btn-opcoes-pesquisa"><button className="btn-opcoes-pesquisa">Pessoas</button></Link>
                </div>

                <div className="container-resultados">

                {
                pesquisa!== '' && pesquisa.length > 2 ? 
                    resultados.map( (post) => {
                        if(post.tags.includes(pesquisa)){
                            console.log("Achou");
                        
                            return (
                                <div className="posts-feed">
                                    <div className="infos-autor-post">
                                        <div className="img-names">
                                            {post.fotoAutor === null ? <img src={avatarPerfil}/> : <img src={post.fotoAutor}/>}
                                            <div className="nome-nomeUser">
                                                <strong>{post.nomeAutor}</strong>
                                                <Link to={"/perfilUser/"+post.id_autor}>@{post.nomeUserAutor}</Link>
                                            </div>
                                        </div>
                                        
                                        <div className="data-hora-post">
                                            <span>{post.data}</span>
                                            <span>{post.hora}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="conteudo-post">
                                        <h1>{post.titulo}</h1>
                                        <span>{post.tags}</span><br/>
                                        <h2>{post.conteudo}</h2><br/>
                                        <div className="img-conteudo-post">
                                        {post.imagem === null ? <></> : <img src={post.imagem}/>}
                                        </div>
                                    </div>

                                    <div className='btns-post'>
                                        <button><AiOutlineStar color='#FFF' size={25}/> Favoritar</button>
                                        <Link to={"/comentarios/"+post.id}><button><BsChatText color='#FFF' size={24} />Comentários</button></Link>
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

export default Buscar;