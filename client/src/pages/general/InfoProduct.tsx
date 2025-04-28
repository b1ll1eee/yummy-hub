import { useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAddItemMutation, useFetchProductByIdQuery } from "../../store";
import { Skeleton } from "@mui/material";
import { format } from 'date-fns';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import Swal from 'sweetalert2';

function Product() {
    const { id } = useParams();
    const { data:product,isFetching:isProduct,isError:errorProduct } = useFetchProductByIdQuery(id);
    const [ addOrder ] = useAddItemMutation();
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    const timeCheck = () => {
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
        const startTime = product?.store?.storeOpen?.split(":").slice(0, 2).join(":");
        const endTime = product?.store?.storeClose?.split(":").slice(0, 2).join(":");
        if(currentTime >= startTime && currentTime <= endTime){
            return true
        }
        else{
            return false
        }
    }

    const discountCheck = () => {
        const targetTime = new Date(); // Replace this with your dynamic target time
        targetTime.setHours(product?.store?.storeClose?.split(":")[0], product?.store?.storeClose?.split(":")[1], product?.store?.storeClose?.split(":")[2]);
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

        await addOrder({
            id,
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
                navigate(`/infostore/${product?.store?.storeId}`);
            }
        });

        Swal.close();

    }

    const handleMinus = () => {
        if(quantity>1){
            setQuantity(quantity-1);
        }
    }

    const handlePlus = () => {
        if(quantity<product?.quantityAvailable){
            setQuantity(quantity+1);
        }
    }

    return ( 
        <>
            <div className='bg-gray-50'>
                <div className='container mx-auto kanit px-4 py-5'>
                    {
                    isProduct || errorProduct ?
                    <>
                        <Skeleton width="20%" height={30} />
                        <div className= "container mx-auto">
                            <div className="rounded-2xl shadow-xl bg-white flex justify-center my-10 mx-64 py-10">
                            <div className="w-96">
                                <Skeleton variant="rectangular" width="100%" height={185} />
                                <div className="mt-5">
                                    <Skeleton width="70%" height={50}/>
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton width="20%" height={20} />
                                    <Skeleton width="15%" height={20} />
                                </div>
                                <div className="mt-5">
                                    <Skeleton width="100%" height={30}/>
                                    <Skeleton width="100%" height={30}/>
                                    <Skeleton width="80%" height={30}/>
                                </div>
                                <div className="mt-5">
                                    <Skeleton width="40%" height={30} />
                                </div>
                                <div className="mt-2">
                                    <Skeleton width="10%" height={30} />
                                </div>
                                <div className="mt-5 flex justify-center">
                                    <Skeleton width="30%" height={40} />
                                </div>
                                <div className="mt-3 flex justify-center">
                                    <Skeleton width="60%" height={60} />
                                </div>
                            </div>
                                
                            </div>
                        </div>
                    </>
                    :
                    <>
                    <nav>
                        <ol className="flex">
                            <div className="flex items-center">
                                <Link to="/" className="mr-2 kanit text-lg font-medium text-red-500">
                                    Home
                                </Link>
                                <div className='mr-2 kanit text-lg font-medium'>/</div>
                            </div>
                            <div className="flex items-center">
                                <Link to="/stores" className="mr-2 kanit text-lg font-medium text-red-500">
                                    Store
                                </Link>
                                <div className='mr-2 kanit text-lg font-medium'>/</div>
                            </div>
                            <div className="flex items-center">
                                <Link to={`/infostore/${product?.store?.storeId}`} className="mr-2 kanit text-lg font-medium text-red-500">
                                {product?.store?.name}
                                </Link>
                                <div className='mr-2 kanit text-lg font-medium'>/</div>
                            </div>
                            <div className="text-sm">
                                <p className="kanit text-lg text-gray-500">
                                    {product?.name}
                                </p>
                            </div>
                        </ol>
                    </nav>
                    
                    <div className= "container mx-auto">
                        <div className="rounded-2xl shadow-xl bg-white flex justify-center my-10 mx-64 py-10">
                        {
                        timeCheck() ?
                            <div className="w-96">
                                <img
                                    src={require(`C:/image/Files-Upload/products/${product?.imgProduct}`)}
                                    alt="img_product"
                                    className="rounded-3xl shadow-lg w-96 h-64"
                                />
                                <div className='mt-10 mx-3'>
                                    <p className="kanit text-3xl font-semibold">{product?.name}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="kanit text-sm text-gray-700">{product?.type?.typeName}</p>
                                        <p className="kanit text-sm text-gray-700">จำนวน {product?.quantityAvailable}</p>
                                    </div>
                                    <p className="kanit text-sm font-extralight my-5">{product?.description}</p>
                                    <div className="flex kanit text-gray-500 text-sm">
                                        <p className="mr-3">วันหมดอายุ</p>
                                        <p>{format(new Date(product?.expiryDate), 'dd-MM-yyyy HH:mm')}</p>
                                    </div>
                                    {
                                        discountCheck() ?
                                        <>
                                            <div className="flex items-center mt-1">
                                                <p className="text-sm kanit text-red-500 line-through mr-1">{product?.price}</p>
                                                <p className="text-lg kanit text-red-500">{product?.discountPrice} บาท</p>
                                            </div>
                                            <div className="flex justify-center my-6 items-center text-gray-400">
                                                {
                                                quantity === 1 ? 
                                                <AiOutlineMinusCircle size={25} className="mr-4 cursor-not-allowed text-gray-300"/>
                                                :
                                                <AiOutlineMinusCircle size={25} className="mr-4 cursor-pointer" onClick={handleMinus}/>}
                                                <p className="mr-4 text-black cursor-default">{quantity}</p>
                                                {
                                                quantity === product?.quantityAvailable ?
                                                <AiOutlineMinusCircle size={25} className="mr-4 cursor-not-allowed text-gray-300"/>
                                                :
                                                <AiOutlinePlusCircle size={25} className="cursor-pointer" onClick={handlePlus}/>}
                                            </div>
                                            <div className="flex justify-center mt-8 mb-4 cursor-pointer bg-red-500 rounded-full text-white kanit py-3 mx-5 text-sm" onClick={handleAddProduct}>
                                                ใส่ตะกร้า ({product?.discountPrice * quantity} บาท)
                                            </div>
                                        </>
                                        :
                                        <>
                                            <p className="text-base kanit text-red-500 mt-1">{product?.price} บาท</p>
                                            <div className="flex justify-center my-6 items-center text-gray-400">
                                                {
                                                quantity === 1 ? 
                                                <AiOutlineMinusCircle size={25} className="mr-4 cursor-not-allowed text-gray-300"/>
                                                :
                                                <AiOutlineMinusCircle size={25} className="mr-4 cursor-pointer" onClick={handleMinus}/>}
                                                <p className="mr-4 text-black cursor-default">{quantity}</p>
                                                {
                                                quantity === product?.quantityAvailable ?
                                                <AiOutlineMinusCircle size={25} className="mr-4 cursor-not-allowed text-gray-300"/>
                                                :
                                                <AiOutlinePlusCircle size={25} className="cursor-pointer" onClick={handlePlus}/>}
                                            </div>
                                            <div className="flex justify-center mt-8 mb-4 cursor-pointer bg-red-500 rounded-full text-white kanit py-3 mx-5 text-sm" onClick={handleAddProduct}>
                                                ใส่ตะกร้า ({product?.price * quantity} บาท)
                                            </div>
                                        </>}
                                </div>
                            </div>
                            :
                            <div className="w-96">
                                <img
                                    src={require(`C:/image/Files-Upload/products/${product?.imgProduct}`)}
                                    alt="img_product"
                                    className="rounded-3xl shadow-lg w-96 h-64 opacity-40"
                                />
                                <div className="absolute top-80 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white"> {/* Add w-full to take full width */}
                                    <div className="text-sm kanit font-bold cursor-default bg-red-500 px-2 py-1 rounded">ORDER FOR LATER</div>
                                </div>
                                <div className='mt-10 mx-3'>
                                    <p className="kanit text-3xl font-semibold">{product?.name}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="kanit text-sm text-gray-700">{product?.type?.typeName}</p>
                                        <p className="kanit text-sm text-gray-700">จำนวน {product?.quantityAvailable}</p>
                                    </div>
                                    <p className="kanit text-sm font-extralight my-5">{product?.description}</p>
                                    <div className="flex kanit text-gray-500 text-sm">
                                        <p className="mr-3">วันหมดอายุ</p>
                                        <p>{format(new Date(product?.expiryDate), 'dd-MM-yyyy HH:mm')}</p>
                                    </div>
                                    <p className="text-base kanit text-red-500 mt-1">{product?.price} บาท</p>
                                    <div className="flex justify-center my-6 items-center text-gray-400">
                                        <AiOutlineMinusCircle size={25} className="mr-4 cursor-not-allowed text-gray-300"/>
                                        <p className="mr-4 text-black cursor-default">{quantity}</p>
                                        <AiOutlineMinusCircle size={25} className="mr-4 cursor-not-allowed text-gray-300"/>
                                    </div>
                                    <div className="flex justify-center mt-6 cursor-not-allowed bg-gray-400 rounded-full text-white kanit py-3 mx-5 text-sm">
                                        ใส่ตะกร้า ({product?.price * quantity} บาท)
                                    </div>
                                </div>
                            </div>
                        }
                        </div>
                    </div>
                    </>}
                </div>
            </div>
        </>
     );
}

export default Product;