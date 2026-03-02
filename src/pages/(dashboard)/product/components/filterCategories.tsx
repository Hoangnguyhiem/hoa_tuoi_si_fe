import instance from '@/configs/axios';
import { useQuery } from '@tanstack/react-query';

const FilterCategories = () => {

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            return await instance.get(`category`)
        }
    })

    return (
        <div className="">
            <div className="flex flex-wrap gap-2">
                {categories?.data.map((item: any) => (
                    <div className="relative bg-slate-200 rounded-[5px] p-[2px_10px]">
                        <span className="font-[600]">{item.name}</span>
                        <div className="absolute right-0 top-[-5px] text-[8px] text-white text-center content-center font-[800] bg-red-500 px-[2px] rounded-[2px]">10</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FilterCategories;
