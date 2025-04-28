import { Payment } from "../Model/Payment"
import thaiDateFormat from "../utils/thaiDateFormat";
import { EyeIcon } from "@heroicons/react/24/outline";
import ModalApprovePayment from "./ModalApprovePayment";
import { useState } from "react";

function TablePaymentItemList(item:Payment) {
const [viewPayment,setViewPayment] = useState(false);

  return (
    <>
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
        <td className="px-3 py-2 flex">
            <EyeIcon onClick={()=>setViewPayment(true)} height={25} className="hover:text-yellow-600 cursor-pointer mr-1"/>
            <ModalApprovePayment 
                onHide={()=>setViewPayment(false)}
                open={viewPayment}
                payment={item}
            />
        </td>
        </tr>
    </>
  )
}

export default TablePaymentItemList;