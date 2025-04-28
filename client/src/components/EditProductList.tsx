import { ProductData } from "../Model/Product"
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Input,Button,Select,Option } from "@material-tailwind/react";
import { Textarea } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { useUpdateProductMutation } from "../store";
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { productApi } from "../store/apis/productApi";
import { storeApi } from "../store/apis/storeApi";

interface EditProduct {
  product:ProductData,
  storeId?:string
}

function EditProductList({product,storeId}:EditProduct) {
  const dispatch = useDispatch();
  const [ updateProduct ] = useUpdateProductMutation();
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 1MB
  const ALLOWED_FILE_TYPES = ['image/png','image/jpg','image/jpeg'];
  const navigate = useNavigate();
  const [isSubmit,setIsSubmit] = useState(false);

  const validationSchema = yup.object().shape({
    type: yup
      .number()
      .required('please select a type'),
    name: yup
      .string()
      .required('name is required.'),
    description: yup
      .string()
      .required('description is require'),
    expiryDate: yup
      .date()
      .required('expire date is require'),
    price: yup
      .number()
      .required('price is required.'),
    discountPrice: yup
      .number()
      .required('discount price is required.'),
    quantityAvailable: yup
      .number()
      .required('quantity is required.'),
    file: yup.array()
    .of(
    yup.mixed()
      .required('Please select an image')
      .test(
        'fileSize',
        'ขนาดไฟล์ต้องน้อยกว่า 1MB',
        (value:any) => value && value.size <= MAX_FILE_SIZE 
      )
      .test(
        'fileType',
        'รองรับไฟล์ PNG, JPG, หรือ JPEG เท่านั้น',
        (value:any) =>
          value &&
          ALLOWED_FILE_TYPES.includes(value.type)
      )
    ),
    
  });
  const filePath = require(`C:/image/Files-Upload/products/${product.imgProduct}`);
  const parsedDate = new Date(product.expiryDate);
  const formattedDate = parsedDate.toISOString().slice(0, 16);
  const fileImage = new File([filePath], product.imgProduct, { type: 'image/jpeg' });
 
  const formik = useFormik({
    initialValues: {
      type:product.type.typeId,
      name: product.name,
      description:product.description,
      expiryDate:formattedDate,
      price:product.price,
      discountPrice:product.discountPrice,
      quantityAvailable:product.quantityAvailable,
      file: []
    },
    validationSchema: validationSchema,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit: async (values) => {
        validationSchema
          .validate(values, { abortEarly: false })
          .then( async () => {
            let imgFile;
            if(values.file.length === 0){
              imgFile = fileImage
            }else{
              imgFile = values.file[0]
            }
            if(storeId){
              const productData = {
                store:{
                  storeId:storeId
                },
                type:{
                  typeId:values.type
                },
                name:values.name,
                description:values.description,
                expiryDate:`${values.expiryDate}:00`,
                price:values.price,
                discountPrice:values.discountPrice,
                quantityAvailable:values.quantityAvailable,
                file:imgFile,
                productId:product.productId
              }
              console.log(productData);
              setIsSubmit(true);
              await updateProduct(productData);
              dispatch(storeApi.util.resetApiState());
              dispatch(productApi.util.resetApiState());
              setIsSubmit(false);
              navigate('/store/product');
            }
          })
          .catch((errors) => {
            formik.setErrors(errors.inner.reduce((acc:any, error:any) => {
              acc[error.path] = error.message;
              return acc;
            }, {}));
          });
      },
  });

  const typeOption = [
    { typeName: 'อาหารแห้ง', typeId: '1' },
    { typeName: 'เครื่องดื่ม', typeId: '2' },
    { typeName: 'ขนมปัง', typeId: '3' },
    { typeName: 'อาหารกระป๋อง', typeId: '4' },
    { typeName: 'ผัก', typeId: '5' },
    { typeName: 'ผลไม้', typeId: '6' },
  ];

  const handleCancel = () =>{
    navigate('/store/product')
}

  return (
    <div className="w-screen h-full flex flex-col justify-center items-center mt-16">
      <h2 className="text-2xl font-bold">UPDATE PRODUCT</h2>
      <form className="mt-6 px-6 w-4/12" onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <Select 
              disabled={isSubmit}
              variant="standard" 
              label="Type" 
              id="type"
              name="type"
              value={formik.values.type.toString()}
              onChange={(event) => {
                const selectedType = typeOption.find( item =>  item.typeId === event);
                formik.setFieldValue('type', selectedType?.typeId);
              }}
            >
                {typeOption.map((option) => (
                  <Option key={option.typeId} value={option.typeId}>
                    {option.typeName}
                  </Option>
                ))}
            </Select>
            {formik.errors.type ? (
                <div className="text-red-500 text-xs">{formik.errors.type}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <Input
              disabled={isSubmit}
              label='Name'
              variant='standard' 
              crossOrigin={undefined}  
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}             
            />
            {formik.errors.name ? (
              <div className="text-red-500 text-xs">{formik.errors.name}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <Textarea
              disabled={isSubmit}
              label='Description'
              variant='standard' 
              id="description"
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
            />
            {formik.errors.description ? (
              <div className="text-red-500 text-xs">{formik.errors.description}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <Input
              disabled={isSubmit}
              label='Expire Date'
              variant='standard' 
              crossOrigin={undefined}  
              type="datetime-local"
              id="expiryDate"
              name="expiryDate"
              onChange={formik.handleChange}
              value={formik.values.expiryDate}
            />
            {formik.errors.expiryDate ? (
              <div className="text-red-500 text-xs">{formik.errors.expiryDate}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <Input
              disabled={isSubmit}
              label='Price'
              variant='standard'
              crossOrigin={undefined}  
              type="number"
              id="price"
              name="price"
              onChange={formik.handleChange}
              value={formik.values.price}
            />
            {formik.errors.price ? (
              <div className="text-red-500 text-xs mb-3">{formik.errors.price}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <Input
              disabled={isSubmit} 
              label='Discount Price'
              variant='standard'
              crossOrigin={undefined}  
              type="number"
              id="discountPrice"
              name="discountPrice"
              onChange={formik.handleChange}
              value={formik.values.discountPrice}
            />
            {formik.errors.discountPrice ? (
              <div className="text-red-500 text-xs mb-3">{formik.errors.discountPrice}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <Input
              disabled={isSubmit} 
              label='Quantity'
              variant='standard'
              crossOrigin={undefined}  
              type="number"
              id="quantityAvailable"
              name="quantityAvailable"
              onChange={formik.handleChange}
              value={formik.values.quantityAvailable}
            />
            {formik.errors.quantityAvailable ? (
              <div className="text-red-500 text-xs mb-3">{formik.errors.quantityAvailable}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <Input
              disabled={isSubmit} 
              label='Image'
              crossOrigin={undefined}  
              id="file"
              name="file"
              accept=".jpg, .jpeg, .png"
              type='file'
              variant='standard'
              onChange={(event:any) => {
                const inputElement = event.target as HTMLInputElement;
                if (inputElement.files) {
                  const filesArray = Array.from(inputElement.files);
                  console.log(filesArray);
                  
                  formik.setFieldValue('file', filesArray);
                }
              }}
            />
            {formik.values.file.length === 0 ? (
              <div className="p-4 mt-4 bg-sky-100 overflow-hidden text-ellipsis flex justify-center">
                <img
                  src={require(`C:/image/Files-Upload/products/${product.imgProduct}`)}
                  alt={formik.values?.file[0]}
                  className="max-w-xs flex"
                />
              </div>
              ):(
              <div className="p-4 mt-4 bg-sky-100 overflow-hidden text-ellipsis flex justify-center">
                <img
                  src={URL.createObjectURL(formik.values?.file[0])}
                  alt={formik.values?.file[0]}
                  className="max-w-xs flex"
                />
              </div>
            )}
            {formik.errors.file ? (
              <div className="text-red-500 text-xs mb-3">{formik.errors.file}</div>
            ) : null}
          </div>
          <div className='flex row'>
            <Button
              disabled={isSubmit} 
              variant='outlined'
              color='red'
              className='w-full mr-3'
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmit} 
              type="submit" 
              variant='outlined'
              color='blue'
              className='w-full'
            >
              Update
            </Button>
          </div>
      </form>
    </div>
  )
}

export default EditProductList;