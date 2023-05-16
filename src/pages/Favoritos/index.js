import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/FirebaseConnection";
import { collection, onSnapshot } from 'firebase/firestore';
import { query, orderBy, where } from "firebase/firestore";

import SideMenu from "../../components/SideMenu";
import {  AiFillStar } from 'react-icons/ai';
import { BsChatText } from 'react-icons/bs';
import avatarPerfil from '../../assets/img/avatar.png';
import "./favoritos.css";

function Favoritos(){

    const { user, addPost } = useContext(AuthContext);
    const [favExistsFavoritos, setFavExistsFavoritos] = useState([]);

    const [posts, setPosts] = useState([]);
    const [verificaFavClick, setFavClick] = useState(null);


    useEffect(()=>{
        async function handleBtnBuscaPosts(){

           const queryVerificaFollow = await query(collection(db,"post_favoritou_favoritado"),where("id_user_favoritou" ,"==", user.uid),orderBy("data_Ordem_Post","desc"));
           const q = await query(collection(db,"posts"),orderBy("dataOrdem","desc"))
           var n = 0;
           var listaFavoritados = [];

           const postsRef =  onSnapshot(queryVerificaFollow, (snapshot) => {
               
               snapshot.forEach((doc) => {
                   listaFavoritados.push(doc.data().id_post_favoritado);
               });
           });

           console.log(listaFavoritados);
           onSnapshot(q, (snapshot) => {
           let lista = [];
   
           snapshot.forEach((doc) => {
               if(doc.id === listaFavoritados[n]){
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
               favoritado: 1
               })
               n++;
               }else{
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
                       dataOrdem: doc.data().dataOrdem,
                       favoritado: 0
                       })
               }
           });

           console.log(lista);
            setPosts(lista);
   
           });

       }

       handleBtnBuscaPosts();
   },[])

  

    

    let contador = 0;

    return(
        <div>

            <SideMenu/>

            <div className="content">

                <div className="topo-favoritos">
                    <h1>Meus Favoritos</h1>
                </div>
                <div className="btn-opcoes-favoritos">
                    <button className="btn-opcoes-pesquisa" id="btn-postagens">Postagens</button>
                   <Link to="/favoritos/pessoas" className="btn-opcoes-pesquisa"><button className="btn-opcoes-pesquisa">Pessoas</button></Link>
                </div>

                <div className="card-posts-feed">
                    
                    {posts.map( (post) => {

                    if(post.favoritado === 1){
                        contador++;
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
                                
                                <div className="conteudo-post">
                                    <h1>{post.titulo}</h1>
                                    <span>{post.tags}</span><br/>
                                    <h2>{post.conteudo}</h2><br/>
                                    <div className="img-conteudo-post">
                                    {post.imagem === null ? <></> : <img src={post.imagem} alt="Foto Postagem"/>}
                                    </div>
                                </div>

                                <div className='btns-post'>

                                <button><AiFillStar color='#FFF' size={25}/> Favoritado</button>    
                                    <Link to={"/comentarios/"+post.id}><button><BsChatText color='#FFF' size={24} />Comentários</button></Link>
                                </div>
                            </div>
                        )
                    }else{
                        return (
                            <></>
                        )
                    }
                        
                    })}
                </div>

            </div>

        </div>
    )
}

export default Favoritos;