import { Fragment, ReactNode, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { useFetchHistoryDetailQuery, useGeneratePickupQRCodeQuery } from '../store';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { CircularProgress } from '@mui/joy';
import { Link } from 'react-router-dom';

interface OpenModal {
    open: boolean;
    onHide: Function; 
    children?: ReactNode;
    item:any;
}

function ModalHistory({ open ,onHide ,item }:OpenModal) {
    const navigate = useNavigate();
    const cancelButtonRef = useRef(null);
    const { data:qrCode, isFetching:isQRCode, error:errorQRCode} = useGeneratePickupQRCodeQuery({orderId:item?.orderId});
    const { data:items, isFetching:isItem, error:errorItem } = useFetchHistoryDetailQuery(item?.orderId);
    
    if(errorQRCode || errorItem){
        Cookies.remove('jwt',{ path: '/' });
        Cookies.remove('userdata', { path: '/' });
        Cookies.remove('orders', { path: '/' });

        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: `Please Login!`,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: true,
        });

        navigate('/login');
    }

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
                                <div className="bg-white p-6">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center">                         
                                            <div className= "container">
                                                <div className="mx-10">
                                                    {isQRCode || errorQRCode || isItem || errorItem ?
                                                    <div className="rounded-b-md py-8 flex justify-center">
                                                        <span className="w-56 h-56 flex justify-center items-center">
                                                            <CircularProgress /> 
                                                        </span>
                                                    </div> 
                                                    : 
                                                    ( (qrCode.results===null) ?
                                                        <></>
                                                        :
                                                    <img className="w-72 mx-auto" src={qrCode.results} alt="QRCode"/>)}
                                                    {
                                                        isItem || errorItem || isQRCode || errorItem ?
                                                        <></>
                                                    :
                                                    <>
                                                    <Link to={`/infostore/${item?.store?.storeId}`} className="p-2 border border-gray-200 flex justify-between items-center">
                                                        <div className="kanit text-lg mx-2 flex items-center cursor-pointer">
                                                            {item?.store?.name}
                                                        </div>
                                                    </Link>
                                                    { items?.map((filteredItem:any) => (
                                                        <div key={filteredItem?.orderId} className="mx-4 my-4 items-center flex justify-between">
                                                            <div className="flex items-center w-96">
                                                                <img
                                                                    src={require(`C:/image/Files-Upload/products/${filteredItem?.product?.imgProduct}`)}
                                                                    alt="img_product"
                                                                    className="rounded-3xl shadow-lg w-10 h-10"
                                                                />
                                                                <div className="kanit ml-2 flex">
                                                                    <p className="text-sm">{filteredItem?.product?.name}</p> 
                                                                </div>
                                                            </div>
                                                            <div className="kanit text-sm flex text-gray-500">
                                                                {filteredItem?.quantity} X 
                                                                <p className="ml-1">{filteredItem?.price}</p>
                                                            </div>
                                                    </div>
                                                    ))}
                                                    <div className="flex justify-between kanit text-red-500 mx-4 my-3 text-lg">
                                                        <p>ราคารวม</p>
                                                        <p>{item?.totalAmount}</p>
                                                    </div></>}
                                                </div>
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
     );
}

export default ModalHistory;