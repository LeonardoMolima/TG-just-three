import { async } from "@firebase/util";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { db, storage } from "../../services/FirebaseConnection";
import firebase from "firebase/compat/app";
import { doc, setDoc, collection, addDoc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { query, where, orderBy } from "firebase/firestore";


import { BsCardImage } from 'react-icons/bs';
import avatarPerfil from '../../assets/img/avatar.png';
import SideMenu from "../../components/SideMenu";
import './feed.css';
import { toast } from "react-toastify";

function Feed(){
    const { user, addPost } = useContext(AuthContext);

    const [tituloPost, setTituloPost] = useState('');
    const [tagsPost, setTagsPost] = useState('');
    const [conteudoPost, setConteudoPost] = useState('');
    const [imgPost, setImgPost] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);

    const [posts, setPosts] = useState([]);

    useEffect(()=>{
        async function handleBtnBuscaPosts(){

            const q = await query(collection(db,"posts"),orderBy("dataOrdem","desc"))

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
                id_autor: doc.data().uid_userPost
                })
            })

            setPosts(lista);
    
            })
            .catch((error) => {
            console.log("DEU ALGUM ERRO AO BUSCAR")
            }) 
        }

        handleBtnBuscaPosts();
    },[])

    

    function handleFile(e){
        console.log(e.target.files[0])

        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === "image/jpeg" || image.type === "image/png"){
                setImgPost(image);
                setImgUrl(URL.createObjectURL(image));
            }else{
                toast.error("Tipo de arquivo não suportado!!");
                setImgPost(null);
                return;
            }

            console.log(imgPost);
            console.log(imgUrl);
        }
    }

   async function handleSubmit(e){
        e.preventDefault();

       await addPost(tituloPost, tagsPost, conteudoPost, imgPost);

       setTituloPost('');
       setTagsPost('');
       setConteudoPost('');
       setImgPost(null);
       setImgUrl(null);
   }

    return(
        <div>
            <SideMenu/>

            <div className="content">
                <div className="card-add-post">
                    <form onSubmit={handleSubmit}>
                        <div className="area-post">
                            <div className="post">
                                <img src={user.fotoPerfil === null ? avatarPerfil : user.fotoPerfil}/>
                                <div className="inputs-post">
                                <div>
                                    <label>Titulo:</label>
                                    <input type="text" placeholder="Titulo da postagem..." value={tituloPost} onChange={(e)=>{setTituloPost(e.target.value)}}/>
                                    <label>Tags:</label>
                                    <input type="text" placeholder="Tags da postagem..." value={tagsPost} onChange={(e)=>{setTagsPost(e.target.value)}}/>
                                </div>
                                <textarea maxlength="155" cols="20" rows="1" placeholder="Digite sua postagem..." value={conteudoPost} onChange={(e)=>{setConteudoPost(e.target.value)}}></textarea>
                                </div>
                            </div>
                            <div className="options-add-post" >
                                {imgUrl === null ? (
                                    <></>
                                ) : (
                                    <img src={imgUrl} alt="Foto de Post"/>
                                )}
                                <label className="label-add-post">
                                    <span>
                                        <BsCardImage color="#FFF" size={25}/>
                                    </span>
                                    <input type="file" accept="image/*" onChange={handleFile} hidden/>
                                </label>
                                <button type="submit">Publicar</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div>
                    {posts.map( (post) => {
                        return (
                            <>
                            <span>USER ID: {post.id_autor}</span><br/>
                            <span>id: {post.id}</span><br/>
                            <span>Data: {post.data}</span><br/>
                            <span>Hora: {post.hora}</span><br/>
                            <span>Titulo: {post.titulo}</span><br/>
                            <span>Tags: {post.tags}</span><br/>
                            <span>Conteudo: {post.conteudo}</span><br/>
                            <span>{post.imagem === null ? <></> : <img src={post.imagem}/>}</span><br/>
                            </>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}

export default Feed;