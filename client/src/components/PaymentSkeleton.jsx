import { Box, CircularProgress, Skeleton } from "@mui/material";
import { GoStopwatch } from "react-icons/go";

function PaymentSkeleton() {

    function Media({width, height}) {
        return (
          <div>
            <Box sx={{ width: width, height: height }}>
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg xl:aspect-h-8 xl:aspect-w-7">
                <Skeleton animation="wave" variant="rectangular" width={width} height={height} />
              </div>
            </Box>
          </div>
        );
    }

    return ( 
        <div className="max-w-7xl mx-auto border shadow px-10 py-5 rounded-md">
            <div className="px-6 pb-16 pt-10">
                <div>
                    <h1 className="border-l-8 mb-2 border-red-700 pl-3 text-2xl font-bold"><Media width={300} height={30}/></h1>
                </div>

                <div className="flex flex-col items-center border-b-2 mt-10 ">

                    <img className="w-72 border-x-2 border-t-2 rounded-t-md" src={require(`../img/thai_qr_payment.png`)} alt="logo"/>
                    <div className="border-x-2 border-b-2 w-72 rounded-b-md py-8 flex justify-center">
                        <span className="border-x-2 border-y-2 w-56 h-56 flex justify-center items-center">
                            <CircularProgress /> 
                        </span>
                    </div> 
                    <p className="mt-5 text-xl font-bold">Yummy Hub</p>
                    <div className="text-center py-5">
                        <div className="text-lg font-bold mt-4 flex items-center text-red-500">
                            <GoStopwatch className="mr-3 text-xl font-bold"/><Media width={100} height={20}/>
                        </div>
                    </div>
                    
                </div>
                <div className="w-full rounded-lg overflow-hidden">
                    <Skeleton  animation="wave" variant="rectangular" height={500}/>
                </div>
                <div>
                    <div className="mt-5 flex justify-center items-center">
                        <button
                            type="submit"
                            disabled={true}
                            className={'bg-opacity-50 cursor-not-allowed bg-gray-500 mt-10 flex w-64 items-center justify-center rounded-2xl border border-transparent px-8 py-3 text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'} 
                        >
                            ชำระเงิน
                        </button>
                        <a href="/" className="cursor-pointer mt-10 ml-10 p-0">
                            ยกเลิก
                        </a>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default PaymentSkeleton;