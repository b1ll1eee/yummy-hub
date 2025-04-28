import Cookies from "js-cookie";
import { useFetchCartLengthQuery } from "../store";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

function CartLength() {
    const navigate = useNavigate();
    const { data, isFetching, error } = useFetchCartLengthQuery("");

    if(error){
        Cookies.remove('jwt',{ path: '/' });
        Cookies.remove('userdata', { path: '/' });

        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: `Please Login!`,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: true,
        });

        navigate("/login");
    }
    return ( 
        <>
        {isFetching || data === 0 ?
        <></>
        :<div className="kanit absolute bg-red-500 rounded-full px-2 mb-5 ml-4 text-sm text-white">{data}</div>}
        </>
     );
}

export default CartLength;