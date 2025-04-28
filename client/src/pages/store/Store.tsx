import { useState,useEffect } from "react";
import { NavLink,Outlet } from "react-router-dom";
import {
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { FiLogOut } from "react-icons/fi";
import { FaBars,FaXmark } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { StoreAuth } from '../../Model/Store'
import { useLocation } from "react-router-dom";
import StoreInfo from "../../components/StoreInfo";

function NavList({className}:any) {
    let active: string;
    const navigate = useNavigate();
    if(!className && className !== undefined){
        active = "pt-3 text-yellow-500 text-base";
    }else{
        active = "pb-1 text-yellow-500 text-base ";
    }
    
    useEffect(() => {
        
    }, [className]);

    const handleLogout = async () => {
        Cookies.remove('jwt',{ path: '/' });
        Cookies.remove('userdata', { path: '/' });
        Swal.fire({
            icon: 'success',
            title: 'Logout',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: true,
            text: 'Logout Successful',
        });
        navigate("/");
    }

    return (
        <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 pb-4 pt-3 ml-4">
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-medium" 
            >
                <NavLink 
                    to='/store'  
                    className='text-base text-white'
                >
                    STORE
                </NavLink>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-medium"
            >
                <NavLink 
                    to="product" 
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? active:"text-base text-white"
                    }
                >
                    Product
                </NavLink>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-medium"
            >
                <NavLink 
                    to="order" 
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? active:"text-base  text-white"
                    }
                >
                    Order
                </NavLink>
            </Typography>
            {!className && className !== undefined ? (
                <></>
            ):
                <Typography
                    as="li"
                    variant="small"
                    className="p-1 font-medium mx-4 cursor-pointer py-3 hover:text-yellow-500"
                >
                <div onClick={handleLogout} className="flex justify-center items-center text-white">
                    Logout<FiLogOut className="ml-2" size={18}/>
                </div>
                </Typography>
            }
        </ul>
    );
}
 
function Store(storeData:StoreAuth) {
    const [openNav, setOpenNav] = useState(false);
    const navigate = useNavigate();
    const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);
    const { pathname } = useLocation();
    const path = pathname.split('/store');
 
    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    const handleLogout = () => {
        Cookies.remove('jwt',{ path: '/' });
        Cookies.remove('userdata', { path: '/' });
        Swal.fire({
            icon: 'success',
            title: 'Logout',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: true,
            text: 'Logout Successful',
        });
        navigate("/");
    }


    return (
        <div>
            <div className="px-6 py-2 bg-blue-950 border-blue-900 p-0">
                <div className="flex items-center justify-between text-blue-gray-900">
                    <div className="hidden lg:block">
                        <NavList className={openNav}/>
                    </div>
                    <Typography
                        as="a"
                        href="#"
                        variant="h6"
                        className="hidden lg:block mx-4 cursor-pointer py-3 text-white hover:text-yellow-500"
                    >
                        <div onClick={handleLogout} className="flex justify-center items-center ">
                            Logout<FiLogOut className="ml-2" size={18}/>
                        </div>
                    </Typography>
                    <IconButton
                        variant="text"
                        className="h-7 w-7 my-4 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden flex ml-4"
                        ripple={false}
                        onClick={() => setOpenNav(!openNav)}
                        >
                        {openNav ? (
                            <FaXmark className="h-7 w-7"/>
                        ) : ( 
                            <FaBars className="h-7 w-7"/>
                        )}
                    </IconButton>
                </div>
                <Collapse open={openNav}>
                    <NavList />
                </Collapse>
            </div>
            {path[1] === ''?(
                <StoreInfo
                    id={storeData.storeId}
                />
            ):(
                <Outlet/> 
            )            
            }
        </div>
    );
}

export default Store;