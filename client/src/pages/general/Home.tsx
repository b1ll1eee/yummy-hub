import landingpage from "../../img/landingpage.jpg";
import imagepath from "../../img/Example1.webp";
import { useState } from 'react';
import { useFetchStoreByLocationQuery, useFetchStoreQuery, useFetchTypeQuery } from "../../store";
import { Box, Skeleton } from "@mui/material";
import Swal from "sweetalert2";
import { StarIcon } from '@heroicons/react/20/solid'
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

function Home() {
    const location = Cookies.get('location') !== undefined ? Cookies.get('location') : null;
    let locationData:any;
    if(location){
        locationData = JSON.parse(location)
    }
    const [showMore, setShowMore] = useState(false);
    const initialOrdersToShow = 8;

    const { data:store, isFetching:isStore, isError:errorStore } = useFetchStoreQuery("");
    const { data:storeLocation, isFetching:isStoreLocation, error:errorStoreLocation } = useFetchStoreByLocationQuery({districtId:locationData?.selectedDistrict,subdistrictId:locationData?.selectedSubDistrict,provinceId:locationData?.selectedProvince});
    const { data:type,isFetching:isType,isError:errorType } = useFetchTypeQuery("");

    const sortedStores = store?.slice().sort((a:any, b:any) => b.rating - a.rating);
    const sortedStoresLocation = storeLocation?.slice().sort((a:any, b:any) => b.rating - a.rating);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    if(errorType || errorStore || errorStoreLocation) {
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

    return (
        <>
            <img
                src={landingpage}
                alt="landingPage"
                className="w-full rounded shadow-lg"
            />
            <div className="container mx-auto my-10">
                <div className="container mx-auto my-10">
                    <div className="font-semibold my-10 kanit flex justify-between items-center">
                        <div className="flex items-center">
                            <p className="text-3xl">ร้านค้ายอดนิยมใน</p>
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
                        <Link to={`stores`}>
                            ดูทั้งหมด
                        </Link>
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
                        ((showMore ? sortedStoresLocation : sortedStoresLocation?.slice(0, initialOrdersToShow))?.map((store:any, index:number) => (
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
                        ((showMore ? sortedStores : sortedStores?.slice(0, initialOrdersToShow))?.map((store:any, index:number) => (
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
                    storeLocation?.length > initialOrdersToShow && (
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
                    store?.length > initialOrdersToShow && (
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
                <h1 className="text-3xl font-semibold my-10 kanit">ประเภทสินค้าเพื่อคุณ</h1>
                <div className="grid gap-x-8 gap-y-10 grid-cols-4">
                    {
                        isType || errorType ?
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
                    (type?.map((type:any, index:number) => (
                        <Link
                            to={`/type/${type?.typeId}/${type?.typeName}`}
                            key={index}
                            className="hover:scale-105 bg-white rounded-lg"
                        >
                            <img
                                src={require(`../../img/types/${type?.img}`)}
                                alt="img_type"
                                className="rounded shadow-lg hover:scale-105 w-80 h-48"
                            />
                            <h2 className="text-lg font-thin my-2 kanit">{type.typeName}</h2>
                        </Link>
                    )))
                    }
                </div>

            </div>
        </>
    );
}
const promotions = [
    { name: 'สินค้า 1', },
    { name: 'สินค้า 2', },
    { name: 'สินค้า 1', },
    { name: 'สินค้า 2', },
    { name: 'สินค้า 1', },
    { name: 'สินค้า 2', },
    { name: 'สินค้า 1', },
    { name: 'สินค้า 2', },
    { name: 'สินค้า 1', },
    { name: 'สินค้า 2', },
    { name: 'สินค้า 1', },
    { name: 'สินค้า 2', },
    { name: 'สินค้า 1', },
    { name: 'สินค้า 2', },
    { name: 'สินค้า 1', },
    { name: 'สินค้า 2', },
];
export default Home;
<>
    Home
</>