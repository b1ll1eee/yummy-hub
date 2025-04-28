import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Status from "../../components/Status";
import SuccessSkeleton from "../../components/SuccessSkeleton";
import { GoCheckCircle } from "react-icons/go";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

function Success() {
    const order = Cookies.get('orders') !== undefined ? Cookies.get('orders') : null;
    const user = Cookies.get('userdata') !== undefined ? Cookies.get('userdata') : null;
    const jwt = Cookies.get('jwt') !== undefined ? Cookies.get('jwt') : null;

    const navigate = useNavigate();

    const handleSubmit = () =>{
        Cookies.remove('orders', { path: '/' });
        window.scrollTo(0, 0);
        navigate('/');
    }
    
    useEffect(() => {
        if(!order || !user || !jwt){
            Cookies.remove('orders', { path: '/' });
    
            Swal.fire({
                icon: 'error',
                title: 'Permission Failed',
                text: 'Authentication Error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                allowOutsideClick: true,
            });
    
            navigate('/login');
        }
    })

    return ( 
        <div className="bg-gray-50">
            <div className="container mx-auto my-10">
                { false ? <SuccessSkeleton/>
                :
                <>
                    <div className="border shadow mx-auto max-w-7xl mb-10 rounded-md">
                        <Status status={3}/>
                    </div>
                    
                    <div className="max-w-7xl mx-auto border shadow px-10 py-10 rounded-md mb-10">
                        <div className="flex flex-col items-center">
                            <GoCheckCircle className="text-7xl text-red-500 "/>
                            <h1 className="p-5 font-bold text-xl">การจองเสร็จสมบูรณ์ !</h1>
                            <p className="font-semibold text-gray-400">ระบบจะทำการส่งรายละเอียดการจองไปยังเจ้าหน้าที่</p>
                            <p className="font-semibold p-5 text-yellow-600">โปรดรอการอนุมัติ</p>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className='kanit text-lg my-5 cursor-pointer bg-red-600 hover:bg-red-700 mt-10 flex w-64 items-center justify-center rounded-2xl border border-transparent py-2 font-medium text-white'
                            >
                                ตกลง
                            </button>
                        </div>
                    </div>
                </>}
            </div>
        </div>
     );
}

export default Success;