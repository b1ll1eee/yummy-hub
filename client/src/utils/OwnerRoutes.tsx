import { useFetchAuthStoreQuery } from '../store';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { Skeleton } from '@mui/joy';
import Store from '../pages/store/Store';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { resetLogin } from '../store';
import { resetMFALogin } from '../store';
import { useEffect } from 'react';

function OwnerRoutes() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data,isFetching,isError } = useFetchAuthStoreQuery();

    useEffect(()=>{
        if(isError){
            Cookies.remove('jwt',{ path: '/' });
            Cookies.remove('userdata', { path: '/' });
            dispatch(resetLogin());
            dispatch(resetMFALogin());
            Swal.fire({
                icon: 'error',
                title: 'Authentication Error',
                text: `Time Out owner`,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                allowOutsideClick: true,
            });
            navigate('/login');
        }
    },[isError])

    let content;
    if(isFetching){
        content = <Skeleton />
    }else if(data){
        content = <Store {...data}/>
        
    }

    return ( 
        <>
            {content}
        </>
     );
}

export default OwnerRoutes;