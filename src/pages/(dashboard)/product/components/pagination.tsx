
const Pagination = ({totalPage, currentPage, setCurrentPage}: any) => {
    
    const renderPages = () => {

        
        const pages = [];

        for (let page = 1; page <= totalPage; page++) {

            // hiện:
            // trang đầu
            // trang cuối
            // currentPage - 1
            // currentPage
            // currentPage + 1

            if (
                page === 1 ||
                page === totalPage ||
                (page >= currentPage - 1 &&
                    page <= currentPage + 1)
            ) {

                pages.push(
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`
							min-w-[40px] h-[40px]
							border rounded-md
							${currentPage === page
                                ? "bg-black text-white"
                                : "bg-white"}
						`}
                    >
                        {page}
                    </button>
                );

            }

            // dấu ...

            else if (
                page === currentPage - 2 ||
                page === currentPage + 2
            ) {

                pages.push(
                    <span key={page}>
                        ...
                    </span>
                );

            }

        }

        return pages;
    };

    return (

        <div className="flex items-center gap-[8px] mt-[50px] justify-center">

            {/* prev */}
            <button
                disabled={currentPage === 1}
                onClick={() =>
                    setCurrentPage((prev: any) => prev - 1)
                }
                className="min-w-[40px] h-[40px] border rounded-md"
            >
                &lt;
            </button>

            {/* pages */}
            {renderPages()}

            {/* next */}
            <button
                disabled={currentPage === totalPage}
                onClick={() =>
                    setCurrentPage((prev: any) => prev + 1)
                }
                className="min-w-[40px] h-[40px] border rounded-md"
            >
                &gt;
            </button>

        </div>

    );
}

export default Pagination;
