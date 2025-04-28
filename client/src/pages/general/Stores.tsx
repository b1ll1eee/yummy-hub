import Cookies from "js-cookie";
import { useFetchStoreByLocationQuery, useFetchStoreQuery } from "../../store";
import { Box, Skeleton } from "@mui/material";
import Swal from "sweetalert2";
import { useState } from 'react';
import { Link } from "react-router-dom";
import { StarIcon } from '@heroicons/react/20/solid'
import imagepath from "../../img/Example1.webp";
import { AiOutlineSearch } from 'react-icons/ai';

function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

function Stores() {
    const location = Cookies.get('location') !== undefined ? Cookies.get('location') : null;
    const [showMore, setShowMore] = useState(false);
    const initialOrdersToShow = 8;
    const [searchQuery, setSearchQuery] = useState('');
    let locationData:any;
    if(location){
        locationData = JSON.parse(location)
    }

    const { data:store, isFetching:isStore, isError:errorStore } = useFetchStoreQuery("");
    const { data:storeLocation, isFetching:isStoreLocation, error:errorStoreLocation } = useFetchStoreByLocationQuery({districtId:locationData?.selectedDistrict,subdistrictId:locationData?.selectedSubDistrict,provinceId:locationData?.selectedProvince});
    const filteredStore = store?.filter((item:any) => (
        (typeof item?.name === 'string' && item?.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ))

    const filteredStoreLocation = store?.filter((item:any) => (
        (typeof item?.name === 'string' && item?.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ))

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

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

    if(errorStore || errorStoreLocation) {
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
        <div className="bg-gray-50 py-2">
            <div className="container mx-auto my-10">
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
                                Store
                            </p>
                        </div>
                    </ol>
                </nav>
                <div className="container mx-auto my-10">
                    <div className="font-semibold my-10 kanit flex justify-between items-center">
                        <div className="flex items-center">
                            <p className="text-3xl">ร้านค้าทั้งหมดใน</p>
                            <span className="text-red-500 text-4xl ml-5">
                                {
                                locationData ?
                                <>
                                {locationData?.selectedProvince} {locationData?.selectedDistrict.slice(4)} {locationData?.selectedSubDistrict}
                                </>
                                :
                                <>
                                Yummy Hub
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
                    <div className="grid gap-x-8 gap-y-10 grid-cols-4">
                        {
                        isStore || isStoreLocation ?
                        <div>
                            <div className='flex'>
                                <Media/>
                                <Media/>
                                <Media/>
                                <Media/>
                            </div>
                            <div className='flex'>
                                <Media/>
                                <Media/>
                                <Media/>
                                <Media/>
                            </div>
                        </div>
                        :
                        (
                        (locationData) ?
                        ((showMore ? filteredStoreLocation : filteredStoreLocation?.slice(0, initialOrdersToShow))?.map((store:any, index:number) => (
                            <Link to={`/infostore/${store.storeId}`} className="hover:scale-105 bg-white rounded-lg" key={index}>
                                <img src={imagepath} alt="img_store" className="rounded shadow-lg" />
                                <div className="flex justify-between">
                                    <h2 className="text-lg font-thin my-2 kanit">{store.name}</h2>
                                    <div className="flex items-center">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <StarIcon
                                            key={rating}
                                            className={classNames(
                                                store.rating > rating ? 'text-red-500' : 'text-gray-200',
                                                'h-5 w-5 flex-shrink-0'
                                            )}
                                            aria-hidden="true"
                                            />
                                        ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm font-thin my-2 kanit">{store?.provinces?.nameInThai}</p>
                                        <p className="text-sm font-thin my-2 kanit">{store?.storeOpen?.split(":").slice(0, 2).join(":")} - {store?.storeClose?.split(":").slice(0, 2).join(":")}</p>
                                    </div>
                                </Link>
                        )))
                        :
                        ((showMore ? filteredStore : filteredStore?.slice(0, initialOrdersToShow))?.map((store:any, index:number) => (
                            <Link to={`/infostore/${store.storeId}`} className="hover:scale-105 bg-white rounded-lg" key={index}>
                                <img src={imagepath} alt="img_store" className="rounded shadow-lg" />
                                <div className="flex justify-between">
                                    <h2 className="text-lg font-thin my-2 kanit">{store.name}</h2>
                                    <div className="flex items-center">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <StarIcon
                                            key={rating}
                                            className={classNames(
                                                store.rating > rating ? 'text-red-500' : 'text-gray-200',
                                                'h-5 w-5 flex-shrink-0'
                                            )}
                                            aria-hidden="true"
                                            />
                                        ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm font-thin my-2 kanit">{store?.provinces?.nameInThai}</p>
                                        <p className="text-sm font-thin my-2 kanit">{store?.storeOpen?.split(":").slice(0, 2).join(":")} - {store?.storeClose?.split(":").slice(0, 2).join(":")}</p>
                                    </div>
                                </Link>
                        ))))}
                    </div>
                    {
                    locationData ?
                    ((storeLocation?.length > initialOrdersToShow) && (filteredStoreLocation?.length > initialOrdersToShow)) && (
                    <div className="text-center p-4 mx-auto">
                    <button
                        onClick={toggleShowMore}
                        className="my-4 border border-gray-400 rounded-lg px-5 py-4 hover:text-red-500 hover:border-red-500"
                    >
                        {showMore ? 'Show Less' : 'See More'}
                    </button>
                    </div>
                    )
                    :
                    ((store?.length > initialOrdersToShow) && (filteredStore?.length > initialOrdersToShow)) && (
                    <div className="text-center p-4 mx-auto">
                    <button
                    onClick={toggleShowMore}
                    className="my-4 border border-gray-400 rounded-lg px-5 py-4 hover:text-red-500 hover:border-red-500"
                    >
                    {showMore ? 'Show Less' : 'See More'}
                    </button>
                </div>
                    )}
                </div>
                <hr></hr>
            </div>
        </div>
    );
}

export default Stores;