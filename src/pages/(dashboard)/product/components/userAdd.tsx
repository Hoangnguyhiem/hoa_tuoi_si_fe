import { userMutations } from '@/hooks/userMutations';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const UserAdd = ({ phone, setPhone, setOpenAddUser }: any) => {

    const { register, handleSubmit, reset } = useForm<any>()
    const { addUserMutations } = userMutations()

    useEffect(() => {
        reset({
            phone: phone || "",
            name: "",
            address: ""
        })
    }, [phone])

    const onSubmit = async (data: any) => {
        const res = await addUserMutations.mutateAsync(data);
        localStorage.removeItem("userId");
        localStorage.setItem("userId",res._id);
        setPhone("");
        reset();
        setOpenAddUser((prev: any) => !prev)
    }

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="">
                <h2 className="font-[600] mb-[10px] text-[20px]">Thêm khách hàng</h2>
                <div className="">
                    <div className="mb-[5px]">
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Tên khách hàng</label>
                        <input
                            {...register("name", { required: true })}
                            type="text"
                            placeholder="Tên khách hàng"
                            className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                        />
                    </div>
                    <div className="mb-[5px]">
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Số điện thoại</label>
                        <input
                            {...register("phone", { required: true })}
                            type="text"
                            placeholder="Số điện thoại"
                            className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                        />
                    </div>

                    <div className="mb-[5px]">
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Địa chỉ</label>
                        <input
                            {...register("address", { required: true })}
                            type="text"
                            placeholder="Địa chỉ"
                            className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                        />
                    </div>
                </div>
            </div>
            <div className="float-end mt-[10px] flex">
                <div onClick={() => { setOpenAddUser(true); reset(); setPhone("") }} className='bg-slate-500 p-[5px_15px] rounded-[3px] text-white font-[600] cursor-pointer'>Trở lại</div>
                <button type='submit' className='bg-blue-500 p-[5px_15px] rounded-[3px] text-white font-[600] ml-[10px]'>Tạo mới</button>
            </div>

        </form>


    );
}

export default UserAdd;
