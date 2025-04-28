import Cookies from "js-cookie";
import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import { useFetchCartOrderQuery, useFetchCartQuery, useGeneratePromptpayQRCodeQuery, usePaymentMutation } from "../../store";
import { GoStopwatch } from "react-icons/go";
import { CircularProgress } from "@mui/joy";
import { useNavigate } from "react-router";
import Status from "../../components/Status";
import PaymentSkeleton from "../../components/PaymentSkeleton";
import { Link } from "react-router-dom";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@mui/material";
import Swal from "sweetalert2";
import { async } from "q";

function Payment() {
    const order = Cookies.get('orders') !== undefined ? Cookies.get('orders') : null;
    const user = Cookies.get('userdata') !== undefined ? Cookies.get('userdata') : null;

    let ordersData:any;
    if(order){
      ordersData = JSON.parse(order)
    }

    let userData;
    if(user){
        userData = JSON.parse(user)
    }
    const ref = useRef<HTMLInputElement>(null);
    const { data, isFetching, error } = useGeneratePromptpayQRCodeQuery(ordersData);
    const [agreeToPolicy, setAgreeToPolicy] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [selectedFileUrl, setSelectedFileUrl] = useState<string>();
    const initialMinutes = 15;
    const [minutes, setMinutes] = useState(initialMinutes);
    const [seconds, setSeconds] = useState(0);
    const navigate = useNavigate();
    const { data:orderItem, isFetching:isOrderItem, error:errorOrderItem } = useFetchCartQuery("");
    const { data:orders, isFetching:isOrder, error:errorOrder } = useFetchCartOrderQuery("");
    const filteredOrders = orders?.filter((order:any) => ordersData?.includes(order?.orderId));
    const totalAmountSum = filteredOrders?.reduce((sum:number, order:any) => sum + order.totalAmount, 0);
    const [ addPayment ] = usePaymentMutation();
    const [isRunning, setIsRunning] = useState(true);

    const handleClick = () => {
      ref.current?.click();
    }

    const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          if (file.type === 'image/jpeg' || file.type === 'image/png') {
            const fileUrl = URL.createObjectURL(file);
            setFile(file);
            setSelectedFileUrl(fileUrl);
            setAgreeToPolicy(!agreeToPolicy)
          } else {
            alert('Please select a valid image file (JPEG or PNG).');
          }
        }
    };

    useEffect(() => {
      let interval: NodeJS.Timeout | undefined;
  
      if (minutes === 0 && seconds === 0) {
        clearInterval(interval);
        navigate('/cart');
        window.scrollTo(0, 0);
      } else if (isRunning) {
        interval = setInterval(() => {
          if (seconds === 0) {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setSeconds(59);
          } else {
            setSeconds((prevSeconds) => prevSeconds - 1);
          }
        }, 1000);
      }
  
      return () => {
        clearInterval(interval);
      };
    }, [minutes, seconds, isRunning]);

    const handleSubmit = () => {
      setIsRunning(false);
      Swal.fire({
        timerProgressBar: true,
        allowEscapeKey: false,
        allowOutsideClick: false,
        background: 'transparent',
        didOpen: () => {
          Swal.showLoading();
        }
      })

      const sendPaymentRequest = async (orderId:string) => {
        const paymentData = new FormData();
        paymentData.append('order', JSON.stringify({
          orderId,
        }));
        if (file) {
          paymentData.append('file', file);
        }

        return addPayment(paymentData);
      };

      const paymentPromises = ordersData.map((result:string) => (sendPaymentRequest(result)));

      Promise.all(paymentPromises)
      .then((results) => {
        Swal.close();
        const isSuccess = results.every(result => result?.data?.status === "OK");

        if (isSuccess) {
          Swal.fire({
            icon: 'success',
            title: 'Successful',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: true,
            text: 'ชำระเงินเสร็จสิ้น',
          });
        } else {
          Cookies.remove('jwt',{ path: '/' });
          Cookies.remove('userdata', { path: '/' });
          Cookies.remove('orders', { path: '/' });

          Swal.fire({
            icon: 'error',
            title: 'Payment Failed',
            text: 'Authentication Error',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: true,
          });
        }
      });
      window.scrollTo(0, 0);
      navigate(`/success`);
    };

    const timeCheck = (store:any) => {
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
      const startTime = store?.storeOpen?.split(":").slice(0, 2).join(":");
      const endTime = store?.storeClose?.split(":").slice(0, 2).join(":");
      if(currentTime >= startTime && currentTime <= endTime){
          return true
      }
      else{
          return false
      }
    };

    const discountCheck = (item:any) => {
      const targetTime = new Date(); // Replace this with your dynamic target time
      targetTime.setHours(item?.store?.storeClose?.split(":")[0], item?.store?.storeClose?.split(":")[1], item?.store?.storeClose?.split(":")[2]);
      const oneHourBeforeTarget = new Date(targetTime);
      oneHourBeforeTarget.setHours(oneHourBeforeTarget.getHours() - 1);
      const current = new Date();
      if (current > oneHourBeforeTarget && current < targetTime) {
          return true;
      }
      else{
          return false;
      }
    };

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    if(error || errorOrder || errorOrderItem){
        Cookies.remove('jwt',{ path: '/' });
        Cookies.remove('userdata', { path: '/' });
        Cookies.remove('orders', { path: '/' });

        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: `Please Login!`,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: true,
        });

        navigate('/login');
    }

    return ( 
      <div className="bg-gray-50">
        <div className="container mx-auto py-5">
          <nav>
              <ol className="flex mb-4">
                  <div className="flex items-center">
                      <Link to="/" className="mr-2 kanit text-xl font-medium text-red-500">
                          Home
                      </Link>
                      <div className='mr-2 kanit text-lg font-medium'>/</div>
                  </div>
                  <div className="flex items-center">
                      <Link to="/cart" className="mr-2 kanit text-xl font-medium text-red-500">
                          Cart
                      </Link>
                  </div>
              </ol>
          </nav>
            <div className="border shadow mx-auto max-w-7xl mb-10 rounded-md">
              <Status status={2}/>
            </div>
            { error || isFetching || isOrder || isOrderItem || errorOrder || errorOrderItem ? 
              <PaymentSkeleton/>
            :
            <div className="max-w-7xl mx-auto border shadow px-10 py-5 rounded-md">
                <div className="px-6 pb-16 pt-10">
                    <div>
                        <h1 className="border-l-8 mb-2 border-red-700 pl-3 text-2xl font-bold kanit">ชำระเงิน</h1>
                    </div>

                    <div className="flex flex-col items-center border-b-2 mt-10 ">

                        <img className="w-72 border-x-2 border-t-2 rounded-t-md" src={require(`../../img/thai_qr_payment.png`)} alt="logo"/>
                        {isFetching || error ?
                        <div className="border-x-2 border-b-2 w-72 rounded-b-md py-8 flex justify-center">
                          <span className="border-x-2 border-y-2 w-56 h-56 flex justify-center items-center">
                              <CircularProgress /> 
                          </span>
                        </div> 
                        : 
                          <img className="border-x-2 border-b-2 w-72 rounded-b-md" src={data.results} alt="QRCode"/>}
                        <p className="mt-5 text-xl font-bold kanit">Yummy Hub</p>
                        <div className="text-center py-5">
                            <div className="text-lg font-bold mt-4 flex items-center text-red-500">
                                <GoStopwatch className="mr-3 text-xl font-bold"/> {formattedMinutes}:{formattedSeconds}
                            </div>
                        </div>
                        
                    </div>
                    <div className="kanit block mt-8 py-8 pr-44 pl-8 bg-white border border-gray-200 rounded-xl shadow-md">
                        <p className="mb-4 text-2xl font-semibold ">ข้อมูลผู้รับสินค้า</p>
                        {
                            isOrder || isOrderItem ?
                            <>
                                <Skeleton width="60%" height={30} />
                                <Skeleton width="100%" height={30} />
                            </>
                            :
                            <>
                                <p className="mb-1 font-normal text-gray-600">คุณ {userData?.firstname} {userData?.lasname}</p>
                                <p className="font-normal text-gray-600">อีเมล {userData?.email}</p>
                            </>
                        }
                    </div>
                    <div className='row-end-2 row-span-1 bg-white rounded-xl mt-8 pb-2 shadow-md'>
                      {filteredOrders?.map((order:any) => (
                          <>
                          <div key={order?.orderId} className="p-2 border border-gray-200 flex justify-between items-center">
                              <span className="kanit text-xl mx-2 flex items-center">
                                  {order?.store?.name}
                                  <div className="ml-4">
                                  {
                                      timeCheck(order?.store) ?
                                      <div className='bg-green-400 rounded-md px-2 py-1 text-xs'>Open</div>
                                      :
                                      <div className='bg-red-400 rounded-md px-2 py-1 text-xs'>Close</div>
                                  }
                                  </div>
                              </span>
                          </div>
                          {orderItem?.filter((item:any) => item?.orders?.orderId === order?.orderId).map((filteredItem: any) =>(
                              <div key={filteredItem?.orderId} className="mx-6 my-4 items-start flex justify-between">
                                  <div className="flex items-center">
                                      <img
                                          src={require(`C:/image/Files-Upload/products/${filteredItem?.product?.imgProduct}`)}
                                          alt="img_product"
                                          className="rounded-3xl shadow-lg w-10 h-10"
                                      />
                                      <div className="kanit ml-2">
                                          <p className="text-lg">{filteredItem?.product?.name}</p> 
                                          <div className="text-sm flex text-gray-500">{filteredItem?.quantity} X 
                                          {
                                          discountCheck(order) && filteredItem?.product?.discountPrice === filteredItem?.price ?
                                          <div className="flex items-center ml-1">
                                              <p className="line-through mr-1">{filteredItem?.product?.price}</p>
                                              <p className="">{filteredItem?.product?.discountPrice}</p>
                                          </div>
                                          :
                                          <p className="ml-1">{filteredItem?.product?.price}</p>
                                          }
                                          </div>
                                      </div>
                                  </div>
                              </div> 
                          ))
                          }
                          <div className="flex justify-between kanit text-red-500 mx-7 mt-10 text-lg mb-4">
                              <div>
                                  ทั้งหมด
                              </div>
                              <div>
                                  {order?.totalAmount}
                              </div>
                          </div>
                          </>
                      ))}
                    </div>
                    <div className="flex justify-between items-center my-7 kanit mx-5">
                      <p className="text-xl font-semibold">ราคารวม</p>
                      {
                        isOrder || isOrderItem ?
                        <Skeleton width="15%" height={30} />
                        :
                      <p className="text-xl font-semibold text-red-500">{totalAmountSum} บาท</p>}
                    </div>
                      <div>
                        <div className="mt-16 mx-48">
                          <div
                              onClick={handleClick}
                              className="p-2 flex flex-col items-center gap-2 bg-red-400 text-white rounded-2xl kanit hover:bg-red-500 cursor-pointer"
                          >
                              <CloudArrowUpIcon className="w-6 h-6" />
                              <span>Choose some files to upload</span>
                              <input
                                  required
                                  type="file"
                                  accept=".jpg, .jpeg, .png"
                                  ref={ref}
                                  className="hidden"
                                  onChange={handlePhotoUpload}
                              />
                          </div>
                          {file && (
                              <div className="p-4 mt-4 bg-gray-50 overflow-hidden text-ellipsis flex justify-center">
                              <img
                                  src={selectedFileUrl}
                                  alt={file.name}
                                  className="max-w-xs flex"
                              />
                              </div>
                          )}
                        </div>
                        <form onSubmit={handleSubmit} className="mt-5 flex justify-center items-center">
                          <button
                              type="submit"
                              disabled={!agreeToPolicy}
                              className={`${agreeToPolicy ? 'bg-opacity-100 cursor-pointer bg-red-600 hover:bg-red-700' : 'bg-opacity-50 cursor-not-allowed bg-gray-500'} 
                              mt-10 flex w-64 items-center justify-center rounded-2xl border border-transparent px-8 py-3 text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                          >
                              ยืนยัน
                          </button>
                          <Link to="/" className="cursor-pointer mt-10 ml-10 p-0">
                              ยกเลิก
                          </Link>
                        </form>
                      </div>
                </div>
            </div>}
        </div>
      </div>
    );
}

export default Payment;