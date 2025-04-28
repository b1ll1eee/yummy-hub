function Status({ status }) {

    const showStatus = [
        {
            id:1,
            name:'Cart'
        },
        {
            id:2,
            name:'Payment'
        },
        {
            id:3,
            name:'Success'
        }
    ];

    return ( 
        <div className="mx-auto max-w-4xl px-4 py-10">
            <ol className="border-neutral-400 flex justify-around border-t-4">
                {showStatus.map((item) => (
                    <li key={item.id}>
                    <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                        {
                        status === item.id ? <div className="h-[15px] w-[15px] rounded-full bg-red-500 md:-mt-[10px]"></div>
                        : <div className="h-[15px] w-[15px] rounded-full bg-neutral-500 md:-mt-[10px]"></div>
                        }
                        <p className="mt-2 text-neutral-500 kanit">
                            {item.name}
                        </p>
                    </div>
                    </li>
                ))}
            </ol>
        </div>
     );
}

export default Status;