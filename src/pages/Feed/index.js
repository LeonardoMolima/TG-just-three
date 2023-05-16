import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/FirebaseConnection";
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { query, orderBy, where } from "firebase/firestore";

import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { BsChatText } from 'react-icons/bs';
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
    const [verificaFavClick, setFavClick] = useState(null);
    const [favExists, setFavExists] = useState([]);
    const [cont, setCont] = useState(0);

    const [posts, setPosts] = useState([]);

    useEffect(()=>{
         async function handleBtnBuscaPosts(){

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

            console.log(lista);
             setPosts(lista);
    
            });

        }

        handleBtnBuscaPosts();
    },[verificaFavClick])

    

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

    var contador = 0;

    return(
        
        <div>

                

            <SideMenu/>

            <div className="content">
                <div className="card-add-post">
                    <form onSubmit={handleSubmit}>
                        <div className="area-post">
                            <div className="post">
                                <img src={user.fotoPerfil === null ? avatarPerfil : user.fotoPerfil} alt="Foto Perfil"/>
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

                <div className="card-posts-feed">
                    
                {posts.map((post, index) => {
 
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

                                    {post.favoritado === 1 ? <button onClick={()=>{desfavoritar(post.uid_fav); favClick("desfavoritou");}}><AiFillStar color='#FFF' size={25}/> Favoritado</button>  : <button onClick={()=>{favoritar(post.id,post.dataOrdem); favClick("favoritou");}}><AiOutlineStar color='#FFF' size={25}/> Favoritar</button>}
    
                                       
                                        <Link to={"/comentarios/"+post.id}><button><BsChatText color='#FFF' size={24} />Comentários</button></Link>
                                    </div>
                                </div>
                            )               
                    }
            

                    
                        
                    )}
                
                    
                </div>
            </div>

        </div>
    )
}

export default Feed;