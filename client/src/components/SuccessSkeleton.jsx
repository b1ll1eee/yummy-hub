import { Box, Skeleton } from "@mui/material";

function SuccessSkeleton() {

    function Media({width, height}) {
        return (
          <div>
            <Box sx={{ width: width, height: height }}>
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg xl:aspect-h-8 xl:aspect-w-7 mt-4">
                <Skeleton animation="wave" variant="rectangular" width={width} height={height} />
              </div>
            </Box>
          </div>
        );
    }

    return ( 
        <>
            <div className="border shadow mx-auto max-w-7xl mb-10 rounded-md px-48 py-12">
                <div className="w-full rounded-lg overflow-hidden">
                    <Skeleton animation="wave" variant="rectangular" height={20}/>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto border shadow px-10 py-5 rounded-md mb-10">
                <div className="flex flex-col items-center">
                    <Skeleton animation="wave" variant="circular" width={75} height={75} />
                    <Media width={200} height={20}/>
                    <Media width={300} height={20}/>
                    <Media width={150} height={20}/>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border shadow px-10 py-5 rounded-md">
                <div className="px-6 pb-16 pt-10">
                    <div>
                        <h1 className="border-l-8 mb-2 border-green-700 pl-3 text-2xl font-bold"><Media width={300} height={30}/></h1>
                    </div>

                    <div className="mt-10 w-full rounded-lg overflow-hidden">
                        <Skeleton  animation="wave" variant="rectangular" height={500}/>
                    </div>    

                    <div>
                        <div className="mt-5 flex justify-center items-center">
                        <button
                            type="submit"
                            className='bg-opacity-100 cursor-pointer bg-green-600 hover:bg-green-700 mt-10 flex w-64 items-center justify-center rounded-2xl border border-transparent px-8 py-3 text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                        >
                            ตกลง
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
     );
}

export default SuccessSkeleton;