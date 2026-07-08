import { categoriesMutations } from '@/hooks/categoriesMutations';
import colorSevices from '@/services/colorSevices';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const ColorPage = () => {

    const { categoriesDelete } = categoriesMutations()

    const { data: color } = useQuery({
        queryKey: ["color"],
        queryFn: async () => {
            return await colorSevices.listAllColor()
        }
    })

    const handleDeleteColor = (id: any) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc muốn xóa danh mục này không?"
        );

        if (!confirmDelete) return;
        categoriesDelete.mutate(id)
    }
    return (
        <div className="mx-[10px]">
            <Link to={`/order`} className="">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </Link>
            <div className="border-slate-200 border-[1px]">
                <div className="fixed mx-[10px] left-0 right-0 bg-slate-200 px-[10px]">
                    <div className="flex justify-between items-center h-[60px] font-[700]">
                        <div className="">Danh Sách Danh Mục</div>
                        <Link to={`/color/add`} className='bg-blue-500 p-[5px_15px] text-white rounded-sm'>Thêm</Link>
                    </div>
                </div>
                <div className="h-[60px]"></div>
                <div className="">
                    {color?.map((item: any) => (
                        <div key={item._id} className={`hover:bg-slate-50`}>
                            <div className="flex justify-between p-[5px_10px] items-center">
                                <div className="">{item.name}</div>
                                <div onClick={() => handleDeleteColor(item._id)} className="cursor-pointer flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </div>
                            </div>
                            <hr />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ColorPage;
