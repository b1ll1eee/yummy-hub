import { floated } from "@material-tailwind/react/types/components/card"


export interface CreateProduct {
    store?:{
        storeId:number
    },
    type?:{
        typeId:number
    },
    name:string,
    description:string,
    expiryDate:string,
    price:floated,
    discountPrice:floated,
    quantityAvailable:number
}

export interface ProductData {
    productId: string,
    store: object,
    type: {
        typeId: number,
        typeName: string
    },
    name: string,
    description: string,
    expiryDate: string,
    price: number,
    discountPrice: number,
    quantityAvailable: number,
    imgProduct: string,
    isactive: true,
    createdate: string,
    updatedate: string
}