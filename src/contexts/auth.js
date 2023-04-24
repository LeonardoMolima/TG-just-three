import { useState, createContext, useEffect } from "react";
import { auth, db } from '../services/FirebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';

import { Await, useNavigate } from "react-router-dom";
import { async } from "@firebase/util";

export const AuthContext = createContext({});

function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

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
                dataNascimento: docSnap.data().dataNascimento,
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

   async function addUser(nome, nomeUser, email, password, genero, dataNascimento){
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
        .then( async (value) => {
            let uid = value.user.uid;

            await setDoc(doc(db, "users", uid), {
                nome: nome,
                nomeUser: nomeUser,
                biografia:null,
                genero: genero,
                dataNascimento: dataNascimento,
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
                dataNascimento: dataNascimento,
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

    return(
        <AuthContext.Provider value={{
            logado: !!user,
            user,
            logIn,
            addUser,
            logout,
            loadingAuth,
            loading,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;