import { useState, createContext, useEffect } from "react";
import { auth, db, storage } from '../services/FirebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});

function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const data = new Date();

    let dataAtual = formataData(data);
    let horaAtual = formataHora(data);

    function addZeroEsquerda(num){
        return num >= 10 ? num :`0${num}`;
    }

    function formataData(data){
        const dia = addZeroEsquerda(data.getDate());
        const mes = addZeroEsquerda(data.getMonth() + 1);
        const ano = addZeroEsquerda(data.getFullYear());

        return [dia, mes, ano];
    }

    function formataHora(data){
        const hora = addZeroEsquerda(data.getHours());
        const minuto = addZeroEsquerda(data.getMinutes());
        const segundos = addZeroEsquerda(data.getSeconds());

        return `${hora}:${minuto}:${segundos}`;
    }

    useEffect(() => {
        async function loadUser(){
            const storageUser = localStorage.getItem('@userJustThree');

            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }

            setLoading(false);
        }

        loadUser();
    },[])

    async function logIn(email, password){
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, password)
        .then( async (value) => {
            let uid = value.user.uid;

            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            let data = {
                uid: uid,
                nome: docSnap.data().nome,
                nomeUser: docSnap.data().nomeUser, 
                email: value.user.email,
                biografia: docSnap.data().biografia,
                genero: docSnap.data().genero,
                nvlProgramacao: docSnap.data().nvlProgramacao,
                fotoPerfil: docSnap.data().fotoPerfil
                }

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success("Bem vindo(a) de volta!");
            navigate("/feed");
        })
        .catch( (error) => {
            console.log(error);
            setLoadingAuth(false);
            toast.error("Email ou senha errados!");
        })
    }

   async function addUser(nome, nomeUser, email, password, genero, nvlProgramacao){
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
        .then( async (value) => {
            let uid = value.user.uid;

            await setDoc(doc(db, "users", uid), {
                nome: nome,
                nomeUser: nomeUser,
                biografia:null,
                genero: genero,
                nvlProgramacao: nvlProgramacao,
                fotoPerfil: null,
            })
            .then( () => {

                let data = {
                uid:uid,
                nome: nome,
                nomeUser: nomeUser,
                email: value.user.email,
                biografia:null,
                genero: genero,
                nvlProgramacao: nvlProgramacao,
                fotoPerfil: null,
                }

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success("Seja bem vindo(a)!");
                navigate("/feed");

            })
        })
        .catch( (error) => {
            console.log(error);
            setLoadingAuth(false);
        })
    }

    function storageUser(data){
        localStorage.setItem('@userJustThree', JSON.stringify(data));
    }

    async function logout(){
        await signOut(auth);
        localStorage.removeItem('@userJustThree');
        setUser(null);
    }

    async function handleUploadFotoPost(tituloPost, tagsPost, conteudoPost, imagem, flg_code = null, code = null, prog_language = null){
        const currentUid = user.uid;

        const updloadRef = ref(storage, `post/${currentUid}/${tituloPost}/${imagem.name}`);

        const uploadTask =uploadBytes(updloadRef, imagem)
        .then( (snapshot) => {
            getDownloadURL(snapshot.ref).then( async ( downloadURL) => {
                let urlFoto = downloadURL;

                await addDoc(collection(db, 'posts'), {
                    uid_userPost: user.uid,
                    fotoUserPost: user.fotoPerfil,
                    nomeAutor: user.nome,
                    nomeUserAutor: user.nomeUser,
                    nvlProgramacao: user.nvlProgramacao,
                    titulo:tituloPost,
                    tags:tagsPost,
                    conteudo:conteudoPost,
                    imagem:urlFoto,
                    dataOrdem: Date.now(),
                    diaPost: dataAtual[0],
                    mesPost: dataAtual[1],
                    anoPost: dataAtual[2],
                    horaPost: horaAtual,
                    flg_code: flg_code,
                    code: code,
                    prog_language: prog_language
                })
                .then(()=>{
                    toast.success('POST ENVIADO!');
                })
                .catch((error)=>{
                    console.log("ERRO: "+ error);
                });
                })
        })
    }

    async function addComment(conteudo, idPostComentado){

        await addDoc(collection(db, 'comments'), {
            uid_userPost: user.uid,
            fotoUserPost: user.fotoPerfil,
            nomeAutor: user.nome,
            nomeUserAutor: user.nomeUser,
            uid_postComentado: idPostComentado,
            conteudo:conteudo,
            nvlProgramacao: user.nvlProgramacao,
            dataOrdem: Date.now(),
            diaPost: dataAtual[0],
            mesPost: dataAtual[1],
            anoPost: dataAtual[2],
            horaPost: horaAtual
        })
        .then(()=>{
            toast.success('COMENTÁRIO ENVIADO!');
        })
        .catch((error)=>{
            console.log("ERRO: "+ error);
        });

    }

    async function addPost(titulo, tags, conteudo, imagem, flg_code = null, code = null, prog_language = null){

        if(imagem === null){
            await addDoc(collection(db, 'posts'), {
                uid_userPost: user.uid,
                fotoUserPost: user.fotoPerfil,
                nomeAutor: user.nome,
                nomeUserAutor: user.nomeUser,
                nvlProgramacao: user.nvlProgramacao,
                titulo:titulo,
                tags:tags,
                conteudo:conteudo,
                imagem:null,
                dataOrdem: Date.now(),
                diaPost: dataAtual[0],
                mesPost: dataAtual[1],
                anoPost: dataAtual[2],
                horaPost: horaAtual,
                flg_code: flg_code,
                code: code,
                prog_language: prog_language
            })
            .then(()=>{
                toast.success('POST ENVIADO!');
            })
            .catch((error)=>{
                console.log("ERRO: "+ error);
            });
        }else{
            await handleUploadFotoPost(titulo, tags, conteudo, imagem, flg_code, code, prog_language);
        }
    }

    return(
        <AuthContext.Provider value={{
            logado: !!user,
            user,
            logIn,
            addUser,
            logout,
            loadingAuth,
            loading,
            storageUser,
            setUser,
            addPost,
            addComment,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;