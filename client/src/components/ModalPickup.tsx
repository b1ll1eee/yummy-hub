import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button, } from "@material-tailwind/react";
import { Payment } from '../Model/Payment';
import thaiDateFormat from "../utils/thaiDateFormat";
import { useNavigate } from 'react-router-dom';

interface OpenModal {
    open: boolean;
    onHide: Function; 
    orderData: any;
}

function ModalPickup({ open, onHide, orderData }: OpenModal) {
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog 
                as="div" 
                className="relative z-10" 
                onClose={()=>{}}
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
                    <Dialog.Panel className="p-5 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all max-w-xl">
                        <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                        >
                            รายละเอียด
                        </Dialog.Title>
                        <div className="mt-2 flex flex-col">
                            <p className="text-sm text-gray-700">
                                <b>Order Date:</b> {thaiDateFormat(orderData?.data.orderDate)}
                            </p>
                            <p className="text-sm text-gray-700">
                                <b>Payment Date:</b> {thaiDateFormat(orderData?.data.paymentDate)}
                            </p>
                            <p className="text-sm text-gray-700">
                                <b>Total Amount:</b> {orderData?.data.totalAmount}
                            </p>
                            {orderData?.data.filepath &&
                                <img
                                    className="h-7/12 w-7/12 object-cover object-center mt-2 self-center"
                                    src={require(`C:/image/Files-Upload/payments/${orderData?.data.filepath}`)}
                                    alt={'img-'+orderData?.data.orderId}
                                />
                            }
                        </div>
                        <div className="mt-4 h-1/4 flex flex-row justify-center">
                        <Button
                            color='blue'
                            variant='outlined'
                            className='mr-2'
                            onClick={()=>onHide()}
                        >
                            Cancel
                        </Button>
                        </div>
                    </Dialog.Panel>
                    </Transition.Child>
                </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default ModalPickup;