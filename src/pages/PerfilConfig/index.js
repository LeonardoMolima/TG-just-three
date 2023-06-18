import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { toast } from 'react-toastify';

import { db, storage } from "../../services/FirebaseConnection";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import SideMenu from "../../components/SideMenu";
import avatarPerfil from '../../assets/img/avatar.png';
import { AiOutlineCamera } from 'react-icons/ai'
import "./perfilConfig.css";


function PerfilConfig(){

    const { user, storageUser, setUser } = useContext(AuthContext);

    const [avatarUrl, setAvatarUrl] = useState(user && user.fotoPerfil);
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [ nome, setNome] = useState(user && user.nome);
    const [ nomeUser, setNomeUser] = useState(user && user.nomeUser);
    const [ email, setEmail] = useState(user && user.email);
    const [ biografia, setBiografia] = useState(user && user.biografia);
    const [ nvlProgramacao, setNvlProgramacao] = useState(user && user.nvlProgramacao);

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === "image/jpeg" || image.type === "image/png"){
                setFotoPerfil(image);
                setAvatarUrl(URL.createObjectURL(image));
            }else{
                toast.error("Tipo de arquivo não suportado!!");
                setFotoPerfil(null);
                return;
            }
        }
    }

    async function handleUploadFoto(){
        const currentUid = user.uid;

        const updloadRef = ref(storage, `image/${currentUid}/${fotoPerfil.name}`);

        const uploadTask =uploadBytes(updloadRef, fotoPerfil)
        .then( (snapshot) => {
            getDownloadURL(snapshot.ref).then( async ( downloadURL) => {
                let urlFoto = downloadURL;

                const docRef = doc(db, 'users', user.uid)
                await updateDoc(docRef, {
                    fotoPerfil: urlFoto,
                    nome: nome,
                    biografia: biografia,
                    nvlProgramacao:nvlProgramacao,
                })
                .then( () => {
                    let data = {
                        ...user,
                        fotoPerfil: urlFoto,
                        nome: nome,
                        biografia: biografia,
                        nvlProgramacao:nvlProgramacao,
                    }
    
                    setUser(data);
                    storageUser(data);
                    toast.success("Dados atualizados!");
                })
            })
        })
    }

    async function handleSubmit(e){
        e.preventDefault();

        if(fotoPerfil === null && nome != '' && biografia === null || fotoPerfil === null && nome != '' && biografia === user.biografia){
            //logica para alterar somente o nome
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, {
                nome:nome,
                nvlProgramacao:nvlProgramacao,
            })
            .then( () => {
                let data = {
                    ...user,
                    nome: nome,
                    nvlProgramacao:nvlProgramacao,
                }

                setUser(data);
                storageUser(data);
                toast.success("Dados atualizados!");

            });
        // }if( nvlProgramacao !== null && fotoPerfil !== null){
        //     //lógica para mudar o nome e a biografia
        //     const docRef = doc(db, 'users', user.uid);
        //     await updateDoc(docRef, {
        //         nome:nome,
        //         biografia: biografia,
        //         nvlProgramacao:nvlProgramacao,
        //     })
        //     .then( () => {
        //         let data = {
        //             ...user,
        //             nome:nome,
        //             biografia: biografia,
        //             nvlProgramacao:nvlProgramacao,
        //         }

        //         handleUploadFoto();
        //         setUser(data);
        //         storageUser(data);
        //     });
        }else if(fotoPerfil === null && nome === user.nome && biografia !== ''){
            //logica para alterar somente a biografia
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, {
                biografia:biografia,
                nvlProgramacao:nvlProgramacao,
            })
            .then( () => {
                let data = {
                    ...user,
                    biografia: biografia,
                    nvlProgramacao:nvlProgramacao,
                }

                setUser(data);
                storageUser(data);
                toast.success("Dados atualizados!");
            });
        }else if(fotoPerfil === null && nome !== '' && biografia !== ''){
            //lógica para mudar o nome e a biografia
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, {
                nome:nome,
                biografia:biografia,
                nvlProgramacao:nvlProgramacao,
            })
            .then( () => {
                let data = {
                    ...user,
                    nome:nome,
                    biografia: biografia,
                    nvlProgramacao:nvlProgramacao,
                }

                setUser(data);
                storageUser(data);
                toast.success("Dados atualizados!");
            });
        } else if(fotoPerfil !== null && nome !== '' && biografia !== ''){
            //função para alteracao de foto
            handleUploadFoto();
        }
}


    return(
        <div>
            <SideMenu/>

            <div className="content">

                <div className="container">

                    <form className="form-profile" onSubmit={handleSubmit}>

                        <label className="label-avatar">
                            <span>
                                <AiOutlineCamera color="#FFF" size={25}/>
                            </span>
                            <input type="file" accept="image/*" onChange={handleFile}/> <br/>

                            {avatarUrl === null ? (
                                <img src={avatarPerfil} alt="Foto de Perfil" />
                            ) : (
                                <img src={avatarUrl} alt="Foto de Perfil" />
                            )}
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>Nome de usuário</label>
                        <input type="text" value={nomeUser} disabled/>

                        <label>Email</label>
                        <input type="text" value={email} disabled/>

                        <label>Biografia</label>
                        <textarea maxlength="155" cols="20" rows="1" value={biografia === null ? "Minha biografia..." : biografia} onChange={(e) => setBiografia(e.target.value)}></textarea>

                        <label>Nível na Programação</label>
                        <select name="nvlProgramacao" onChange={(e)=>{ setNvlProgramacao(e.target.value)}}>
                            <option value="null" disabled selected>{nvlProgramacao}</option>
                            <option value={'Iniciante'}>Iniciante</option>
                            <option value={'Estagiário'}>Estagiário</option>
                            <option value={'Junior'}>Junior</option>
                            <option value={'Pleno'}>Pleno</option>
                            <option value={'Sênior'}>Sênior</option>
                        </select>
                        
                        <button type="submit">Salvar alterações</button>
                    </form>

                </div>

            </div>

        </div>
    )
}

export default PerfilConfig;