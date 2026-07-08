import { categoriesMutations } from "@/hooks/categoriesMutations";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const CategoryAddPage = () => {
    const { categoriesAdd } = categoriesMutations()
    const navigater = useNavigate()
    const { register, handleSubmit } = useForm()
    const onSubmit = (data: any) => {
        categoriesAdd.mutate(data)
        navigater(`/categories`)
    }
    return (
        <div className="p-[10px] w-[100%]">
            <div className="">
                <form className="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="">
                        <h2 className="font-[600] mb-[10px] text-[20px]">Thêm danh mục hoa</h2>
                        <div className="">
                            <div className="relative">
                                <div className="mb-[5px]">
                                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Tên</label>
                                    <input
                                    {...register("name", {required: true})}
                                        type="text"
                                        placeholder="Nhập tên hoa"
                                        className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="bg-blue-500 p-[5px_15px] rounded-[3px] text-white font-[600] cursor-pointer float-end">Thêm</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CategoryAddPage;
