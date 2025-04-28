import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AnonymousRoutes() {
    return ( 
        <>
        <Navbar/>
            <Outlet/>
        <Footer/>
        </>
     );
}

export default AnonymousRoutes;