function NoPage() {
    return (   
      <>
      <div>
        <main className="grid min-h-full place-items-center bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center"> 
            <div className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="4 4 40 40" className="w-20">
                  <path className="fill-slate-200" d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" fill="#000000"/>
              </svg>
            </div>
            <h1 className="mt-6 text-2xl">This page could not be found</h1>
            <div className="mt-2 flex items-center justify-center gap-x-6">
              <a href="/" className="text-base text-gray-600">Back to the home page</a>
            </div>
          </div>
        </main>
      </div>
      </>      
     );
}

export default NoPage;