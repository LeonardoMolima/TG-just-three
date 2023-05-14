import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/FirebaseConnection";
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { query, orderBy, where } from "firebase/firestore";

import SideMenu from "../../components/SideMenu";
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { BsChatText } from 'react-icons/bs';
import { BsCardImage } from 'react-icons/bs';
import avatarPerfil from '../../assets/img/avatar.png';
import "./favoritosPessoas.css";

function FavoritosPessoas(){

    const { user, addPost } = useContext(AuthContext);
    const [resultados, setResultados] = useState([]);
    const [ favExistsFavoritosPessoas, setFavExistsFavoritosPessoas] = useState([]);

    useEffect(()=>{
        buscaPosts();
        verificaFollow();
    },[])

    async function buscaPosts(){

        const queryPessoas = await query(collection(db,"users"))

        const postsRef = onSnapshot(queryPessoas, (snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
            lista.push({
                id: doc.id,
                nome: doc.data().nome,
                nomeUser: doc.data().nomeUser,
                fotoPerfil: doc.data().fotoPerfil,
                biografia: doc.data().biografia,
                dataNascimento: doc.data().dataNascimento,
                genero: doc.data().genero
            })
        });

        setResultados(lista);

        })
        

    }

    async function verificaFollow(){

        const queryVerificaFollow = await query(collection(db,"favoritou_favoritado"),where("id_favoritou" ,"==", user.uid))

        const postsRef = onSnapshot(queryVerificaFollow, (snapshot) => {
            let lista = [];
    
            snapshot.forEach((doc) => {
                lista.push(doc.data().id_favoritado);
            });

            setFavExistsFavoritosPessoas(lista);
            
        });
    }

    let contador = 0;
    
    return(
        <div>

            <SideMenu/>

            <div className="content">

                <div className="topo-favoritos">
                    <h1>Meus Favoritos</h1>
                </div>
                <div className="btn-opcoes-favoritos">
                    <Link to="/favoritos/postagens" className="btn-opcoes-pesquisa"><button className="btn-opcoes-pesquisa" >Postagens</button></Link>
                    <button className="btn-opcoes-pesquisa" id="btn-pessoas">Pessoas</button>
                </div>

                <div className='container-resultados'>

                {
                resultados.map( (pessoa) => {
                    if(pessoa.id === favExistsFavoritosPessoas[contador]){
                        contador++;
                        return(
                            <div className="posts-feed">
                                    <div className="infos-autor-post">
                                        <div className="img-names">
                                            {pessoa.fotoPerfil === null ? <img src={avatarPerfil}/> : <img src={pessoa.fotoPerfil}/>}
                                            <div className="nome-nomeUser">
                                                <strong>{pessoa.nome}</strong>
                                                <Link to={"/perfilUser/"+pessoa.id}>@{pessoa.nomeUser}</Link>
                                            </div>
                                        </div>

                                        <div className="data-hora-post">
                                            <span>Gênero: {pessoa.genero}</span>
                                        </div>
                                    </div>

                                        <div className="conteudo-post">
                                            <h1></h1>
                                            <span>{pessoa.biografia}</span><br/>             
                                        </div>
                                    
                                </div>
                        )
                    }else{
                        
                    }
                })
                }
            
                </div>

            </div>

        </div>
    )
}

export default FavoritosPessoas;