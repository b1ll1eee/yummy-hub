import { useState } from "react";
import { useFetchHistoryQuery } from "../../store";
import { Skeleton } from "@mui/joy";
import { HistoryData } from "../../Model/History";
import { EyeIcon } from "@heroicons/react/24/outline";
import ModalHistory from "../../components/ModalHistory";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";


function History() {
    const navigate = useNavigate();
    const [onOpen,setOnOpen] = useState(false);
    const { data, isFetching, error } = useFetchHistoryQuery("");
    const [selectedItem, setSelectedItem] = useState({});

    const [selectedStatus, setSelectedStatus] = useState('All');
    const filteredData = data?.filter((item: HistoryData) => {
        if (selectedStatus === 'All') {
            return true; 
        }else if (selectedStatus === 'Pending') {
            return (
                item.orderStatus === 'Pending' &&
                item.paymentStatus === 'Pending'
            )
        }else if (selectedStatus === 'Reject') {
            return (
                item.orderStatus === 'Failed' &&
                item.paymentStatus === 'Reject'
            );
        }else if (selectedStatus === 'Waiting') {
            return (
                item.orderStatus === 'Pending' &&
                item.paymentStatus === 'Approve' &&
                item.pickupStatus === 'Pending'
            );
        }else if (selectedStatus === 'Failed') {
            return (
                item.orderStatus === 'Failed' &&
                item.paymentStatus === 'Approve' &&
                item.pickupStatus === 'Failed'
            );
        }else if (selectedStatus === 'Receive') {
            return (
                item.orderStatus === 'Success' &&
                item.paymentStatus === 'Approve' &&
                item.pickupStatus === 'Received'
            );
        }
        
        return false; 
    });
    


    const handleClick = (item:any) => {
        console.log(item)
        setOnOpen(true);
        setSelectedItem(item);
    }

    const handleClose = () => {
        setOnOpen(false);
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

        navigate('/login');
    }

    const formateDate = (date:string) => {
        const inputDate = new Date(date);
  
        const day = inputDate.getDate();
        const month = inputDate.getMonth() + 1;
        const year = inputDate.getFullYear();
  
        const hours = inputDate.getHours();
        const minutes = inputDate.getMinutes();
  
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      }

    return (
        <>
        {onOpen && selectedItem && (
            <ModalHistory open={onOpen} onHide={handleClose} item={selectedItem} />
        )}
        <div className="bg-red-500">
            <p className="text-4xl leading-tight font-semibold text-white px-24 py-10 kanit">
                Order
            </p>
        </div>
        <div className="bg-gray-50">
            <div className="container max-w-7xl px-4 mx-auto">
                <div className="pt-1 pb-8">
                    <div className="flex flex-row justify-end w-full mb-1">
                        <div className="text-end mt-5">
                            <select
                                className="rounded-lg border-transparent flex-1 border-2 border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-md text-base focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="All">ทั้งหมด</option>
                                <option value="Pending">รอการตรวจสอบ</option>
                                <option value="Failed">ไม่ได้รับสินค้า</option>
                                <option value="Reject">ปฎิเสธการชำระเงิน</option>
                                <option value="Waiting">รอรับสินค้า</option>
                                <option value="Receive">รับสินค้า</option>
                            </select>
                        </div>
                    </div>
                    <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
                        <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th scope="col" className="kanit px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200">
                                            no.
                                        </th>
                                        <th scope="col" className="kanit px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200">
                                            ชื่อร้านค้า
                                        </th>
                                        <th scope="col" className="kanit px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200">
                                            วันเวลา
                                        </th>
                                        <th scope="col" className="kanit px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200">
                                            สถานะ
                                        </th>
                                        <th scope="col" className="kanit px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isFetching || error ?
                                        <tr className="bg-white border-b-2 border-black">
                                            <td colSpan={10}>
                                                <Skeleton className='px-5 py-5 my-4' variant="text" level="h1" />
                                                <Skeleton className='px-5 py-5 my-4' variant="text" level="h1" />
                                                <Skeleton className='px-5 py-5 my-4' variant="text" level="h1" />
                                            </td>
                                        </tr> :
                                        (filteredData?.map((data: HistoryData, index: number) => (
                                            <tr key={data.orderId}>
                                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                                    <div className="flex items-center">
                                                        <div className="ml-3">
                                                            <p className="kanit text-gray-900 whitespace-no-wrap">
                                                                {data?.orderId}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                               
                                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                                    <p className="kanit text-gray-900 whitespace-no-wrap">
                                                        {data?.store?.name}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                                    <p className="kanit text-gray-900 whitespace-no-wrap">
                                                        {formateDate(data?.orderDate)}
                                                    </p>
                                                </td>
                                                <td className="kanit px-5 py-5 text-sm bg-white border-b border-gray-200">
                                                    {data?.orderStatus === 'Pending' && data?.paymentStatus === 'Pending' ?
                                                        <span className="relative inline-block px-3 py-1 font-semibold leading-tight text-yellow-900">
                                                            <span aria-hidden="true" className="absolute inset-0 bg-yellow-200 rounded-full opacity-50">
                                                            </span>
                                                            <span className="relative">
                                                                รอการตรวจสอบ
                                                            </span>
                                                        </span>
                                                        : data?.orderStatus === 'Failed' && data?.paymentStatus === 'Reject' ?
                                                            <span className="relative inline-block px-3 py-1 font-semibold leading-tight text-red-900">
                                                                <span aria-hidden="true" className="absolute inset-0 bg-red-200 rounded-full opacity-50"></span>
                                                                <span className="relative">
                                                                    ปฎิเสธการชำระเงิน
                                                                </span>
                                                            </span>
                                                            : data?.orderStatus === 'Pending' && data?.paymentStatus === 'Approve' && data?.pickupStatus === 'Pending' ?
                                                                <span className="relative inline-block px-3 py-1 font-semibold leading-tight text-yellow-900">
                                                                    <span aria-hidden="true" className="absolute inset-0 bg-yellow-200 rounded-full opacity-50"></span>
                                                                    <span className="relative">
                                                                        รอรับสินค้า
                                                                    </span>
                                                                </span>
                                                                : data?.orderStatus === 'Failed' && data?.paymentStatus === 'Approve' && data?.pickupStatus === 'Failed' ?
                                                                    <span className="relative inline-block px-3 py-1 font-semibold leading-tight text-red-900">
                                                                        <span aria-hidden="true" className="absolute inset-0 bg-red-200 rounded-full opacity-50"></span>
                                                                        <span className="relative">
                                                                            ไม่ได้รับสินค้า
                                                                        </span>
                                                                    </span>
                                                                    : data?.orderStatus === 'Success' && data?.paymentStatus === 'Approve' && data?.pickupStatus === 'Received' ?
                                                                    <span className="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900">
                                                                        <span aria-hidden="true" className="absolute inset-0 bg-green-200 rounded-full opacity-50"></span>
                                                                        <span className="relative">
                                                                            รับสินค้าแล้ว
                                                                        </span>
                                                                    </span>:<></>
                                                    }
                                                </td>
                                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                                    <EyeIcon  height={25} className="hover:text-red-600 cursor-pointer mr-1" onClick={() => handleClick(data)}/>
                                                </td>
                                            </tr>
                                        )))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default History;