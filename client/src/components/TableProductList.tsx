import { EyeIcon,TrashIcon } from "@heroicons/react/24/outline";
import thaiDateFormat from "../utils/thaiDateFormat";
import { ProductData } from '../Model/Product'
import ModalDeleteProduct from "./ModalDeleteProduct";
import ModalProduct from "./ModalProduct";
import { useState } from "react";


function TableProductList(item:ProductData) {
    const [removeProduct,setRemoveProduct] = useState(false);
    const [openProduct,setOpenProduct] = useState(false);

    return (
        <tr>
            <td className="px-3 text-start">
                {item.name}
            </td>
            <td className="px-3">
                {thaiDateFormat(item.expiryDate)}
            </td>
            <td className="px-3">
                {item.price}
            </td>
            <td className="px-3">
                {item.discountPrice}
            </td>
            <td className="px-3">
                {item.quantityAvailable}
            </td>
            <td className="px-3 py-2 flex">
                <EyeIcon onClick={()=>setOpenProduct(true)} height={25} className="hover:text-yellow-600 cursor-pointer mr-1"/>
                <TrashIcon onClick={()=>setRemoveProduct(true)} height={25} className="hover:text-red-600 cursor-pointer"/>
                {removeProduct &&
                    <ModalDeleteProduct 
                        productId={item.productId}  
                        productName={item.name}
                        open={removeProduct} 
                        onHide={()=>setRemoveProduct(false)} 
                    />
                }
                {openProduct &&
                    <ModalProduct 
                        open={openProduct} 
                        onHide={()=>setOpenProduct(false)} 
                        product={item}
                    />
                }
            </td>
        </tr>
    )
}

export default TableProductList;