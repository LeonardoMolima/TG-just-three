import SideMenu from "../../components/SideMenu";
import { Link } from 'react-router-dom';
import { VscSettingsGear }  from 'react-icons/vsc';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

import avatarPerfil from '../../assets/img/avatar.png';
import './perfil.css';


function Perfil(){

    const { user } = useContext(AuthContext);

    return(
        <div>
            <SideMenu/>

            <div className="content">
                <div className="card-perfil">
                    <div className="card-foto">
                        <img src={user.fotoPerfil === null ? avatarPerfil : user.fotoPerfil}/>
                    </div>
                    <div className="card-info">
                        <div className="row1">
                            <h1>{user.nome}</h1>
                            <span>@{user.nomeUser}</span>
                            <Link to="/perfil/config">
                            <VscSettingsGear color="#FFF" size={20}/>
                            </Link>
                        </div>
                        <div className="row2">
                            <h2>Posts 0</h2>
                            <h2>Seguidores 0</h2>
                            <h2>Seguindo 0</h2>
                        </div>
                        <div className="row3">
                            <h2 className="bio">{user.biografia === null ? "" : user.biografia}</h2>
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

export default Perfil;