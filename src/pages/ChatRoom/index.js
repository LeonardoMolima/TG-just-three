import { useState, useContext, useEffect } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { query, collection, onSnapshot, where, orderBy, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../services/FirebaseConnection";
import { AuthContext } from '../../contexts/auth';

import SideMenu from "../../components/SideMenu";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillPlusCircleFill, BsFillArrowRightCircleFill, BsFillXCircleFill } from "react-icons/bs";
import avatarPerfil from '../../assets/img/avatar.png';
import './chat-room.css';
import { toast } from "react-toastify";
import { async } from "@firebase/util";

function ChatRoom (){

    const { user } = useContext(AuthContext);

    const [ pesquisa, setPesquisa ] = useState("");
    const [ roomMessages, setRoomMessages] = useState([]);
    const [ chatRooms, setChatRooms ] = useState([]);
    const [ newMessage, setNewMessage ] = useState("");
    const [resultados, setResultados] = useState([]);
    const { idRoom } = useParams();

    useEffect(()=>{
        buscaPosts();
    },[pesquisa])

    useEffect(()=>{
        buscaChatRooms();
        buscaMessages();
    },[])

    async function buscaChatRooms(){

        let lista = [];
        const queryPessoas = await query(collection(db,"chatRooms"),where("idUserStartChat", "==", user.uid));
        const queryPessoas2 = await query(collection(db,"chatRooms"),where("idUserJoinChat", "==", user.uid));
        const postsRef = onSnapshot(queryPessoas, (snapshot) => {
    
            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    idUserStartChat: doc.data().idUserStartChat,
                    idUserJoinChat: doc.data().idUserJoinChat,
                    foto_UserJoin: doc.data().foto_UserJoin,
                    nome_UserJoin: doc.data().nome_UserJoin,
                    nomeUser_UserJoin: doc.data().nomeUser_UserJoin,
                    dataCriacao: doc.data().dataCriacao
                })
            });

            
        });

        const postsRef2 = onSnapshot(queryPessoas2, (snapshot) => {
    
            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    idUserStartChat: doc.data().idUserStartChat,
                    idUserJoinChat: doc.data().idUserJoinChat,
                    foto_UserJoin: doc.data().foto_UserJoin,
                    nome_UserJoin: doc.data().nome_UserJoin,
                    nomeUser_UserJoin: doc.data().nomeUser_UserJoin,
                    foto_UserStart: doc.data().foto_UserStart,
                    nome_UserStart: doc.data().nome_UserStart,
                    nomeUser_UserStart: doc.data().nomeUser_UserStart,
                    dataCriacao: doc.data().dataCriacao
                })
            });

        });

        console.log(lista);
        setChatRooms(lista);
    }

    async function addChatRoom(idUserPesquisa, fotoUserJoin, nome, nomeUser){

        await addDoc(collection(db, 'chatRooms'), {
            idUserStartChat: user.uid,
            idUserJoinChat: idUserPesquisa,
            foto_UserJoin: fotoUserJoin,
            nome_UserJoin: nome,
            nomeUser_UserJoin: nomeUser,
            dataCriacao: Date.now()
        })
        .then(()=>{
            toast.success('Sala Criada!');
        })
        .catch((error)=>{
            console.log("ERRO: "+ error);
        });
    }

    //++++++++++

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
        console.log("POSTS LISTA: ",lista);

        })
        

    }

    async function sendMessage(){

        await addDoc(collection(db, 'messages'), {
            idRoom: idRoom,
            id_autor: user.uid,
            message: newMessage,
            dataEnvio: Date.now()
        })
        .then(()=>{
            console.log("Enviou!");
            setNewMessage('');
        })
        .catch((error)=>{
            console.log("ERRO: "+ error);
        });

    }

    async function deleteChatRoom(idChatRoom){
        const docRef = doc(db, "chatRooms", idChatRoom);

        await deleteDoc(docRef)
        .then(()=>{
            toast.success("ChatRoom deletado!");
        })

    }

    async function buscaMessages(){

        const queryMessages = await query(collection(db,"messages"), where("idRoom", "==", idRoom), orderBy("dataEnvio", "asc"));

        const postsRef = onSnapshot(queryMessages, (snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
            lista.push({
                id: doc.id,
                idRoom: doc.data().idRoom,
                id_autor: doc.data().id_autor,
                message: doc.data().message,
                dataEnvio: doc.data().dataEnvio
            })
        });

        setRoomMessages(lista);

        })

    }

    return(
        <div>

            <SideMenu/>

            <div className="content">

                <div className="container-chats">
                    <div className="rooms">
                        <div className="container-busca-pessoa">
                            <input type="text" className="input-buscar-pessoa-chat" placeholder="Buscar..." value={pesquisa} onChange={(e)=>{setPesquisa(e.target.value)}}/>
                            <button className="btn-buscar-pessoa-chat" ><AiOutlineSearch size={24} color="#fff" /></button>
                        </div>

                        <div className="cards-pessoas-chat">
                        {
                            pesquisa!== '' && pesquisa.length > 2 ?
                                resultados.map( (pessoa) => {
                                
                                    if(pessoa.nome.includes(pesquisa) || pessoa.nomeUser.includes(pesquisa)){
                                        return(
                                            <div className="card-pessoa-chat">
                                                    <div className="infos-pessoa-chat">
                                                        <div className="img-pessoa-chat">
                                                            {pessoa.fotoPerfil === null ? <img src={avatarPerfil}/> : <img src={pessoa.fotoPerfil}/>}
                                                            <div className="nome-nomeUser-pessoa-chat">
                                                                <strong>{pessoa.nome}</strong>
                                                                <Link to={"/perfilUser/"+pessoa.id}>@{pessoa.nomeUser}</Link>
                                                            </div>
                                                            
                                                        </div>
                                                        <div className="div-btn-open-chat">
                                                            <button className="btn-open-chat" onClick={()=>{addChatRoom(pessoa.id, pessoa.fotoPerfil, pessoa.nome, pessoa.nomeUser)}}><BsFillPlusCircleFill size={24} color="#FFF"/></button>
                                                        </div>
                                                    </div>
                                            </div>
                                        )
                                    }else{
                                        return(
                                            <></>
                                        )
                                    }
                        
                            }) : <></>
                        }
                        </div>

                        <div className="cards-pessoas-chat">
                        {
                                chatRooms.map((room)=>{

                                    return(
                                        room.idUserStartChat === user.uid ?
                                        <div className="card-pessoa-chat">
                                                    <div className="infos-pessoa-chat">
                                                        <div className="img-pessoa-chat">
                                                            {room.foto_UserJoin === null ? <img src={avatarPerfil}/> : <img src={room.foto_UserJoin}/>}
                                                            <div className="nome-nomeUser-pessoa-chat">
                                                                <strong>{room.nome_UserJoin}</strong>
                                                                <Link to={"/perfilUser/"+room.idUserJoinChat}>@{room.nomeUser_UserJoin}</Link>
                                                            </div>
                                                            
                                                        </div>
                                                        <div className="div-btn-open-chat">
                                                            <Link><button className="btn-open-chat"><BsFillXCircleFill size={24} color="#FFF"/></button></Link>
                                                            <Link to={"/chat/"+room.id}><button className="btn-open-chat"><BsFillArrowRightCircleFill size={24} color="#FFF"/></button></Link>
                                                        </div>
                                                    </div>
                                            </div> 
                                            :
                                            <div className="card-pessoa-chat">
                                                    <div className="infos-pessoa-chat">
                                                        <div className="img-pessoa-chat">
                                                            {room.foto_UserStart === null ? <img src={avatarPerfil}/> : <img src={room.foto_UserStart}/>}
                                                            <div className="nome-nomeUser-pessoa-chat">
                                                                <strong>{room.nome_UserStart}</strong>
                                                                <Link to={"/perfilUser/"+room.idUserStartChat}>@{room.nomeUser_UserStart}</Link>
                                                            </div>
                                                            
                                                        </div>
                                                        <div className="div-btn-open-chat">
                                                            <Link onClick={()=>{deleteChatRoom(room.id)}} to={"/chat"}><button className="btn-open-chat"><BsFillXCircleFill size={24} color="#FFF"/></button></Link>
                                                            <Link to={"/chat/"+room.id}><button className="btn-open-chat"><BsFillArrowRightCircleFill size={24} color="#FFF"/></button></Link>
                                                        </div>
                                                    </div>
                                            </div> 
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="message">
                        <div className="header-chatRoom">
                            {
                                chatRooms.map((room)=>{
                                    if(room.id === idRoom){
                                    return(
                                        <div className="img-header-chatRoom">
                                        </div>
                                    )}
                                })
                            }

                        </div>
                            <div className="container-message">
                                {
                                    roomMessages.map((mensagem)=>{
                                       if(mensagem.id_autor === user.uid){
                                        return(
                                            <div className="msg-right">
                                                <div className="msg-user-right">
                                                    <label className="msg">{mensagem.message}</label>
                                                </div>
                                            </div>
                                        )
                                       } else {
                                        return(
                                            <div className="msg-left">
                                                <div className="msg-user-left">
                                                    <label className="msg">{mensagem.message}</label>
                                                </div>
                                            </div>
                                        )
                                       } 
                                    })
                                }
                                
                                
                            </div>
                            <div className="container-btn-send">
                                <input className="input-msg" type="text" placeholder="Digite sua mensagem..." value={newMessage} onChange={(e)=>{setNewMessage(e.target.value)}}/>
                                <button className="btn-enviar-msg" onClick={sendMessage}>Enviar</button>
                            </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default ChatRoom;