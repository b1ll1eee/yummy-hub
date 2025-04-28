import { useFetchFavouriteQuery, useRemoveFavouriteMutation } from "../../store";
import imagepath from "../../img/Example1.webp";
import { Box, Skeleton } from "@mui/material";
import Swal from "sweetalert2";
import { Link, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AiFillHeart } from "react-icons/ai";

function Favorite() {
    const { data, isFetching, error } = useFetchFavouriteQuery("");
    const [ unFavorite ] = useRemoveFavouriteMutation();

    const handleClick = async (id:string) => {
        Swal.fire({
            timerProgressBar: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            background: 'transparent',
            didOpen: () => {
              Swal.showLoading();
            }
        })
        await unFavorite(id);
        Swal.close();
    }

    if(error){
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

        return <Navigate to='/login'  />
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
            <div className="bg-red-500">
            <p className="text-4xl leading-tight font-semibold text-white px-24 py-10 kanit">
                Favorite
            </p>
            </div>
            <div className="bg-gray-50">
                <div className="container max-w-7xl px-4 mx-auto sm:px-8">
                    <div className="py-8">
                        <div className="flex flex-col w-full mb-1">
                            {
                                isFetching || error ?
                                <div className="grid gap-x-8 gap-y-10 grid-cols-4 mt-10">
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
                                (data.length === 0 ?
                                    <div className="flex flex-col justify-center py-20 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="4 4 40 40" className="w-20">
                                            <path className="fill-slate-200" d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" fill="#000000"/>
                                        </svg>
                                        <p className="mt-6 text-3xl text-slate-400 kanit">ไม่มีร้านค้าที่ชื่นชอบ</p>
                                        
                                    </div>
                                :
                                    <div className="grid gap-x-8 gap-y-10 grid-cols-4 mt-10">
                                        {data.map((store:any, index:number) => (
                                            <div
                                                key={index}
                                            >
                                                <Link to={`/infostore/${store.store.storeId}`}>
                                                    <img
                                                        src={imagepath}
                                                        alt="img_store"
                                                        className="rounded shadow-lg hover:scale-105"
                                                    />
                                                </Link>
                                                <div className="flex justify-between items-center cursor-pointer mx-2">
                                                    <Link to={`/infostore/${store.storeId}`} className="text-lg font-thin my-2 kanit">{store.store.name}</Link>
                                                    <AiFillHeart size={20} className="text-red-500" onClick={() => handleClick(store.favouriteId)}/>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
                            <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
                                
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}

export default Favorite;