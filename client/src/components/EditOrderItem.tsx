import { Fragment, ReactNode, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle, AiOutlineDelete } from 'react-icons/ai';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { useRemoveItemMutation, useUpdateItemMutation } from '../store';
import { useNavigate } from 'react-router';
interface OpenModal {
    open: boolean;
    onHide: Function; 
    children?: ReactNode;
    item:any;
}

function EditOrderItem({ open ,onHide ,item }:OpenModal) {

    const navigate = useNavigate();
    const cancelButtonRef = useRef(null);
    const [quantity, setQuantity] = useState(item?.quantity);
    const [ updateItem ] = useUpdateItemMutation();
    const [ removeItem ] = useRemoveItemMutation();

    const timeCheck = () => {
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
        const startTime = item?.product?.store?.storeOpen?.split(":").slice(0, 2).join(":");
        const endTime = item?.product?.store?.storeClose?.split(":").slice(0, 2).join(":");
        if(currentTime >= startTime && currentTime <= endTime){
            return true
        }
        else{
            return false
        }
    }

    const discountCheck = () => {
        const targetTime = new Date(); // Replace this with your dynamic target time
        targetTime.setHours(item?.product?.store?.storeClose?.split(":")[0], item?.product?.store?.storeClose?.split(":")[1], item?.product?.store?.storeClose?.split(":")[2]);
        const oneHourBeforeTarget = new Date(targetTime);
        oneHourBeforeTarget.setHours(oneHourBeforeTarget.getHours() - 1);
        const current = new Date();
        if (current > oneHourBeforeTarget && current < targetTime) {
            return true;
        }
        else{
            return false;
        }
    }

    const handleMinus = () => {
        if(quantity>1){
            setQuantity(quantity-1);
        }
    }

    const handlePlus = () => {
        if(quantity<item?.product?.quantityAvailable){
            setQuantity(quantity+1);
        }
    }

    const handleAddProduct = async () => {
        Swal.fire({
            timerProgressBar: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            background: 'transparent',
            didOpen: () => {
              Swal.showLoading();
            }
        })

        await updateItem({
            id:item?.orderItemId,
            itemData:{
                quantity
            }
        }).then( async (result:any) => {
            if(result?.error?.status === 500){
                await Swal.fire({
                    icon: 'error',
                    title: 'Authentication Error',
                    text: 'Please Login!',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: true,
                });
                navigate(`/login`);
            }
            else{
                await Swal.fire({
                    icon: 'success',
                    title: 'Successful',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: true,
                    text: 'ใส่ตะกร้าเรียบร้อย',
                });
                onHide()
            }
        });

        Swal.close();
    }

    const handleDelete = async() => {
        Swal.fire({
            timerProgressBar: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            background: 'transparent',
            didOpen: () => {
              Swal.showLoading();
            }
        })

        await removeItem(item?.orderItemId).then( async (result:any) => {
            if(result?.error?.status === 500){
                await Swal.fire({
                    icon: 'error',
                    title: 'Authentication Error',
                    text: 'Please Login!',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: true,
                });
                navigate(`/login`);
            }
            else{
                await Swal.fire({
                    icon: 'success',
                    title: 'Successful',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: true,
                    text: 'ลบสินค้าเรียบร้อยเรียบร้อย',
                });
                onHide()
            }
        });

        Swal.close();
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
                                <div className="bg-white px-20 py-8">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center">                         
                                        <div className= "container mx-auto">
                                                {
                                                timeCheck() ?
                                                    <div className="w-80">
                                                        <img
                                                            src={require(`C:/image/Files-Upload/products/${item?.product?.imgProduct}`)}
                                                            alt="img_product"
                                                            className="rounded-3xl shadow-lg w-80 h-56"
                                                        />
                                                        <div className='mt-10 mx-3'>
                                                            <p className="kanit text-xl font-semibold">{item?.product?.name}</p>
                                                            <div className="flex justify-between items-center mt-2">
                                                                <p className="kanit text-sm text-gray-700">{item?.product?.type?.typeName}</p>
                                                                <p className="kanit text-sm text-gray-700">จำนวน {item?.product?.quantityAvailable}</p>
                                                            </div>
                                                            <div className="flex kanit text-gray-500 text-sm">
                                                                <p className="mr-3">วันหมดอายุ</p>
                                                                <p>{format(new Date(item?.product?.expiryDate), 'dd-MM-yyyy HH:mm')}</p>
                                                            </div>
                                                            {
                                                                discountCheck() && item?.product?.discountPrice === item?.price ?
                                                                <>
                                                                    <div className="flex justify-center items-center mt-1">
                                                                        <p className="text-sm kanit text-red-500 line-through mr-1">{item?.product?.price}</p>
                                                                        <p className="text-lg kanit text-red-500">{item?.product?.discountPrice} บาท</p>
                                                                    </div>
                                                                    <div className="flex justify-center my-6 items-center text-gray-400">
                                                                        {
                                                                        quantity === 1 ? 
                                                                        <AiOutlineDelete size={25} className="mr-4 cursor-pointer" onClick={handleDelete}/>
                                                                        :
                                                                        <AiOutlineMinusCircle size={25} className="mr-4 cursor-pointer" onClick={handleMinus}/>}
                                                                        <p className="mr-4 text-black cursor-default">{quantity}</p>
                                                                        {
                                                                        quantity === item?.product?.quantityAvailable ?
                                                                        <AiOutlineMinusCircle size={25} className="mr-4 cursor-not-allowed text-gray-300"/>
                                                                        :
                                                                        <AiOutlinePlusCircle size={25} className="cursor-pointer" onClick={handlePlus}/>}
                                                                    </div>
                                                                    <div className="flex justify-center mt-8 mb-4 cursor-pointer bg-red-500 rounded-full text-white kanit py-3 mx-5 text-sm" onClick={handleAddProduct}>
                                                                        แก้ไข ({item?.product?.discountPrice * quantity} บาท)
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <p className="text-base kanit text-red-500 mt-1">{item?.product?.price} บาท</p>
                                                                    <div className="flex justify-center my-6 items-center text-gray-400">
                                                                        {
                                                                        quantity === 1 ? 
                                                                        <AiOutlineDelete size={27} className="mr-4 cursor-pointer" onClick={handleDelete}/>
                                                                        :
                                                                        <AiOutlineMinusCircle size={25} className="mr-4 cursor-pointer" onClick={handleMinus}/>}
                                                                        <p className="mr-4 text-black cursor-default">{quantity}</p>
                                                                        {
                                                                        quantity === item?.product?.quantityAvailable ?
                                                                        <AiOutlineMinusCircle size={25} className="mr-4 cursor-not-allowed text-gray-300"/>
                                                                        :
                                                                        <AiOutlinePlusCircle size={25} className="cursor-pointer" onClick={handlePlus}/>}
                                                                    </div>
                                                                    <div className="flex justify-center mt-8 mb-4 cursor-pointer bg-red-500 rounded-full text-white kanit py-3 mx-5 text-sm" onClick={handleAddProduct}>
                                                                        แก้ไข ({item?.product?.price * quantity} บาท)
                                                                    </div>
                                                                </>}
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="w-80">
                                                        <img
                                                            src={require(`C:/image/Files-Upload/products/${item?.product?.imgProduct}`)}
                                                            alt="img_product"
                                                            className="rounded-3xl shadow-lg w-80 h-56 opacity-40"
                                                        />
                                                        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white"> {/* Add w-full to take full width */}
                                                            <div className="text-sm kanit font-bold cursor-default bg-red-500 px-2 py-1 rounded">ORDER FOR LATER</div>
                                                        </div>
                                                        <div className='mt-10 mx-3'>
                                                            <p className="kanit text-xl font-semibold">{item?.product?.name}</p>
                                                            <div className="flex justify-between items-center mt-2">
                                                                <p className="kanit text-sm text-gray-700">{item?.product?.type?.typeName}</p>
                                                                <p className="kanit text-sm text-gray-700">จำนวน {item?.product?.quantityAvailable}</p>
                                                            </div>
                                                            <div className="flex kanit text-gray-500 text-sm">
                                                                <p className="mr-3">วันหมดอายุ</p>
                                                                <p>{format(new Date(item?.product?.expiryDate), 'dd-MM-yyyy HH:mm')}</p>
                                                            </div>
                                                            <p className="text-base kanit text-red-500 mt-1">{item?.product?.price} บาท</p>
                                                            <div className="flex justify-center my-6 items-center text-gray-400">
                                                                <AiOutlineMinusCircle size={25} className="mr-4 cursor-not-allowed text-gray-300"/>
                                                                <p className="mr-4 text-black cursor-default">{quantity}</p>
                                                                <AiOutlineMinusCircle size={25} className="mr-4 cursor-not-allowed text-gray-300"/>
                                                            </div>
                                                            <div className="flex justify-center mt-6 cursor-not-allowed bg-gray-400 rounded-full text-white kanit py-3 mx-5 text-sm">
                                                                แก้ไข ({item?.product?.price * quantity} บาท)
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
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

export default EditOrderItem