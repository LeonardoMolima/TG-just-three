import SideMenu from "../../components/SideMenu";
import { Link } from 'react-router-dom';
import { VscSettingsGear }  from 'react-icons/vsc';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';

//Monaco
import Editor from '@monaco-editor/react';

import { AiOutlineStar } from 'react-icons/ai';
import { BsChatText } from 'react-icons/bs';
import { db } from "../../services/FirebaseConnection";
import { collection, query, orderBy, where, onSnapshot, getCountFromServer } from "firebase/firestore";

import avatarPerfil from '../../assets/img/avatar.png';
import './perfil.css';


function Perfil(){

    const { user } = useContext(AuthContext);

    const [posts, setPosts] = useState([]);

    const [countPosts, setCountPosts] = useState(0);
    const [countFavs, setCountFavs] = useState(0);

    useEffect(()=>{
        async function handleBtnBuscaPosts(){

            const q = await query(collection(db,"posts"),where("uid_userPost" ,"==", user.uid),orderBy("dataOrdem","desc"))

            const postsRef = onSnapshot(q, (snapshot) => {
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
    
            })
            .catch((error) => {
            console.log("DEU ALGUM ERRO AO BUSCAR")
            }) 
        }

        handleBtnBuscaPosts();
        contaPostsFavs();
    },[])

    async function contaPostsFavs(){

        const q = await query(collection(db,"posts"),where("uid_userPost" ,"==", user.uid));
        const snapshot = await getCountFromServer(q);

        const q2 = await query(collection(db,"favoritou_favoritado"),where("id_favoritou" ,"==", user.uid));
        const snapshot2 = await getCountFromServer(q2);

        const q3 = await query(collection(db,"post_favoritou_favoritado"),where("id_user_favoritou" ,"==", user.uid));
        const snapshot3 = await getCountFromServer(q3);

        const somaFavs = (snapshot2.data().count) + (snapshot3.data().count);
        setCountPosts(snapshot.data().count);
        setCountFavs(somaFavs);
    }

    return(
        <div>
            <SideMenu/>

            <div className="content">
                <div className="card-perfil">
                    <div className="card-foto">
                        <img src={user.fotoPerfil === null ? avatarPerfil : user.fotoPerfil}/>
                    </div>
                    <div className="card-info">
                        <div className="row1">
                            <h1>{user.nome}</h1>
                            <span>@{user.nomeUser}</span>
                            <Link to="/perfil/config">
                            <VscSettingsGear color="#FFF" size={20}/>
                            </Link>
                        </div>
                        <div className="row2">
                            <h2>Posts {countPosts}</h2>
                            <h2>Favoritou {countFavs}</h2>
                        </div>
                        <div className="row3">
                            <h2 className="bio">{user.biografia === null ? "" : user.biografia}</h2>
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

export default Perfil;