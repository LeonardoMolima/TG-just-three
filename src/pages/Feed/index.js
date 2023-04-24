import { async } from "@firebase/util";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";

import SideMenu from "../../components/SideMenu";

function Feed(){
    const { logout } = useContext(AuthContext);

    async function handleLogout(){
        await logout();
    }

    return(
        <div>
            <SideMenu/>
            <h1>Tela Feed</h1>
            <button onClick={handleLogout}>Sair</button>
        </div>
    )
}

export default Feed;