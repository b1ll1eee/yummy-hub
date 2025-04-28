import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { Button } from "@material-tailwind/react";
import Html5QrcodePlugin from './Html5QrcodePlugin';
import { Html5QrcodeError } from 'html5-qrcode/esm/core';
import { useFetchPickupCheckMutation,useUpdateStatusPickupMutation } from '../store';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'

interface OpenModal {
  open: boolean;
  onHide: Function; 
  setOrderData:React.Dispatch<React.SetStateAction<any>>
  setOpenOrder:React.Dispatch<React.SetStateAction<boolean>>
}


function ModalScanner( { open, onHide,setOrderData,setOpenOrder }: OpenModal ) {
  const [ checkPickupCode ] = useFetchPickupCheckMutation();
  const [ updatePickupCode ] = useUpdateStatusPickupMutation();
  const [spin,setSpin] = useState(false);


  const onNewScanResult = async (decodedText:string, decodedResult:any) => {
    setSpin(true);
    if(decodedResult.decodedText){
      const orderData = await checkPickupCode({
        pickupCode:decodedText
      })
      if(orderData){
        const updatePickup = await updatePickupCode({
          pickupCode:decodedText
        })
        console.log(updatePickup);
        setOrderData(orderData);
        setOpenOrder(true)
      }
      setSpin(false);
      onHide();
    }
  };
  
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-10" 
        onClose={()=>{}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="p-5 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-2/6 min-h-full">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Scanner
                </Dialog.Title>
                <div className="mt-2">
                  <div className='min-h-full min-w-full'>
                    {!spin &&
                      <Html5QrcodePlugin
                        fps={15}
                        qrbox={{ width: 260, height: 260 }}
                        disableFlip={true}
                        qrCodeSuccessCallback={onNewScanResult} 
                        qrCodeErrorCallback={
                          function (errorMessage: string, error: Html5QrcodeError): void {
                          console.log(errorMessage);
                        }}
                      />
                    }
                    {spin &&
                      <Box sx={{ display: 'flex' ,justifyContent:'center'}}>
                        <CircularProgress size={150} thickness={2}/>
                      </Box>
                    }
                  </div>
                </div>
                <div className="mt-4 h-1/4">
                  <Button
                    color='blue'
                    variant='outlined'
                    className='mr-2'
                    disabled={spin}
                    onClick={()=>onHide()}
                  >
                    Cancel
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ModalScanner;