import { Navigate } from "react-router-dom";
import { Skeleton } from '@mui/joy';
import { useFetchAuthStoreQuery } from "../../store";
import Swal from "sweetalert2";
import { Button } from "@material-tailwind/react";
import Cookies from "js-cookie";
import { useState } from "react";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import ModalScanner from "../../components/ModalScanner";
import TableOrderList from "../../components/TableOrderList";
import ModalPickup from "../../components/ModalPickup";



function Order() {
  const { data,isFetching } = useFetchAuthStoreQuery();
  const [ search,setSearch ] = useState('');
  const [ scan,setScan ] = useState(false);
  const [ orderData, setOrderData ] = useState<any>();
  const [ openOrder,setOpenOrder ] = useState(false);


  let content;
  if(isFetching){
      content = <Skeleton />
  }else if(data){
    content = 
    <div className="w-screen h-full justify-center items-center flex flex-col px-10 py-8 mt-8">
      <h1 className="text-3xl font-bold">Order</h1>
      <div className="mt-2 sm:-mx-6 items-center lg:-mx-8">
        <div className="py-4 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="w-full flex flex-row justify-between mb-3">
            <div className="flex items-center w-2/6">
              <input
                type="text"
                id="form-subscribe-Filter"
                className="mr-4 rounded-lg border-transparent flex-1 appearance-none border border-gray-400 w-50 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                placeholder="ค้นหา Date"
                onChange={(e)=>setSearch(e.target.value)}
              />
            </div>
            <div>
              <Button onClick={()=>setScan(true)} variant="outlined" color="blue" className="flex flex-row content-center items-center">
                  Scan-QR <QrCodeIcon width={25} className="ml-2"/>
              </Button>
              {scan && 
                <ModalScanner
                  open={scan}
                  onHide={()=>setScan(false)}
                  setOrderData={setOrderData}
                  setOpenOrder={setOpenOrder}
                />
              }
            </div>
          </div>
            <div className="overflow-hidden">
                <table className="min-w-full text-center">
                <thead className="border-b bg-blue-900">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm font-lg text-white px-6 py-4"
                    >
                      Order Date
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-lg text-white px-6 py-4"
                    >
                      Payment Date
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-lg text-white px-6 py-4"
                    >
                      Total Amount
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-lg text-white px-6 py-4"
                    >
                      Order Status
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-lg text-white px-6 py-4"
                    >
                      Payment Status
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-lg text-white px-6 py-4"
                    >
                      Pickup Status
                    </th>
                  </tr>
                </thead>
                <tbody className="border-black border-b-2">
                    <TableOrderList
                      storeId={data.storeId}
                      search={search}
                    />
                </tbody>
                </table>
            </div>
          </div>
      </div>
    </div>
  }else{
    Cookies.remove('jwt',{ path: '/' });
    Cookies.remove('userdata', { path: '/' });
    Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: `You don't have permission to view this page`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: true,
    });
    return <Navigate to='/'  />
  }

  return ( 
    <>
      {content}
      {orderData &&
        <ModalPickup
          onHide={()=>setOpenOrder(false)}
          open={openOrder}
          orderData={orderData}
        />
      }
    </>
  );
}

export default Order;