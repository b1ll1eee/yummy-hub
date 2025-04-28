import { NavLink } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import { FiLogOut } from "react-icons/fi";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import TablePaymentList from "../../components/TablePaymentList";
import { useState } from "react";
 
function ManagePayment() {
    const navigate = useNavigate();
    const [ search,setSearch ] = useState('');

    const handleLogout = () => {
        Cookies.remove('jwt',{ path: '/' });
        Cookies.remove('userdata', { path: '/' });
        Swal.fire({
            icon: 'success',
            title: 'Logout',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: true,
            text: 'Logout Successful',
        });
        navigate("/");
    }

    return (
        <div>
            <div className="px-6 py-2 bg-slate-950 border-slate-700 p-0">
                <div className="flex items-center justify-between text-blue-gray-900">
                    <div>
                        <Typography
                            as="li"
                            variant="small"
                            color="blue-gray"
                            className="p-1 font-medium" 
                        >
                            <NavLink 
                                to='/admin'  
                                className='text-base text-white'
                            >
                                ADMIN
                            </NavLink>
                        </Typography> 
                    </div>
                    <Typography
                        as="a"
                        href="#"
                        variant="h6"
                        className="mx-4 cursor-pointer py-3 text-white hover:text-yellow-500"
                    >
                        <div onClick={handleLogout} className="flex justify-center items-center ">
                            Logout<FiLogOut className="ml-2" size={18}/>
                        </div>
                    </Typography>
                </div>
            </div>
            <div className="w-screen h-full justify-center items-center flex flex-col px-10 py-8 mt-8">
            <h1 className="text-3xl font-bold">Manage Payment</h1>
            <div className="overflow-x-auto mt-2 sm:-mx-6 items-center lg:-mx-8">
                <div className="py-4 inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="w-full flex flex-row justify-between mb-3">
                        <div className="flex w-2/6">
                            <input
                                type="text"
                                id="form-subscribe-Filter"
                                className="mr-4 rounded-lg border-transparent flex-1 appearance-none border border-gray-400 w-40 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                placeholder="ค้นหา Date"
                                onChange={(e)=>setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <table className="min-w-full text-center">
                        <thead className="border-b bg-blue-900">
                            <tr>
                                <th
                                    scope="col"
                                    className="text-sm font-lg text-white px-6 py-4"
                                >
                                    Order Date
                                </th>
                                <th
                                    scope="col"
                                    className="text-sm font-lg text-white px-6 py-4"
                                >
                                    Payment Date
                                </th>
                                <th
                                    scope="col"
                                    className="text-sm font-lg text-white px-6 py-4"
                                >
                                    Total Amount
                                </th>
                                <th
                                    scope="col"
                                    className="text-sm font-lg text-white px-6 py-4"
                                >
                                    Order Status
                                </th>
                                <th
                                    scope="col"
                                    className="text-sm font-lg text-white px-6 py-4"
                                >
                                    Payment Status
                                </th>
                                <th
                                    scope="col"
                                    className="text-sm font-lg text-white px-6 py-4"
                                >
                                    
                                </th>
                            </tr>
                        </thead>
                        <tbody className="border-black border-b-2">
                            <TablePaymentList search={search}/>
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default ManagePayment;