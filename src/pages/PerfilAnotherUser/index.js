import SideMenu from "../../components/SideMenu";
import { Link, useParams, Navigate } from 'react-router-dom';
import { VscSettingsGear }  from 'react-icons/vsc';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/FirebaseConnection";

import avatarPerfil from '../../assets/img/avatar.png';
import './perfilAnotherUser.css';
import { async } from "@firebase/util";


function PerfilAnotherUser(){

    const { user } = useContext(AuthContext);
    const [ anotherUser, setAnotherUser ] = useState({});

    const { idUser } = useParams();

    console.log("ID URL: ",idUser)
    console.log("ID USER: ",user.uid)

    useEffect(()=>{

        async function handleBtnBuscaPosts(){

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

        handleBtnBuscaPosts();
    },[])

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
                            <button>Seguir</button>
                        </div>
                        <div className="row2">
                            <h2>Posts 0</h2>
                            <h2>Seguidores 0</h2>
                            <h2>Seguindo 0</h2>
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
            </div>
            
        </div>
    )

}

export default PerfilAnotherUser;