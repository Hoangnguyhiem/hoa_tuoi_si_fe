
const FilterSearch = ({ keyword, setKeyword }: any) => {

    const handleSearch = (e: any) => {
        setKeyword(e.target.value);
    };
    return (
        <div className="lg:w-[400px] lg:mt-0">
            <div className="relative">
                <input value={keyword} onChange={handleSearch} type="type" className="w-full rounded-[50px] p-[5px_15px]" placeholder="Tìm kiếm đơn hàng bằng số điện thoại" />
            </div>
        </div>
    );
}

export default FilterSearch;
