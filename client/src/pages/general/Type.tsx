import { AiOutlineSearch } from 'react-icons/ai';
import Cookies from "js-cookie";
import { Box, Skeleton } from "@mui/material";
import { useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { StarIcon } from '@heroicons/react/20/solid'
import { useFetchProductByTypeAndLocationQuery, useFetchProductByTypeQuery } from '../../store';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
function Type() {
    const navigate = useNavigate();
    const { id, name } = useParams();
    const location = Cookies.get('location') !== undefined ? Cookies.get('location') : null;
    const [showMore, setShowMore] = useState(false);
    const initialOrdersToShow = 8;
    const [searchQuery, setSearchQuery] = useState('');
    let locationData:any;
    if(location){
        locationData = JSON.parse(location)
    }
    const { data:products, isFetching:isProduct, isError:errorProduct } = useFetchProductByTypeQuery(id);
    const { data:productsLocation, isFetching:isProductLocation, error:errorProductLocation } = useFetchProductByTypeAndLocationQuery({id,districtId:locationData?.selectedDistrict,subdistrictId:locationData?.selectedSubDistrict,provinceId:locationData?.selectedProvince});
    const filteredProduct = products?.filter((item:any) => (
        (typeof item?.name === 'string' && item?.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ))

    const filteredProductLocation = productsLocation?.filter((item:any) => (
        (typeof item?.name === 'string' && item?.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ))

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
    }

    const discountCheck = (store:any) => {
        const targetTime = new Date(); // Replace this with your dynamic target time
        targetTime.setHours(store?.storeClose?.split(":")[0], store?.storeClose?.split(":")[1], store?.storeClose?.split(":")[2]);
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

    const handleClickProduct = (id:number) => {
        navigate(`/infoproduct/${id}`);
    }

    const Media = () => {
        return (
          <div className='mr-10'>
            <Box sx={{ width: 295, height:260 }}>
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg xl:aspect-h-8 xl:aspect-w-7">
                <Skeleton variant="rectangular" width={295} height={185} />
              </div>
                <Box sx={{ pt: 0.5 }}>
                  <Skeleton />
                  <Skeleton width="60%" />
                </Box>
            </Box>
          </div>
        );
    }

    if(errorProduct || errorProductLocation) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'The server crashed.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: true,
        });
    }

    return ( 
        <div className="bg-gray-50">
            <div className='container mx-auto kanit px-4 py-5'>
                {
                isProduct || isProductLocation || errorProduct || errorProductLocation ?
                <>
                    <Skeleton width="20%" height={30} />
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
                            <div className="text-sm">
                                <p className="kanit text-lg text-gray-500">
                                    Product
                                </p>
                            </div>
                        </ol>
                    </nav>
                </>
                }
            </div>

            <div className=''>
                <div className="container mx-auto mb-10">
                    <div className="px-4 py-3">
                        <div className='container mx-auto'>
                        <div className="font-semibold my-10 kanit flex justify-between items-center">
                            <div className="flex items-center">
                                <p className="text-3xl">{name}</p>
                                <span className="text-red-500 text-4xl ml-5">
                                    {
                                    locationData ?
                                    <div className='kanit'>
                                    {locationData?.selectedProvince} {locationData?.selectedDistrict.slice(4)} {locationData?.selectedSubDistrict}
                                    </div>
                                    :
                                    <>
                                    </>
                                    }
                                </span>
                            </div>
                            <div className="mr-4 flex items-center kanit rounded-2xl bg-gray-50 px-3 py-2 text-gray-400 shadow-md">
                                <AiOutlineSearch size={20} className="mr-3"/>
                                <input
                                    type="text"
                                    id="form-subscribe-Filter"
                                    className="focus:outline-none bg-gray-50 w-48"
                                    placeholder="ค้นหาสินค้า"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />

                            </div>
                        </div>
                            {
                                isProduct || isProductLocation || errorProduct || errorProductLocation ?
                                <div className="grid gap-x-8 gap-y-10 grid-cols-4">
                                    <Media/>
                                    <Media/>
                                    <Media/>
                                    <Media/>
                                    <Media/>
                                    <Media/>
                                    <Media/>
                                    <Media/>
                                </div>
                            :
                                (filteredProduct?.length === 0 ?
                                    <div className="flex flex-col justify-center py-20 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="4 4 40 40" className="w-20">
                                            <path className="fill-slate-200" d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" fill="#000000"/>
                                        </svg>
                                        <p className="mt-6 text-3xl text-slate-400 kanit">ไม่มีสินค้า</p>
                                        
                                    </div>
                                :
                                    <div className="grid gap-x-8 gap-y-10 grid-cols-4">
                                        {
                                        locationData ?
                                        filteredProductLocation?.map((product:any, index:number) => (
                                            (
                                            timeCheck(product?.store) ?
                                                <div
                                                    onClick={() => handleClickProduct(product?.productId)}
                                                    key={index}
                                                    className='bg-white hover:scale-105 rounded-lg cursor-pointer'
                                                >
                                                    <img
                                                        src={require(`C:/image/Files-Upload/products/${product?.imgProduct}`)}
                                                        alt="img_product"
                                                        className="rounded-xl shadow-lg w-80 h-48 object-contain"
                                                    />
                                                    <div className='m-3'>
                                                        <p className="kanit">{product?.name} EXP ({format(new Date(product?.expiryDate), 'dd-MM-yyyy')})</p>
                                                        {
                                                            discountCheck(product?.store) ?
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center">
                                                                    <p className="text-sm kanit text-red-500 line-through mr-1">{product?.price}</p>
                                                                    <p className="text-base kanit text-red-500">{product?.discountPrice} บาท</p>
                                                                </div>
                                                                <p className="text-sm kanit text-gray-500">จำนวน {product?.quantityAvailable}</p>
                                                            </div>
                                                            :
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-base kanit text-red-500">{product?.price} บาท</p>
                                                                <p className="text-sm kanit text-gray-500">จำนวน {product?.quantityAvailable}</p>
                                                            </div>}
                                                    </div>
                                                </div>
                                                :
                                                <div
                                                    key={index}
                                                    className='bg-white hover:scale-105 rounded-lg relative'
                                                >
                                                    <img
                                                        src={require(`C:/image/Files-Upload/products/${product?.imgProduct}`)}
                                                        alt="img_product"
                                                        className="rounded-xl shadow-lg w-80 h-48 opacity-40"
                                                    />
                                                    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white"> {/* Add w-full to take full width */}
                                                        <div className="text-sm kanit font-bold cursor-default bg-red-500 px-2 py-1 rounded">ORDER FOR LATER</div>
                                                    </div>
                                                    <div className='m-3'>
                                                        <p className="kanit">{product?.name} EXP ({format(new Date(product?.expiryDate), 'dd-MM-yyyy')})</p>
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-base kanit text-red-500">{product?.price} บาท</p>
                                                            <p className="text-sm kanit text-gray-500">จำนวน {product?.quantityAvailable}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                        )))
                                        :
                                        filteredProduct?.map((product:any, index:number) => (
                                            (
                                            timeCheck(product?.store) ?
                                                <div
                                                    onClick={() => handleClickProduct(product?.productId)}
                                                    key={index}
                                                    className='bg-white hover:scale-105 rounded-lg cursor-pointer'
                                                >
                                                    <img
                                                        src={require(`C:/image/Files-Upload/products/${product?.imgProduct}`)}
                                                        alt="img_product"
                                                        className="rounded-xl shadow-lg w-80 h-48 object-contain"
                                                    />
                                                    <div className='m-3'>
                                                        <p className="kanit">{product?.name} EXP ({format(new Date(product?.expiryDate), 'dd-MM-yyyy')})</p>
                                                        {
                                                            discountCheck(product?.store) ?
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center">
                                                                    <p className="text-sm kanit text-red-500 line-through mr-1">{product?.price}</p>
                                                                    <p className="text-base kanit text-red-500">{product?.discountPrice} บาท</p>
                                                                </div>
                                                                <p className="text-sm kanit text-gray-500">จำนวน {product?.quantityAvailable}</p>
                                                            </div>
                                                            :
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-base kanit text-red-500">{product?.price} บาท</p>
                                                                <p className="text-sm kanit text-gray-500">จำนวน {product?.quantityAvailable}</p>
                                                            </div>}
                                                    </div>
                                                </div>
                                                :
                                                <div
                                                    key={index}
                                                    className='bg-white hover:scale-105 rounded-lg relative'
                                                >
                                                    <img
                                                        src={require(`C:/image/Files-Upload/products/${product?.imgProduct}`)}
                                                        alt="img_product"
                                                        className="rounded-xl shadow-lg w-80 h-48 opacity-40"
                                                    />
                                                    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white"> {/* Add w-full to take full width */}
                                                        <div className="text-sm kanit font-bold cursor-default bg-red-500 px-2 py-1 rounded">ORDER FOR LATER</div>
                                                    </div>
                                                    <div className='m-3'>
                                                        <p className="kanit">{product?.name} EXP ({format(new Date(product?.expiryDate), 'dd-MM-yyyy')})</p>
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-base kanit text-red-500">{product?.price} บาท</p>
                                                            <p className="text-sm kanit text-gray-500">จำนวน {product?.quantityAvailable}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                        )))}
                                    </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default Type;
<>
</>