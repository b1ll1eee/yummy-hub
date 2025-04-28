
import thaiDateFormat from "../utils/thaiDateFormat";
import { useState } from "react";
import { Payment } from "../Model/Payment";
import { useFetchPaymentQuery } from "../store";
import { Skeleton } from "@mui/joy";
import TablePaymentItemList from "./TablePaymentItemList";

interface TablePayment {
    search: string;
}

function TablePaymentList({search}:TablePayment) {
    const { data,isFetching  } = useFetchPaymentQuery('') as {
        data:Array<Payment>,
        isFetching:Boolean
    };


    let content;
    if(isFetching){
        content = 
            <tr>
                <td>
                    <Skeleton width={726} height={500}/>
                </td>
            </tr>
    }else if(data.length > 0){
        const filterData = data.filter((item)=>{
            return(
                thaiDateFormat(item.paymentDate).includes(search) || thaiDateFormat(item.orderDate).includes(search)
            )
        })
        if(search === ''){
            content = data.map((item:Payment)=>{
                return(
                    <TablePaymentItemList key={item.orderId} {...item}/>
                )
            })
        }else{
            content = filterData.map((item:Payment)=>{
                return(
                    <TablePaymentItemList key={item.orderId} {...item}/>
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

export default TablePaymentList;