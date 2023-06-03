import { Link, useParams, Navigate } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/FirebaseConnection";
import { collection, getDoc, onSnapshot, where, doc } from 'firebase/firestore';
import { query, orderBy } from "firebase/firestore";
import SideMenu from "../../components/SideMenu";

//Monaco
import Editor from '@monaco-editor/react';

import avatarPerfil from '../../assets/img/avatar.png';
import './comentarios.css';

function Comentarios(){

    const { user, addComment } = useContext(AuthContext);

    const { idPost } = useParams();

    const [post, setPost] = useState([]);
    const [ comments, setComments ] = useState([]);
    const [ conteudoComment, setConteudoComment] = useState('');

    useEffect(()=>{
        buscaPost();
        buscaComments();
    },[])

   
        async function buscaPost(){

            const docRef = doc(db,"posts", idPost);

            await getDoc(docRef)
            .then((doc)=>{
               const lista = []

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
                    nomeUserAutor: doc.data().nomeUserAutor,
                    flg_code: doc.data().flg_code,
                    code: doc.data().code,
                    prog_language: doc.data().prog_language,
                    nvlProgramacao: doc.data().nvlProgramacao
                    });

                    setPost(lista);
            })
            .catch((erro)=>{
                console.log("ERRO: ",erro);
            });
 
        }

        async function buscaComments(){

            const q = await query(collection(db,"comments"), orderBy("dataOrdem", "desc") , where("uid_postComentado", "==", idPost))

            onSnapshot(q, (snapshot) => {
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
                nomeUserAutor: doc.data().nomeUserAutor,
                nvlProgramacao: doc.data().nvlProgramacao,
                })
            });
    
            setComments(lista);
    
            });
        }
    

    async function handleSubmit(e){
        e.preventDefault();

       await addComment(conteudoComment, idPost);

       setConteudoComment('');
    }



    return(
        <div>
            <SideMenu/>

            <div className="content">

                <div className="card-posts-comentarios">
                    
                    {post.map( (post) => {
                        return (
                            <div className="posts-feed">
                                <div className="infos-autor-post">
                                    <div className="img-names">
                                        {post.fotoAutor === null ? <img src={avatarPerfil} alt="Foto Perfil Autor Post"/> : <img src={post.fotoAutor} alt="Foto Perfil Autor Post"/>}
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
                                <h6 className="nvlProg-autor-post">Programador nível: <strong>{post.nvlProgramacao}</strong></h6>
                                <div className="conteudo-post">
                                    <h1>{post.titulo}</h1>
                                    <span>{post.tags}</span><br/>
                                    <h2>{post.conteudo}</h2><br/>
                                    <div className="img-conteudo-post">
                                    {post.imagem === null ? <></> : <img src={post.imagem} alt="Foto Postagem"/>}
                                    {post.flg_code === 1 ? <Editor
                                                        height="200px"
                                                        defaultLanguage={post.prog_language}
                                                        theme='vs-dark'
                                                        value={post.code}
                                                        /> : <></>}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className='card-comentarios'>

                    <h1>Comentários</h1>

                    <div className='add-comentario'>
                        <form onSubmit={handleSubmit}>
                            <div className="comentario">
                                <img src={user.fotoPerfil === null ? avatarPerfil : user.fotoPerfil} alt="Foto Perfil"/>
                                <textarea maxlength="155" cols="20" rows="1" placeholder="Digite seu comentário..." value={conteudoComment} onChange={(e)=>{setConteudoComment(e.target.value)}}></textarea>
                             </div>
                             <button>Comentar</button>
                        </form>
                    </div>

                    {comments.map( (comment) => {
                        return (
                    <div className="posts-feed">
                                <div className="infos-autor-post">
                                    <div className="img-names">
                                        {post.fotoAutor === null ? <img src={avatarPerfil} alt="Foto Perfil Autor Post"/> : <img src={comment.fotoAutor} alt="Foto Perfil Autor Post"/>}
                                        <div className="nome-nomeUser">
                                            <strong>{post.nomeAutor}</strong>
                                            <Link to={"/perfilUser/"+comment.id_autor}>@{comment.nomeUserAutor}</Link>
                                        </div>
                                    </div>
                                    
                                    <div className="data-hora-post">
                                        <span>{comment.data}</span>
                                        <span>{comment.hora}</span>
                                    </div>
                                </div>
                                <h6 className="nvlProg-autor-post">Programador nível: <strong>{comment.nvlProgramacao}</strong></h6>
                                <div className="conteudo-post">
                                    <h2>{comment.conteudo}</h2><br/>
                                </div>
                            </div>
                        )
                    })}

                </div>

            </div>

        </div>
    )
}

export default Comentarios;