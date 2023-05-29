import SideMenu from "../../components/SideMenu";
import {AiOutlineSearch} from "react-icons/ai";
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { BsChatText } from 'react-icons/bs';
import avatarPerfil from '../../assets/img/avatar.png';

import { Link, useParams, Navigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';
import { doc, getDoc, query, collection, where, orderBy, onSnapshot, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/FirebaseConnection";
import { toast } from "react-toastify";

import "./buscar.css";

function Buscar(){

    const { user } = useContext(AuthContext);

    const [pesquisa, setPesquisa] = useState('');
    const [resultados, setResultados] = useState([]);
    const [verificaFavClick, setFavClick] = useState(null);

    useEffect(()=>{
        buscaPosts();
    },[pesquisa])

    async function buscaPosts(){

        const queryVerificaFollow = await query(collection(db,"post_favoritou_favoritado"),where("id_user_favoritou" ,"==", user.uid),orderBy("data_Ordem_Post","desc"));
            const q = await query(collection(db,"posts"),orderBy("dataOrdem","desc"))
            var n = 0;
            var listaFavoritados = [];
            var listaIdfavs = [];

            const postsRef =  onSnapshot(queryVerificaFollow, (snapshot) => {
                
                snapshot.forEach((doc) => {
                    listaFavoritados.push(doc.data().id_post_favoritado);
                });
                snapshot.forEach((doc) => {
                    listaIdfavs.push(doc.id);
                });
            });

            console.log(listaIdfavs);
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
                favoritado: 1,
                uid_fav:listaIdfavs[n]
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
                        favoritado: 0,
                        uid_fav: null
                        })
                }
            });

        setResultados(lista);
        console.log("POSTS LISTA: ",lista);

        })
        

    }

    async function favoritar(id_post, dataOrdem){
        await addDoc(collection(db, 'post_favoritou_favoritado'), {
            id_user_favoritou: user.uid,
            id_post_favoritado: id_post,
            data_Ordem_Post: dataOrdem
        })
        .then(()=>{
            toast.success('Adicionado aos favoritos!');
        })
        .catch((error)=>{
            console.log("ERRO: "+ error);
        });
        }
    
        async function desfavoritar(id_post){
            const docRef = doc(db,"post_favoritou_favoritado", id_post);
            await deleteDoc(docRef)
            .then(()=>{
                toast.success("Postagem desfavoritada");
            })
            .catch((erro)=>{
                console.log("ERRO: ", erro);
            })
        }
    
        function favClick (opt){
            if(opt === "favoritou"){
                setFavClick(opt)
            }
            if(opt === "desfavoritou"){
                setFavClick(opt)
            }
            else{
                return
            }
        }
    
        favClick();

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
                                    {post.favoritado === 1 ? <button onClick={()=>{desfavoritar(post.uid_fav); favClick("desfavoritou");}}><AiFillStar color='#FFF' size={25}/> Favoritado</button>  : <button onClick={()=>{favoritar(post.id,post.dataOrdem); favClick("favoritou");}}><AiOutlineStar color='#FFF' size={25}/> Favoritar</button>}
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