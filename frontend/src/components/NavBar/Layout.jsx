import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";

function Layout ({children}){
    const location = useLocation();
    const hideNavbar = ["/login", "/signup"].includes(location.pathname);



    return (
        <div>
            {!hideNavbar && <NavBar />}
            <main className="main">{children}</main>
        </div>
    )
}

export default Layout;

