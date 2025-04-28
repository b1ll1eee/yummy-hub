import { useState } from 'react';
import { useAddFavouriteMutation, useFetchFavouriteByIdQuery, useFetchProductByStoreIdQuery, useFetchStoreByIdQuery, useRemoveFavouriteMutation } from '../../store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { StarIcon } from '@heroicons/react/20/solid'
import { Box, Skeleton } from '@mui/material';
import { AiFillHeart, AiOutlineHeart, AiOutlineSearch } from 'react-icons/ai';
import { format } from 'date-fns';
import Cookies from 'js-cookie';

function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

const InfoStore = () => {
    const { id } = useParams();
    const { data:store,isFetching:isStore,isError:errorStore } = useFetchStoreByIdQuery(id);
    const { data:products,isFetching:isProduct,isError:errorProduct } = useFetchProductByStoreIdQuery(id);
    const { data:favourite,isFetching:isFavourite,isError:errorFavourite } = useFetchFavouriteByIdQuery(id);
    const [ addFavorite ] = useAddFavouriteMutation();
    const [ unFavorite ] = useRemoveFavouriteMutation();
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const filteredProducts = products?.filter((product:any) => (
        activeTab === 0 ? products :
        product?.type.typeId === activeTab
    ));
    const filteredData = filteredProducts?.filter((item:any) =>
    (
    (typeof item?.name === 'string' && item?.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ))
    const navigate = useNavigate();
    const user = Cookies.get('userdata');
    
    const handleTabClick = (tabNumber: number) => {
        setActiveTab(tabNumber);
    };

    const timeCheck = () => {
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

    const discountCheck = () => {
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

    const handleFavourite = async () => {
        Swal.fire({
            timerProgressBar: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            background: 'transparent',
            didOpen: () => {
              Swal.showLoading();
            }
        })
        await addFavorite({
            store:{
                storeId:id
            }}).then( async (result:any) => {
                console.log(result)
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
                    navigate("/login");
                }
            });
        Swal.close();
    }

    const handleUnFavourite = async () => {
        Swal.fire({
            timerProgressBar: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            background: 'transparent',
            didOpen: () => {
              Swal.showLoading();
            }
        })

        await unFavorite(favourite?.favouriteId).then( async (result:any) => {
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
                navigate("/login");
            }
        });

        Swal.close();
    }

    const handleClickNotLogin = async () => {
        await Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'Please Login!',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: true,
        });
        navigate("/login");
    }

    const handleClickProduct = (id:number) => {
        navigate(`/infoproduct/${id}`);
    }

    const typeOption = [
        { label: 'สินค้าทั้งหมด', value: 0 },
        { label: 'อาหารแห้ง', value: 1 },
        { label: 'เครื่องดื่ม', value: 2 },
        { label: 'ขนมปัง', value: 3 },
        { label: 'อาหารกระป๋อง', value: 4 },
        { label: 'ผัก', value: 5 },
        { label: 'ผลไม้', value: 6 },
    ];

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

    if(errorStore || errorProduct) {
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
    else if(errorFavourite&&user){
        Cookies.remove('jwt',{ path: '/' });
        Cookies.remove('userdata', { path: '/' });
        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'JWT Token Expired!',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: true,
        });
        navigate("/login");
    }

    return (
        <>
            <div className='bg-gray-50'>
                <div className='container mx-auto kanit px-4 py-5'>
                    {
                    isStore || errorStore || isFavourite ?
                    <>
                        <Skeleton width="20%" height={30} />
                        <div className='mt-2'>
                            <Skeleton width="18%" height={70} />
                        </div>
                        <div className='mt-1'>
                            <Skeleton width="40%" height={25} />
                        </div>
                        <div className='mt-1'>
                            <Skeleton width="25%" height={25} />
                        </div>
                        <div className='mt-1'>
                            <Skeleton width="10%" height={35} />
                        </div>
                        <div className='mt-1'>
                            <Skeleton width="20%" height={25} />
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
                                <div className="text-sm">
                                    <p className="kanit text-lg text-gray-500">
                                        {store?.name}
                                    </p>
                                </div>
                            </ol>
                        </nav>
                        <div className="flex items-center">
                            <p className="text-5xl font-medium my-3 mr-7">{store?.name}</p>
                            {user ? 
                                favourite ?
                                    <AiFillHeart size={25} className="text-red-500 cursor-pointer" onClick={handleUnFavourite}/>:
                                <AiOutlineHeart size={25} className="text-red-500 cursor-pointer" onClick={handleFavourite}/>:
                            <AiOutlineHeart size={25} className="text-red-500 cursor-pointer" onClick={handleClickNotLogin}/>}
                        </div>
                        <p className="font-medium mb-3 text-gray-500">{store?.address}</p>
                        <div className="flex text-sm text-gray-500 font-medium mb-3">
                            <p className="mr-3">{store?.districts?.nameInThai}</p>
                            <p className="mr-3">{store?.subdistricts?.nameInThai}</p>
                            <p>{store?.provinces?.nameInThai}</p>
                        </div>

                        <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                                <StarIcon
                                key={rating}
                                className={classNames(
                                    store?.rating > rating ? 'text-red-500' : 'text-gray-200',
                                    'h-5 w-5 flex-shrink-0'
                                )}
                                aria-hidden="true"
                                />
                            ))}
                        </div>
                        <div className="flex mt-3 items-center kanit">
                            <p className="mr-4">
                                Opening Hours
                            </p>
                            <p className="mr-3 text-gray-500">
                                {store?.storeOpen?.split(":").slice(0, 2).join(":")} - {store?.storeClose?.split(":").slice(0, 2).join(":")}
                            </p>
                            {
                                timeCheck() ?
                                <div className='bg-green-400 rounded-md px-2 py-1 text-white text-xs'>Open</div>
                                :
                                <div className='bg-red-400 rounded-md px-2 py-1 text-white text-xs'>Close</div>
                            }
                        </div>
                    </>
                    }
                </div>
            </div>

            <div className='bg-gray-50 shadow-md'>
                <div className="container mx-auto">
                    <div className="flex justify-center space-x-4 pt-5">
                        {
                            typeOption.map((type:any, index:number) => (
                                <button
                                key={index}
                                className={`px-4 kanit text-lg pb-3 ${activeTab === type.value ? 'text-red-500 border-b-4 border-red-500' : 'text-gray-500'}`}
                                onClick={() => handleTabClick(type.value)}
                                >
                                {type.label}
                                </button>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className=''>
                <div className="container mx-auto mb-10">
                    <div className="px-4 py-3">
                        <div className='container mx-auto'>
                        <div className="flex justify-between items-center">
                            <p className="text-2xl font-medium mb-10 my-6 kanit">{typeOption[activeTab].label}</p>
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
                                isProduct || errorProduct || isFavourite ?
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
                                (filteredData?.length === 0 ?
                                    <div className="flex flex-col justify-center py-20 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="4 4 40 40" className="w-20">
                                            <path className="fill-slate-200" d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" fill="#000000"/>
                                        </svg>
                                        <p className="mt-6 text-3xl text-slate-400 kanit">ไม่มีสินค้า</p>
                                        
                                    </div>
                                :
                                    <div className="grid gap-x-8 gap-y-10 grid-cols-4">
                                        {filteredData.map((product:any, index:number) => (
                                            (
                                            timeCheck() ?
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
                                                            discountCheck() ?
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
        </>
    );
};


export default InfoStore;
