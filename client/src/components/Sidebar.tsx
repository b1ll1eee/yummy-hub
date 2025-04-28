import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePoweroff } from 'react-icons/ai'
import  CartDefault from "../img/icon-bag.svg";
import CartHover from "../img/icon-bag copy.svg";
import FavoriteDefault from "../img/icon-favorite.svg"
import FavoriteHover from "../img/icon-favorite copy.svg"
import { IoDocumentTextOutline } from 'react-icons/io5'


interface OpenModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; 
}
export default function Sidebar({open,setOpen}:OpenModal) {
  const navigate = useNavigate();
  const user = Cookies.get('userdata') !== undefined ? Cookies.get('userdata') : null;
  const [isCart, setIsCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleMouseEnterCart = () => {
    setIsCart(true);
  };

  const handleMouseLeaveCart = () => {
    setIsCart(false);
  };

  const handleMouseEnterFavorite = () => {
    setIsFavorite(true);
  };

  const handleMouseLeaveFavorite = () => {
    setIsFavorite(false);
  };

  let userData;
  if(user){
    userData = JSON.parse(user)
  }
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
    setOpen(false);
    window.location.reload();
    navigate("/");
  }

  return (
    <Transition.Root show={open} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={setOpen}>
      <Transition.Child
        as={Fragment}
        enter="ease-in-out duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in-out duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="pointer-events-auto relative w-screen max-w-xs">
                <div className="flex h-full flex-col bg-white py-9 shadow-xl">
                  <div className="px-6">
                    <Dialog.Title className="text-2xl font-semibold leading-6 text-gray-900 kanit">
                      ยินดีต้อนรับ
                    </Dialog.Title>
                    <Dialog.Title className="text-lg mt-3 ml-2 font-semibold leading-6 text-red-600  kanit">
                      คุณ {userData?.firstname} {userData?.lasname}
                    </Dialog.Title>
                  </div>
                  <div className="relative mt-6 flex-1 px-6">
                    <div className='kanit text-gray-500 hover:text-red-500 font-thin my-8'>
                      <Link to='/history' className='flex items-center'>
                        <IoDocumentTextOutline size={23} className='mr-2'/>
                        ออเดอร์
                      </Link>
                    </div>
                    <div 
                        className={`kanit font-thin my-8 ${isCart ? 'text-red-500' : 'text-gray-500'}`}
                        onMouseEnter={handleMouseEnterCart}
                        onMouseLeave={handleMouseLeaveCart}
                    >
                      <Link to='/cart' className='flex items-center'>
                        <img  
                              src={isCart ? CartHover : CartDefault}
                              className='mr-2 w-5' 
                              alt='cart' 
                        />
                        ตะกร้าสินค้า
                      </Link>
                    </div>                      
                    <div 
                        className={`kanit font-thin my-8 ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                        onMouseEnter={handleMouseEnterFavorite}
                        onMouseLeave={handleMouseLeaveFavorite}
                    >
                      <Link to='/favorite' className='flex items-center'>
                        <img  src={isFavorite ? FavoriteHover : FavoriteDefault} 
                              className='mr-2 w-6' 
                              alt='cart'
                        />
                        ร้านค้าที่ชื่นชอบ
                      </Link>
                    </div>
                  </div>
                  <div className="relative px-4 kanit px-6">
                    <div className='cursor-pointer text-gray-500 font-thin hover:text-red-500 flex items-center' onClick={handleLogout}>
                      <AiOutlinePoweroff className='mr-2'/>
                      ออกจากระบบ
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
  );
}