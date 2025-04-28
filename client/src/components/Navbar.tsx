import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoCaretDown } from "react-icons/io5";
import Sidebar from "./Sidebar";
import Menu from "../img/menu.svg";
import Cart from "../img/icon-bag.svg";
import Favorite from "../img/icon-favorite.svg"
import Logo from "../img/logo.png"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import CartLength from './CartLength';

function Navbar() {
    const [openSideBar, setOpenSideBar] = useState(false)
    const user = Cookies.get('userdata') !== undefined ? Cookies.get('userdata') : null;
    const { state } = useLocation();
    // const { data, isFetching, error } = useFetchCartLengthQuery("");
    
    useEffect(()=>{},[state])
    
    return ( 
        <Disclosure as="nav" className="bg-white">
        {({ open }) => (
            <>
                <Sidebar open={openSideBar} setOpen={setOpenSideBar}/>
                <div className="max-w-full py-1 px-2 sm:px-6 lg:px-6">
                    <div className="relative flex h-16 items-center">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            {/* Mobile menu button*/}
                            <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            {open ? (
                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            )}
                            </Disclosure.Button>
                        </div>
                        
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                <Link to="/">
                                    <img className="w-40 ml-3" alt="Logo" src={Logo}/>
                                </Link>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 hidden sm:flex">
                            
                        <div className='flex border-r-2 border-l-2 pl-5'>
                            <div className='mr-5'>
                                <Link to='/location' className='px-7 py-3'>
                                    <span className='flex items-center kanit text-gray-600 hover:text-red-500 text-base font-medium'>
                                        <FaMapMarkerAlt className='mr-3 text-xl'/>
                                        เลือกร้านค้าใกล้เคียง
                                        <IoCaretDown className='ml-3'/>
                                    </span>
                                </Link>
                            </div>
                        </div>
                        {user ? 
                        <>
                        <div className='flex mx-7'>
                                <Link to='/cart' className='py-5'>
                                    <span className='flex items-center'>
                                        <img src={Cart} alt='cart'/>
                                        <CartLength/>
                                    </span>
                                </Link>
                        </div>
                        <div className='flex border-r-2 border-l-2 px-6'>
                                <Link to='/favorite' className='py-5'>
                                    <span className='flex items-center'>
                                        <img src={Favorite} alt='favorite'/>
                                    </span>
                                </Link>
                        </div>
                        <div className='flex mx-6'>
                                <div onClick={() => setOpenSideBar(!openSideBar)} className='py-5 cursor-pointer'>
                                    <span className='flex items-center'>
                                        <img src={Menu} alt='menu'/>
                                    </span>
                                </div>
                        </div>
                        </>
                        :
                        <div className='flex ml-5'>
                            <div className='mr-3'>
                                <Link to='/register' className='rounded-full border-2 border-red-400 px-7 py-3'>
                                    <span className='kanit text-red-500 text-sm'>สมัครสมาชิก</span>
                                </Link>
                            </div>
                            <div className='mr-6'>
                                <Link to='/login' className='rounded-full border-2 bg-red-500 border-red-500 px-9 py-3'>
                                    <span className='kanit text-white text-sm'>เข้าสู่ระบบ</span>
                                </Link>
                            </div>
                        </div>
                        }       
                        </div>
                    </div>
                </div>
                
            </>
            )}
            </Disclosure>
     );
}

export default Navbar;