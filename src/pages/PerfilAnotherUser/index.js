import SideMenu from "../../components/SideMenu";
import { Link, useParams, Navigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';
import { doc, getDoc, query, collection, where, orderBy, onSnapshot, addDoc, deleteDoc, getCountFromServer } from "firebase/firestore";
import { db } from "../../services/FirebaseConnection";
import { toast } from "react-toastify";

//Monaco
import Editor from '@monaco-editor/react';

import { AiOutlineStar } from 'react-icons/ai';
import { BsChatText } from 'react-icons/bs';
import avatarPerfil from '../../assets/img/avatar.png';
import './perfilAnotherUser.css';

function PerfilAnotherUser(){

    const { user, storageUser } = useContext(AuthContext);
    const [ anotherUser, setAnotherUser ] = useState({});
    const [ favExistsPerfilUser, setFavExistsPerfilUser] = useState(false);
    const [posts, setPosts] = useState([]);
    const [idUnfollow, setIdUnfollow] = useState([]);
    const [countPosts, setCountPosts] = useState(0);
    const [countFavs, setCountFavs] = useState(0);
    const [verificaRemoveClick, setRemoveClick] = useState(null);

    const { idUser } = useParams();

    useEffect(()=>{
        optClick("default");
        verificaFollow();
        buscaAnotherUser();
        contaPostsFavs();
        buscaPosts();
    },[])

    useEffect(()=>{
        verificaFollow();
    },[verificaRemoveClick])

        function refreshPage(){ 
            window.location.reload(); 
        }

        async function buscaAnotherUser(){

            const userRef = doc(db, "users", idUser ) 

            await getDoc(userRef)
            .then((snapshot)=>{
                setAnotherUser({
                    nome: snapshot.data().nome,
                    nomeUser: snapshot.data().nomeUser,
                    fotoPerfil: snapshot.data().fotoPerfil,
                    biografia: snapshot.data().biografia,
                    nvlProgramacao: snapshot.data().nvlProgramacao,
                })
            })
            .catch((erro)=>{
                console.log("ERRO: ", erro);
            })
            
        }

        async function buscaPosts(){

            const queryPosts = await query(collection(db,"posts"),where("uid_userPost" ,"==", idUser),orderBy("dataOrdem","desc"))

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
                nomeUserAutor: doc.data().nomeUserAutor,
                flg_code: doc.data().flg_code,
                code: doc.data().code,
                prog_language: doc.data().prog_language
                })
            });

            setPosts(lista);
            console.log("POSTS LISTA: ",lista);
    
            })
            

        }

        async function verificaFollow(){

            const queryVerificaFollow = await query(collection(db,"favoritou_favoritado"),where("id_favoritou" ,"==", user.uid),where("id_favoritado" ,"==", idUser))

            const postsRef = onSnapshot(queryVerificaFollow, (snapshot) => {
                let lista = [];
        
                snapshot.forEach((doc) => {
                    lista.push({
                    id: doc.id,
                    favoritou: doc.data().id_favoritou,
                    favoritado: doc.data().id_favoritado    
                    });
                });

                lista.map((valida) => {
                    if(valida.favoritou === user.uid && valida.favoritado === idUser){
                        setIdUnfollow(valida.id);
                        setFavExistsPerfilUser(true);
                    }
                })
                
            });
        }

        


    async function favoritar(nome){
        await addDoc(collection(db, 'favoritou_favoritado'), {
            id_favoritou: user.uid,
            id_favoritado: idUser,
            nome:nome
        })
        .then(()=>{
            toast.success('Adicionado aos favoritos!');
            setFavExistsPerfilUser(true);
        })
        .catch((error)=>{
            console.log("ERRO: "+ error);
        });
    }

    async function unfollow(){
        const docRef = doc(db, "favoritou_favoritado", idUnfollow);
        await deleteDoc(docRef)
        .then(()=>{
            setRemoveClick("removeu");
            toast.success('Perfil Desfavoritado!');
        });
    }

    function optClick (opt){
        if(opt === "adicionou"){
            setRemoveClick(opt);
        }
        if(opt === "removeu"){
            setRemoveClick(opt);
        }
        if(opt === "default"){
            setRemoveClick(opt);
        }
        else{
            return
        }
    }

    optClick();

    
            
    if(idUser == user.uid){
        return <Navigate to='/perfil'/>
    }

    async function contaPostsFavs(){

        const q = await query(collection(db,"posts"),where("uid_userPost" ,"==", idUser));
        const snapshot = await getCountFromServer(q);

        setCountPosts(snapshot.data().count);

        const q2 = await query(collection(db,"favoritou_favoritado"),where("id_favoritou" ,"==", idUser));
        const snapshot2 = await getCountFromServer(q2);

        const q3 = await query(collection(db,"post_favoritou_favoritado"),where("id_user_favoritou" ,"==", idUser));
        const snapshot3 = await getCountFromServer(q3);

        const somaFavs = (snapshot2.data().count) + (snapshot3.data().count);
        
        setCountFavs(somaFavs);
    }

    return(
        <div>
            <SideMenu/>

            <div className="content">
                <div className="card-perfil">
                    <div className="card-foto">
                        <img src={anotherUser.fotoPerfil === null ? avatarPerfil : anotherUser.fotoPerfil}/>
                    </div>
                    <div className="card-info">
                        <div className="row1">
                            <div className="row1-nome-nomeUser">
                                <h1>{anotherUser.nome}</h1>
                                <span>@{anotherUser.nomeUser}</span>
                            </div>
                            {favExistsPerfilUser === true ? <button onClick={()=>{unfollow(); optClick("removeu"); refreshPage();}}>Favoritado</button> : <button onClick={()=>{favoritar(anotherUser.nome)}}>Favoritar</button>}
                        </div>
                        <div className="row2" style={{justifyContent: "left"}}>
                            <h2>Programador nível: <strong>{anotherUser.nvlProgramacao}</strong></h2>
                        </div>
                        <div className="row2">
                            <h2>Posts {countPosts}</h2>
                            <h2>Favoritou {countFavs}</h2>
                        </div>
                        <div className="row3">
                            <h2 className="bio">{anotherUser.biografia === null ? "" : anotherUser.biografia}</h2>
                        </div>
                    </div>
                </div>

                <div className="card-btn-menus">
                    <button className="btn-menu-posts">Posts</button>
                </div>

                <div className="card-posts-feed">
                    
                    {posts.map( (post) => {
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
                                    {post.flg_code === 1 ? <Editor
                                                        height="200px"
                                                        defaultLanguage={post.prog_language}
                                                        theme='vs-dark'
                                                        value={post.code}
                                                        /> : <></>}
                                    </div>
                                </div>

                                <div className='btns-post'>
                                    <Link to={"/comentarios/"+post.id}><button><BsChatText color='#FFF' size={24} />Comentários</button></Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            
        </div>
    )

}

export default PerfilAnotherUser;