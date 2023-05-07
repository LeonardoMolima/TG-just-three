import SideMenu from "../../components/SideMenu";
import { Link, useParams, Navigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';
import { doc, getDoc, query, collection, where, orderBy, onSnapshot, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/FirebaseConnection";

import { toast } from "react-toastify";

import { AiOutlineStar } from 'react-icons/ai';
import { BsChatText } from 'react-icons/bs';
import avatarPerfil from '../../assets/img/avatar.png';
import './perfilAnotherUser.css';

function PerfilAnotherUser(){

    const { user, storageUser } = useContext(AuthContext);
    const [ anotherUser, setAnotherUser ] = useState({});
    const [ followExists, setFollowExists] = useState(null);
    const [posts, setPosts] = useState([]);
    const [idUnfollow, setIdUnfollow] = useState([]);

    const { idUser } = useParams();

    useEffect(()=>{
        buscaAnotherUser();
        verificaFollow();
        buscaPosts();
        
    },[])

        async function buscaAnotherUser(){

            const userRef = doc(db, "users", idUser ) 

            await getDoc(userRef)
            .then((snapshot)=>{
                setAnotherUser({
                    nome: snapshot.data().nome,
                    nomeUser: snapshot.data().nomeUser,
                    fotoPerfil: snapshot.data().fotoPerfil,
                    biografia: snapshot.data().biografia
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
                nomeUserAutor: doc.data().nomeUserAutor
                })
            });

            setPosts(lista);
            console.log("POSTS LISTA: ",lista);
    
            })
            

        }

        async function verificaFollow(){

            const queryVerificaFollow = await query(collection(db,"follow_followed"),where("user_seguidor" ,"==", storageUser.uid),where("user_seguido" ,"==", idUser))

            if(queryVerificaFollow){
                console.log(true);
                setFollowExists(true);
            }else{
                setFollowExists(false);
            }
 
        }

        


    async function follow(){
        await addDoc(collection(db, 'follow_followed'), {
            user_seguidor: user.uid,
            user_seguido: idUser
        })
        .then(()=>{
            toast.success('COMEÇOU A SEGUIR!');
            setFollowExists(true);
        })
        .catch((error)=>{
            console.log("ERRO: "+ error);
        });
    }

    async function unfollow(){
        console.log("teste");
    }

    
            
    if(idUser == user.uid){
        return <Navigate to='/perfil'/>
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
                            <h1>{anotherUser.nome}</h1>
                            <span>@{anotherUser.nomeUser}</span>
                            {followExists === true ? <button onClick={unfollow}>Seguindo</button> : <button onClick={follow}>Favoritar Perfil</button>}
                        </div>
                        <div className="row2">
                            <h2>Posts 0</h2>
                            <h2>Favoritos 0</h2>
                        </div>
                        <div className="row3">
                            <h2 className="bio">{anotherUser.biografia === null ? "" : anotherUser.biografia}</h2>
                        </div>
                    </div>
                </div>

                <div className="card-btn-menus">
                    <button className="btn-menu-posts">Posts</button>
                    <button className="btn-menu-sobre">Sobre</button>
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
                                    </div>
                                </div>

                                <div className='btns-post'>
                                    <button><AiOutlineStar color='#FFF' size={25}/> Favoritar</button>
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