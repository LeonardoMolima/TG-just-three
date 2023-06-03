import React from 'react';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/FirebaseConnection";
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { query, orderBy, where } from "firebase/firestore";

//Monaco
import Editor from '@monaco-editor/react';

import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { BsChatText, BsCardImage } from 'react-icons/bs';
import { BiCodeBlock } from 'react-icons/bi';
import { MdCancel } from 'react-icons/md';
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
    const [code, setCode] = useState('');
    const [codeFieldIOpt, setCodeFieldIOpt] = useState(false);
    const [language, setLanguage] = useState('');
    const [languageMonaco, setLanguageMonaco] = useState('');

    const [posts, setPosts] = useState([]);

    function printaCode(){
        console.log(code);
        setCode('');
        setCodeFieldIOpt(false);
    }

        function setProgLanguage(language){
            let data = {
                language:language,
            }

            localStorage.setItem('@languageForm', JSON.stringify(data));
        }

    useEffect(()=>{
        
        setLanguageMonaco(language);
    },[])

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
                nvlProgramacao: doc.data().nvlProgramacao,
                flg_code: doc.data().flg_code,
                code: doc.data().code,
                prog_language: doc.data().prog_language,
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
                        nvlProgramacao: doc.data().nvlProgramacao,
                        flg_code: doc.data().flg_code,
                        code: doc.data().code,
                        prog_language: doc.data().prog_language,
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

    if(code != '' && code != "'//Cole seu código aqui...'"){
        await addPost(tituloPost, tagsPost, conteudoPost, imgPost, 1, code, language);
    }else{
       await addPost(tituloPost, tagsPost, conteudoPost, imgPost, 0, null, null);
    }
       setCode('//Cole seu código aqui...');
       setCodeFieldIOpt(false);
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

    function cancelCodeMsg(){
        setCode('//Cole seu código aqui...');
        setCodeFieldIOpt(false);
        
    }

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
                                    <input type="text" placeholder="Titulo da postagem..." value={tituloPost} onChange={(e)=>{setTituloPost(e.target.value)}} required/>
                                    <label>Tags:</label>
                                    <input type="text" placeholder="Tags da postagem..." value={tagsPost} onChange={(e)=>{setTagsPost(e.target.value)}} required/>
                                </div>
                                
                                <textarea maxlength="155" cols="20" rows="1" placeholder="Digite sua postagem..." value={conteudoPost} onChange={(e)=>{setConteudoPost(e.target.value)}}required></textarea>
                                
                                {
                                codeFieldIOpt === true ?
                                <div>
                                    <div className="opts-code-field">
                                    <select onChange={(e) => { setLanguage(e.target.value); } } className="select-code-language" required>
                                                <option value="" disabled="" hidden="" selected="">Selecione a linguagem...</option>
                                                <option value="plaintext">plaintext</option>
                                                <option value="abap">abap</option>
                                                <option value="apex">apex</option>
                                                <option value="azcli">azcli</option>
                                                <option value="bat">bat</option>
                                                <option value="bicep">bicep</option>
                                                <option value="cameligo">cameligo</option>
                                                <option value="clojure">clojure</option>
                                                <option value="coffeescript">coffeescript</option>
                                                <option value="c">c</option>
                                                <option value="cpp">cpp</option>
                                                <option value="csharp">csharp</option>
                                                <option value="csp">csp</option>
                                                <option value="css">css</option>
                                                <option value="cypher">cypher</option>
                                                <option value="dart">dart</option>
                                                <option value="dockerfile">dockerfile</option>
                                                <option value="ecl">ecl</option>
                                                <option value="elixir">elixir</option>
                                                <option value="flow9">flow9</option>
                                                <option value="fsharp">fsharp</option>
                                                <option value="go">go</option>
                                                <option value="graphql">graphql</option>
                                                <option value="handlebars">handlebars</option>
                                                <option value="hcl">hcl</option>
                                                <option value="html">html</option>
                                                <option value="ini">ini</option>
                                                <option value="java">java</option>
                                                <option value="javascript">javascript</option>
                                                <option value="julia">julia</option>
                                                <option value="kotlin">kotlin</option>
                                                <option value="less">less</option>
                                                <option value="lexon">lexon</option>
                                                <option value="lua">lua</option>
                                                <option value="liquid">liquid</option>
                                                <option value="m3">m3</option>
                                                <option value="markdown">markdown</option>
                                                <option value="mips">mips</option>
                                                <option value="msdax">msdax</option>
                                                <option value="mysql">mysql</option>
                                                <option value="objective">objective-c</option>
                                                <option value="pascal">pascal</option>
                                                <option value="pascaligo">pascaligo</option>
                                                <option value="perl">perl</option>
                                                <option value="pgsql">pgsql</option>
                                                <option value="php">php</option>
                                                <option value="pla">pla</option>
                                                <option value="postiats">postiats</option>
                                                <option value="powerquery">powerquery</option>
                                                <option value="powershell">powershell</option>
                                                <option value="proto">proto</option>
                                                <option value="pug">pug</option>
                                                <option value="python">python</option>
                                                <option value="qsharp">qsharp</option>
                                                <option value="r">r</option>
                                                <option value="razor">razor</option>
                                                <option value="redis">redis</option>
                                                <option value="redshift">redshift</option>
                                            </select>
                                            <MdCancel className="btn-cancel-code" color="#FFF" size={24} onClick={()=>{cancelCodeMsg();}}/>
                                            </div>
                                            <div className='code-field'>
                                                    <Editor
                                                        height="200px"
                                                        defaultLanguage={`plaintext`}
                                                        theme='vs-dark'
                                                        defaultValue='//Cole seu código aqui...'
                                                        value={code}
                                                        onChange={(e)=>{setCode(e)}}/>;
                                                </div></div>: <></> } 
                    

                                </div>
                            </div>
                            <div className="options-add-post" >
                                {imgUrl === null ? (
                                    <></>
                                ) : (
                                    <img src={imgUrl} alt="Foto de Post"/>
                                )}
                               <label className='btn-code-field' onClick={()=>{setCodeFieldIOpt(true);}}>
                                    <BiCodeBlock color="#FFF" size={25}/>
                                </label> 
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

                <div className='div-header'>
                    <h1 className="h1-header-feed">Veja o que está acontecendo no mundo da programação...</h1>
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