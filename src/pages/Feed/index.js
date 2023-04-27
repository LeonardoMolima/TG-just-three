import { async } from "@firebase/util";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { db, storage } from "../../services/FirebaseConnection";
import firebase from "firebase/compat/app";

import { BsCardImage } from 'react-icons/bs';
import avatarPerfil from '../../assets/img/avatar.png';
import SideMenu from "../../components/SideMenu";
import './feed.css';
import { toast } from "react-toastify";

function Feed(){
    const { user } = useContext(AuthContext);

    return(
        <div>
            <SideMenu/>

            <div className="content">
                <div className="card-add-post">
                    <form>
                        <div className="area-post">
                            <div className="post">
                                <img src={user.fotoPerfil === null ? avatarPerfil : user.fotoPerfil}/>
                                <div className="inputs-post">
                                
                                <textarea maxlength="155" cols="20" rows="1" placeholder="Digite sua postagem..."></textarea>
                                </div>
                            </div>
                            <div className="options-add-post" >
                                <label className="label-add-post">
                                    <span>
                                        <BsCardImage color="#FFF" size={25}/>
                                    </span>
                                    <input type="file" hidden/>
                                </label>
                                <button type="submit">Publicar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Feed;