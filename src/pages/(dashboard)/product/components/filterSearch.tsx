
const FilterSearch = () => {
    return (
        <div className="mt-[10px] content-center lg:w-[400px] lg:mt-0">
            <div className="relative">
                <input type="type" className="w-full rounded-[50px] p-[5px_15px]" placeholder="Tìm kiếm đơn hàng bằng số điện thoại" />
                <div className="absolute right-0 top-0 flex h-[100%]">
                    <div className=" flex justify-center items-center w-[50px] bg-slate-300 m-[2px] rounded-[50px]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FilterSearch;
