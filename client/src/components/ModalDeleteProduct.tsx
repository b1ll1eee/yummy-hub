import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from "@material-tailwind/react";
import { useRemoveProductMutation } from '../store';

interface OpenModal {
    open: boolean;
    onHide: Function; 
    productId: string;
    productName: string;
}

function ModalDeleteProduct({ open, onHide, productId,productName }: OpenModal) {
  
  const [spin,setSpin] = useState(false);
  const [removeProduct] = useRemoveProductMutation();
  const handleDelete = async () => {
    setSpin(true)
    await removeProduct(productId);
    setSpin(false)
    onHide();
  }

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
                <Dialog.Panel className="p-5 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete product
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure to delete {productName}?
                    </p>
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
                    <Button
                      color='red'
                      variant='outlined'
                      disabled={spin}
                      onClick={handleDelete}
                    >
                      Delete
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

export default ModalDeleteProduct;