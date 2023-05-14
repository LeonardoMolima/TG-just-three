import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import { AiOutlineHome, AiOutlineBell, AiOutlineSearch, AiOutlineMessage, AiOutlineStar} from 'react-icons/ai';
import { BiLogOut } from 'react-icons/bi';

import avatarPerfil from '../../assets/img/avatar.png';
import logoJustThree from '../../assets/img/logo-JustThree.png';
import './sideMenu.css';

function SideMenu(){
    const { user, logout } = useContext(AuthContext);

    async function handleLogout(){
        await logout();
    }

    return(
        <div className='sideBar'>

            <div className='logoSideBar'>
                <img src={logoJustThree}/>
            </div>

            <Link to="/feed">
                <AiOutlineHome color='#FFF' size={24}/>
                <span>Página inicial</span>
            </Link>

            <Link>
                <AiOutlineBell color='#FFF' size={24}/>
                <span>Notificações</span>
            </Link>

            <Link to="/buscar/postagens">
                <AiOutlineSearch color='#FFF' size={24}/>
                <span>Buscar</span>
            </Link>

            <Link to="/favoritos/postagens">
                <AiOutlineStar color='#FFF' size={24}/>
                <span>Favoritos</span>
            </Link>

            <Link to="/chat">
                <AiOutlineMessage color='#FFF' size={24}/>
                <span>Conversas</span>
            </Link>

            <Link to="/perfil">
                <img src={user.fotoPerfil === null ? avatarPerfil : user.fotoPerfil}/>
                <span>Perfil</span>
            </Link>

            <Link onClick={handleLogout}>
                <BiLogOut color='#FFF' size={24}/>
                <span>Sair</span>
            </Link>

    

        </div>
    )
}

export default SideMenu;