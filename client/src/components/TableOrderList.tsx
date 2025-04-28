import { EyeIcon } from "@heroicons/react/24/outline";
import thaiDateFormat from "../utils/thaiDateFormat";
import { useState,useEffect } from "react";
import { Payment } from "../Model/Payment";
import { useFetchPickupQuery } from "../store";
import { Skeleton } from "@mui/joy";
import ModalApprovePayment from "./ModalApprovePayment";
import { authStoreApi } from "../store/apis/authStoreApi";
import { useDispatch } from "react-redux";

interface TablePayment {
    search: string;
    storeId:string | undefined;
}

function TableOrderList({search,storeId}:TablePayment) {
    const dispatch = useDispatch();
    const { data,isFetching,isError  } = useFetchPickupQuery(storeId) as {
        data:Array<Payment>,
        isFetching:boolean,
        isError:boolean
    };
    const [viewPayment,setViewPayment] = useState(false);
    
    useEffect(()=>{
        if(isError){
            dispatch(authStoreApi.util.resetApiState());
        }
    },[isError])

    let content;
    if(isFetching){
        content = 
            <tr>
                <td>
                    <Skeleton width={815} height={500}/>
                </td>
            </tr>
    }else if(data && data?.length > 0){
        const filterData = data?.filter((item:Payment)=>{
            return(
                thaiDateFormat(item.paymentDate).includes(search) || thaiDateFormat(item.orderDate).includes(search)
            )
        })
        
        if(search === ''){
            content = data.map((item:Payment)=>{
                return(
                    <tr key={item.orderId}>
                        <td className="px-3 text-start">
                            {thaiDateFormat(item.orderDate)}
                        </td>
                        <td className="px-3">
                            {thaiDateFormat(item.paymentDate)}
                        </td>
                        <td className="px-3">
                            {item.totalAmount}
                        </td>
                        <td className="px-3">
                            {item.orderStatus}
                        </td>
                        <td className="px-3">
                            {item.paymentStatus}
                        </td>
                        <td className="px-3 py-2">
                            {item.pickupStatus}
                        </td>
                    </tr>
                )
            })
        }else{
            content = filterData?.map((item:Payment)=>{
                return(
                    <tr key={item.orderId}>
                        <td className="px-3 text-start">
                            {thaiDateFormat(item.orderDate)}
                        </td>
                        <td className="px-3">
                            {thaiDateFormat(item.paymentDate)}
                        </td>
                        <td className="px-3">
                            {item.totalAmount}
                        </td>
                        <td className="px-3">
                            {item.orderStatus}
                        </td>
                        <td className="px-3">
                            {item.paymentStatus}
                        </td>
                        <td className="px-3 py-2">
                            {item.pickupStatus}
                        </td>
                    </tr>
                )
            })
        }
    }else{
        content = 
        <tr>
            <td>No Data</td>
        </tr>
    }
    return (
        <>
            {content}
        </>
        
    )
}

export default TableOrderList;