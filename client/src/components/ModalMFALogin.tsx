import { Fragment, ReactNode, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { useMFACodeQuery } from '../store';
import { LoginUser } from '../Model/User';
import { Button } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Swal from 'sweetalert2';
import Media from './Media';
import { userLoginMFA } from '../store';
import { useAppDispatch } from '../hook/use-dispatch-selector';
import Cookies from "js-cookie";
import otp from '../img/transaction-password-otp-verification-code-security.svg'
import { useDispatch } from 'react-redux';
import { authStoreApi } from '../store/apis/authStoreApi';
import { cartApi } from '../store/apis/cartApi';
import { paymentApi } from '../store/apis/paymentApi';

interface OpenModal {
    open: boolean;
    onHide: Function; 
    children?: ReactNode;
    title?:string;
    user?:LoginUser
    setUser:Function; 
}

export default function ModalMFALogin({ open, onHide,children,title,user,setUser }: OpenModal) {
    const appDispatch = useAppDispatch();
    const dispatch = useDispatch();
    const { data:MFA,isFetching:MFAFetching,isError:MFAError } = useMFACodeQuery(user?.userId);
    const navigate = useNavigate();
    const cancelButtonRef = useRef(null);

    if(MFAError){
        navigate("/");
    }

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        Swal.fire({
            timerProgressBar: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            background: 'transparent',
            didOpen: () => {
              Swal.showLoading();
            }
          })

        const formElement = e.target as HTMLFormElement;
        const inputElement = formElement.querySelector('[name="codeTwoFactorAuthentication"]') as HTMLInputElement;
        const inputValue = inputElement.value;
        if (user && MFA) {
            user.secretcode = inputValue;
            const result = await appDispatch(userLoginMFA(user));

            if (result.payload?.status === 'UNAUTHORIZED') {
                Swal.close();
                onHide();
                    Swal.fire({
                    icon: 'error',
                    title: 'Register Failed',
                    text: `${result.payload.msg[0]}`,
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: true,
                });
            }else{
                Cookies.set('jwt', result.payload.accessToken);
                Cookies.set('userdata',JSON.stringify(result.payload.user));
                Swal.close();
                onHide();
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: true,
                    text: 'Login Successful',
                });
                const role = result.payload.user.role;
                console.log(result.payload);
                console.log(Cookies.get('jwt'));
                if(role === 'customer') {
                    dispatch(cartApi.util.resetApiState());
                    navigate('/');
                }else if(role === 'store owner') {
                    dispatch(authStoreApi.util.resetApiState());
                    navigate('/store');
                }else if(role === 'administrator') {
                    dispatch(paymentApi.util.resetApiState());
                    navigate('/admin');
                }
                setUser();
            }
        }
    };

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog 
                as="div" 
                className="relative z-10" 
                initialFocus={cancelButtonRef} 
                onClose={()=>{
                    onHide();
                }}
                >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                                <div className="bg-white px-20 py-8">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center">                         
                                            {MFAFetching ? 
                                            <div className='flex justify-center'>
                                                <Media height={50} width={210} />
                                            </div>
                                            :
                                            <Dialog.Title as="h2" className="text-2xl font-semibold leading-6 text-gray-900 flex justify-center">
                                                Verification Code
                                            </Dialog.Title>}

                                            <div>
                                                <form onSubmit={handleLoginSubmit}>
                                                    {MFAFetching ? 
                                                    <div className="flex justify-center mb-2">
                                                        <Skeleton className='my-5'  animation="wave" variant="rectangular" width={150}  height={150}/>
                                                    </div>
                                                    :
                                                    <label
                                                        className="flex justify-center mt-7"
                                                    >
                                                        <img className='w-32' src={otp} alt='otp'/>
                                                    </label>}
                                                    {MFAFetching ? <Media height={60} width={200} />:
                                                    <input
                                                        type="text"
                                                        id="codeTwoFactorAuthentication"
                                                        name="codeTwoFactorAuthentication"
                                                        className="block w-full mt-7 px-4 py-2 my-2 bg-white border rounded-md  focus:outline-none"
                                                    />}
                                                    <div className='flex justify-center'>
                                                    {MFAFetching ? <Media height={60} width={125} />:
                                                        <Button className="mt-5 w-32  mb-4" color="red" type="submit">Verify</Button>
                                                    }
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}