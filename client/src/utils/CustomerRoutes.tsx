import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function CustomerRoutes() {
    return ( 
        <>
        <Navbar/>
            <Outlet/>
        <Footer/>
        </>
     );
}

export default CustomerRoutes;