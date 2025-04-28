import React, { useState } from 'react';
import { useFetchCartOrderQuery, useFetchCartQuery } from '../../store';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { Skeleton } from '@mui/material';
import EditOrderItem from '../../components/EditOrderItem';

const Cart = () => {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState({});
    const [onOpen,setOnOpen] = useState(false);
    const { data:orderItem, isFetching:isOrderItem, error:errorOrderItem } = useFetchCartQuery("");
    const { data:orders, isFetching:isOrder, error:errorOrder } = useFetchCartOrderQuery("");
    const user = Cookies.get('userdata') !== undefined ? Cookies.get('userdata') : null;
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
    const totalAmountSum = orders?.filter((order:any) => selectedOrderIds?.includes(order.orderId)).reduce((sum:number, order:any) => sum + order.totalAmount, 0);
    let userData;
    if(user){
        userData = JSON.parse(user)
    }

    const handlePayment = () => {
        const jsonString = JSON.stringify(selectedOrderIds);
        Cookies.set('orders', jsonString);
        navigate('/payment')
    }

    const handleEdit = (item:any) => {
        setOnOpen(true);
        setSelectedItem(item);
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedOrderIdValue = e.target.value;
        if (selectedOrderIds.includes(selectedOrderIdValue)) {
          setSelectedOrderIds(selectedOrderIds.filter((id) => id !== selectedOrderIdValue));
        } else {
          setSelectedOrderIds([...selectedOrderIds, selectedOrderIdValue]);
        }
    };

    const timeCheck = (store:any) => {
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
        const startTime = store?.storeOpen?.split(":").slice(0, 2).join(":");
        const endTime = store?.storeClose?.split(":").slice(0, 2).join(":");
        if(currentTime >= startTime && currentTime <= endTime){
            return true
        }
        else{
            return false
        }
    };

    const discountCheck = (item:any) => {
        const targetTime = new Date(); // Replace this with your dynamic target time
        targetTime.setHours(item?.store?.storeClose?.split(":")[0], item?.store?.storeClose?.split(":")[1], item?.store?.storeClose?.split(":")[2]);
        const oneHourBeforeTarget = new Date(targetTime);
        oneHourBeforeTarget.setHours(oneHourBeforeTarget.getHours() - 1);
        const current = new Date();
        if (current > oneHourBeforeTarget && current < targetTime) {
            return true;
        }
        else{
            return false;
        }
    };

    const handleClose = () => {
        setOnOpen(false);
    }

    if(errorOrder || errorOrderItem){
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
        <>
        {onOpen && selectedItem && (
            <EditOrderItem open={onOpen} onHide={handleClose} item={selectedItem} />
        )}
        <div className="bg-red-500">
            <p className="text-4xl leading-tight font-semibold text-white px-24 py-10 kanit">
                ตะกร้าสินค้า
            </p>
        </div>
        <div className="bg-gray-50">
            <div className="container mx-auto pt-12">
                <div className="grid grid-rows-3 ml-24">
                    {
                    isOrder || isOrderItem ?
                    <div className='row-end-2 row-span-1 flex flex-col p-5 bg-white rounded-xl shadow-md'>
                        <Skeleton width="30%" height={20} />
                        <div className="mt-4 flex justify-between">
                            <Skeleton width="50%" height={30} />
                            <Skeleton width="5%" height={20} />
                        </div>
                        <Skeleton width="20%" height={15} />
                        <div className="mt-5 flex justify-between">
                            <Skeleton width="20%" height={30} />
                            <Skeleton width="15%" height={30} />
                        </div>
                    </div>
                    :
                    (orders?.length === 0 ? (
                        <div className='row-end-2 row-span-1 flex flex-col p-10 bg-white rounded-xl shadow-md'>
                            <p className="text-3xl font-semibold kanit">รายการสินค้า</p>
                            <p className="text-xl mt-2 text-slate-400 kanit">ไม่พบรายการสินค้า</p>
                        </div>
                    ) : (
                        <div className='row-end-2 row-span-1 bg-white rounded-xl shadow-md'>
                            {orders?.map((order:any) => (
                                <>
                                <div key={order?.orderId} className="p-2 border border-gray-200 flex justify-between items-center">
                                    <span className="kanit text-xl mx-2 flex items-center">
                                        {order?.store?.name}
                                        <div className="ml-4">
                                        {
                                            timeCheck(order?.store) ?
                                            <div className='bg-green-400 rounded-md px-2 py-1 text-xs'>Open</div>
                                            :
                                            <div className='bg-red-400 rounded-md px-2 py-1 text-xs'>Close</div>
                                        }
                                        </div>
                                    </span>
                                    {
                                    timeCheck(order?.store) ?
                                    <input
                                    type="checkbox"
                                    value={order?.orderId}
                                    onChange={handleCheckboxChange}
                                    checked={selectedOrderIds.includes(order?.orderId)}
                                    />:
                                    <input
                                    disabled
                                    className="cursor-not-allowed"
                                    type="checkbox"
                                    value={order?.orderId}
                                    onChange={handleCheckboxChange}
                                    checked={selectedOrderIds.includes(order?.orderId)}
                                    />
                                    }
                                </div>
                                {orderItem?.filter((item:any) => item?.orders?.orderId === order?.orderId).map((filteredItem: any) =>(
                                   <div key={filteredItem?.orderId} className="mx-6 my-4 items-start flex justify-between">
                                        <div className="flex items-center">
                                            <img
                                                src={require(`C:/image/Files-Upload/products/${filteredItem?.product?.imgProduct}`)}
                                                alt="img_product"
                                                className="rounded-3xl shadow-lg w-10 h-10"
                                            />
                                            <div className="kanit ml-2">
                                                <p className="text-lg">{filteredItem?.product?.name}</p> 
                                                <div className="text-sm flex text-gray-500">{filteredItem?.quantity} X 
                                                {
                                                discountCheck(order) && (filteredItem?.product?.discountPrice === filteredItem?.price) ?
                                                <div className="flex items-center ml-1">
                                                    <p className="line-through mr-1">{filteredItem?.product?.price}</p>
                                                    <p className="">{filteredItem?.product?.discountPrice}</p>
                                                </div>
                                                :
                                                <p className="ml-1">{filteredItem?.product?.price}</p>
                                                }
                                                </div>
                                            </div>
                                        </div>
                                        <button className="kanit text-sm" onClick={() => handleEdit(filteredItem)}>แก้ไข</button>
                                    </div> 
                                ))
                                }
                                <div className="flex justify-between kanit text-red-500 mx-7 mt-10 text-lg mb-4">
                                    <div>
                                        ทั้งหมด
                                    </div>
                                    <div>
                                        {order?.totalAmount}
                                    </div>
                                </div>
                                </>
                            ))}
                        </div>
                    
                    ))}
                    <div className='row-end-3 row-span-2'>
                        <div className='flex justify-center'>
                            <div>
                                <div className="kanit block py-8 pr-44 pl-8 bg-white border border-gray-200 rounded-xl shadow-md">
                                    <p className="mb-4 text-2xl font-semibold ">ข้อมูลผู้รับสินค้า</p>
                                    {
                                        isOrder || isOrderItem ?
                                        <>
                                            <Skeleton width="60%" height={30} />
                                            <Skeleton width="100%" height={30} />
                                        </>
                                        :
                                        <>
                                            <p className="mb-1 font-normal text-gray-600">คุณ {userData?.firstname} {userData?.lasname}</p>
                                            <p className="font-normal text-gray-600">อีเมล {userData?.email}</p>
                                        </>
                                    }
                                </div>
                                <div className="kanit mt-4 block max-w-sm p-6 bg-white border border-gray-200 rounded-xl shadow-md">
                                    <div className="flex justify-between items-center mb-7">
                                        <p className="text-xl font-semibold">ราคารวม</p>
                                        {
                                            isOrder || isOrderItem ?
                                            <Skeleton width="15%" height={30} />
                                            :
                                        <p className="text-xl font-semibold text-red-500">{totalAmountSum} บาท</p>}
                                    </div>
                                    {
                                        isOrder || isOrderItem ?
                                        <div className="flex justify-center">
                                            <Skeleton width="70%" height={60} />
                                        </div>
                                    :
                                    (
                                        selectedOrderIds.length === 0 ?
                                        <div className="text-white bg-gray-300 flex justify-center rounded-full text-sm py-3 mx-6 cursor-not-allowed">ชำระเงิน</div>
                                        :
                                    <div className="text-white bg-red-500 flex justify-center rounded-full text-sm py-3 mx-6 cursor-pointer" onClick={handlePayment}>ชำระเงิน</div>)}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


            </div>
        </div>
        </>
    );
};

export default Cart;
