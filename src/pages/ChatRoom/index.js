import { useState, useContext, useEffect } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { query, collection, onSnapshot, where, orderBy, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../services/FirebaseConnection";
import { AuthContext } from '../../contexts/auth';

//Monaco
import Editor from '@monaco-editor/react';

import SideMenu from "../../components/SideMenu";
import { AiOutlineSearch, AiOutlineArrowLeft } from "react-icons/ai";
import { BsFillPlusCircleFill, BsFillArrowRightCircleFill, BsFillXCircleFill } from "react-icons/bs";
import { BsChatText, BsCardImage, BsSendFill } from 'react-icons/bs';
import { MdCancel } from 'react-icons/md';
import { BiCodeBlock } from 'react-icons/bi';
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
    const [verificaRemoveClick, setRemoveClick] = useState(null);
    const [code, setCode] = useState('');
    const [codeFieldIOpt, setCodeFieldIOpt] = useState(false);
    const [language, setLanguage] = useState('');

    const { idRoom } = useParams();

    useEffect(()=>{
        buscaMessages();
    },[]);

    useEffect(()=>{
        buscaChatRooms();
        buscaMessages();
    },[verificaRemoveClick]);
    
     function keyPress (event) {
        // Verifica se a tecla pressionada é a tecla Enter (código 13)
        if (event.keyCode === 13) {
          // Chama o método submit() no formulário
          sendMessage();
        }
    };

    async function buscaChatRooms(){

        let lista = [];
        const queryPessoas = await query(collection(db,"chatRooms"),where("idUserStartChat", "==", user.uid));
        
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

        const queryPessoas2 = await query(collection(db,"chatRooms"),where("idUserJoinChat", "==", user.uid));

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
            setPesquisa('');
            optClick("adicionou");
            toast.success('Sala Criada!');
        })
        .catch((error)=>{
            console.log("ERRO: "+ error);
        });
    }

    async function removeChatRoom(idChatRoom){
        const docRef = doc(db, "chatRooms", idChatRoom);
        await deleteDoc(docRef)
        .then(()=>{
            toast.success('Chat Room Deletado!');
        });
    }

    function optClick (opt){
        if(opt === "adicionou"){
            setRemoveClick(opt);
        }
        if(opt === "removeu"){
            setRemoveClick(opt);
        }
        else{
            return
        }
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

        if(newMessage === '' || newMessage === null){
            toast.error("Escreva uma mensagem!");
            return
        }

        const containerMessage = document.querySelector('.container-message');

        let altura = containerMessage.scrollHeight;
        console.log(altura);
        containerMessage.scrollTo(0, altura);

        if(code != '' && code != '//Cole seu código aqui...'){
            await addDoc(collection(db, 'messages'), {
                idRoom: idRoom,
                id_autor: user.uid,
                message: newMessage,
                dataEnvio: Date.now(),
                flg_code: 1,
                code: code,
                prog_language: language
            })
            .then(()=>{
                console.log("Enviou!");
                setNewMessage('');
                setCodeFieldIOpt(false);
                setCode('//Cole seu código aqui...');
            })
            .catch((error)=>{
                console.log("ERRO: "+ error);
            });
        }else{
            await addDoc(collection(db, 'messages'), {
                idRoom: idRoom,
                id_autor: user.uid,
                message: newMessage,
                dataEnvio: Date.now(),
                flg_code: 0,
                code: null,
                prog_language: null
            })
            .then(()=>{
                console.log("Enviou!");
                setNewMessage('');
                setCode('//Cole seu código aqui...');
                setCodeFieldIOpt(false);
                
            })
            .catch((error)=>{
                console.log("ERRO: "+ error);
            });
        }

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
                dataEnvio: doc.data().dataEnvio,
                flg_code: doc.data().flg_code,
                code: doc.data().code,
                prog_language: doc.data().prog_language,

            })
        });

        setTimeout(()=>{const containerMessage = document.querySelector('.container-message');
        let altura = containerMessage.scrollHeight;
        console.log(altura);
        containerMessage.scrollTo(0, altura);},100);

        setRoomMessages(lista);

        })

    }

    function cancelCodeMsg(){
        setCode('//Cole seu código aqui...');
        setCodeFieldIOpt(false);
        
    }

    return(
        <div>

            <SideMenu/>

            <div className="content">

                <div className="container-chats-chatRoom">
                    <div className="rooms-ChatRoom">
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
                                                            <Link onClick={()=>{removeChatRoom(room.id); optClick("removeu");}}><button className="btn-open-chat"><BsFillXCircleFill size={24} color="#FFF"/></button></Link>
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
                                                            <Link onClick={()=>{removeChatRoom(room.id); optClick("removeu");}}><button className="btn-open-chat"><BsFillXCircleFill size={24} color="#FFF"/></button></Link>
                                                            <Link to={"/chat/"+room.id}><button className="btn-open-chat"><BsFillArrowRightCircleFill size={24} color="#FFF"/></button></Link>
                                                        </div>
                                                    </div>
                                            </div> 
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="message-ChatRoom">
                        <div className="header-chatRoom">
                            {
                                chatRooms.map((room)=>{
                                    if(room.id === idRoom ){
                                    return(
                                        <div className="infos-header-chatRoom">
                                            {room.idUserJoinChat === user.uid ? 
                                            <><Link to={"/chat"}><button className="btn-open-chat"><AiOutlineArrowLeft size={24} color="#FFF"/></button></Link>
                                            <img className="img-header-chatRoom" src={room.foto_UserStart} />
                                            <span className="nome-header-chatRoom">{room.nome_UserStart}</span></>
                                            : 
                                            <><Link to={"/chat"}><button className="btn-open-chat"><AiOutlineArrowLeft size={24} color="#FFF"/></button></Link>
                                            <img className="img-header-chatRoom" src={room.foto_UserJoin}/>
                                            <span className="nome-header-chatRoom">{room.nome_UserJoin}</span></>}
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
                                                    
                                                    {mensagem.flg_code === 1 ? <div className="code-field-msg"><Editor
                                                        height="200px"
                                                        defaultLanguage={mensagem.prog_language}
                                                        theme='vs-dark'
                                                        value={mensagem.code}
                                                        /> </div> : <></>}
                                                    
                                                </div>
                                            </div>
                                        )
                                       } else {
                                        return(
                                            <div className="msg-left">
                                                <div className="msg-user-left">
                                                    <label className="msg">{mensagem.message}</label>

                                                    {mensagem.flg_code === 1 ? <div className="code-field-msg"><Editor
                                                        height="200px"
                                                        defaultLanguage={mensagem.prog_language}
                                                        theme='vs-dark'
                                                        value={mensagem.code}
                                                        /> </div> : <></>}

                                                </div>
                                            </div>
                                        )
                                       } 
                                    })
                                }
                                
                                
                            </div>

                            
                            
                            {
                                codeFieldIOpt === true ?
                                <div className="input-code-field">
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
                                            <MdCancel className="btn-cancel-code" color="#FFF" size={24} onClick={()=>{setCodeFieldIOpt(false)}}/>
                                        </div>
                                            <div>
                                                    <Editor
                                                        height="200px"
                                                        defaultLanguage={`plaintext`}
                                                        theme='vs-dark'
                                                        defaultValue='//Cole seu código aqui...'
                                                        value={code}
                                                        onChange={(e)=>{setCode(e)}}/>;
                                            </div>
                                </div>: <></> }

                                <div className="container-btn-send">
                                <input className="input-msg" onKeyDown={keyPress} type="text" placeholder="Digite sua mensagem..." value={newMessage} onChange={(e)=>{setNewMessage(e.target.value)}}/>
                                <BiCodeBlock  onClick={()=>{setCodeFieldIOpt(true);}} className="btn-code-msg" color="#FFF" size={24}/>
                                <button className="btn-enviar-msg" onClick={sendMessage}><BsSendFill className="btn-send-msg" color="#FFF" size={20}/></button>
                            </div>
                    </div>
    
                </div>

            </div>

        </div>
    )
}

export default ChatRoom;