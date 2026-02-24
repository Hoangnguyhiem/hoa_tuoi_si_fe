import { useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useRef, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import instance from '@/configs/axios';
import UserAdd from '../components/userAdd';
import userServices from '@/services/userServices';
import { orderMutations } from '@/hooks/orderMutations';

const ProductAddPage = () => {
    const [openAddUser, setOpenAddUser] = useState(true);
    const [phone, setPhone] = useState<any>("");
    const [value, setValue] = useState<any>("");
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const [userId, setUserId] = useState<any>(null);
    const savedUserId = localStorage.getItem("userId");

    const { orderAdd } = orderMutations()

    useEffect(() => {
        if (userId)
            localStorage.setItem("userId", userId);
    }, [userId])

    const { data: user } = useQuery({
        queryKey: ["user"],
        queryFn: async () => { return await instance.get(`/user`) },
    })

    const filtered = useMemo(() => {
        return user?.data?.filter((item: any) =>
            item?.phone?.toLowerCase().includes(value.toLowerCase())
        );
    }, [user, value]);

    useEffect(() => { if (savedUserId) setUserId(savedUserId); }, [savedUserId]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                setShow(false);
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    const { data: userById } = useQuery({
        queryKey: ["user_id", userId],
        queryFn: async () => {
            return await userServices.getUserById(userId)
        },
        enabled: !!userId,
    })

    const deleteUser = () => {
        localStorage.removeItem("userId");
        setUserId(null)
    }

    const { data: color } = useQuery({
        queryKey: ["color"],
        queryFn: async () => {
            return await instance.get(`/color`)
        }
    })


    const { data: delivery } = useQuery({
        queryKey: ["delivery"],
        queryFn: async () => {
            return await instance.get(`/delivery`)
        },
    })

    const { data: category } = useQuery({
        queryKey: ["category"],
        queryFn: async () => {
            return await instance.get(`/category`)
        },
    })


    const [products, setProducts] = useState<any>([{ id: Date.now(), categoryId: "", colorId: "", price: 0, quantity: 1 }])

    const handleChage = (id: any, field: string, value: any) => {
        setProducts((prev: any) =>
            prev.map((r: any) =>
                r.id === id ? { ...r, [field]: value } : r
            )
        )
    }

    const addRow = () => {
        setProducts((prev: any) => [
            ...prev,
            {
                id: Date.now(),
                categoryId: "",
                colorId: "",
                price: 0,
                quantity: 1
            },
        ]);
    };

    const removeRow = (id: number) => {
        setProducts((prev: any) => prev.filter((i: any) => i.id !== id));
    };

    const total = products.reduce((sum: any, r: any) => sum + r.price * r.quantity, 0);
    const [mountTotal, setMountTotal] = useState<any>()
    const [number, setNumber] = useState(0);
    const handleMountTotal = (num: number) => {
        setNumber(num);
    };
    useEffect(() => {
        setMountTotal(total - number);
    }, [total, number]);


    const [deliveryId, setDelivery] = useState()
    const [note, setNot] = useState()

    const handleDelivery = (data: any) => {
        setDelivery(data)
    }
    const handleNote = (data: any) => {
        setNot(data);
    }


    const handleAddProduct = () => {
        const payload = products.map((item: any) => {
            const newItem = { ...item };
            delete newItem.id;
            return newItem;
        });
        console.log(userId);
        console.log(deliveryId);
        console.log(note);
        console.log(payload);

        orderAdd.mutate({ userId, deliveryId, note, products: payload, pay: number })
    }

    return (
        <div className="p-[10px] w-[100%] lg:w-[700px] m-auto">
            {!userId &&
                <div className="">

                    <form className="">
                        <div className="">
                            <h2 className="font-[600] mb-[10px] text-[20px]">Tìm khách hàng</h2>
                            <div className="">
                                <div className="relative">
                                    <div ref={ref} className="mb-[5px]">
                                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Số điện thoại</label>
                                        <input
                                            type="text"
                                            value={value}
                                            placeholder="Tìm..."
                                            onChange={(e) => {
                                                setValue(e.target.value);
                                                setShow(true);
                                            }}
                                            className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                                        />

                                        {show && (
                                            <div className="absolute w-full border mt-1 bg-white rounded shadow max-h-40 overflow-auto z-50">

                                                {/* list match */}
                                                {filtered.map((item: any, i: number) => (
                                                    <div
                                                        key={i}
                                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => {
                                                            setUserId(item._id)
                                                            setValue(item.phone);
                                                            setShow(false);
                                                        }}
                                                    >
                                                        {item.phone}   {"(" + item.name + ")"}
                                                    </div>
                                                ))}

                                                {/* nút tạo mới */}
                                                {value && filtered.length === 0 && (
                                                    <div
                                                        className="p-2 text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
                                                        onClick={() => {
                                                            setOpenAddUser(prev => !prev);
                                                            setPhone(value)
                                                            setValue("");
                                                        }}
                                                    >
                                                        ➕ Tạo "{value}"
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className={`${openAddUser ? "hidden" : "fixed lg:flex"} mx-auto w-screen h-screen inset-0 lg:items-center lg:justify-center lg:backdrop-blur-[4px]`}>
                        <div className="absolute w-screen h-screen bg-slate-100 p-[15px] rounded-[10px] lg:translate-x-[-50%] lg:left-[50%] lg:w-[700px] lg:h-min">
                            <UserAdd phone={phone} setPhone={setPhone} setOpenAddUser={setOpenAddUser} />
                        </div>
                    </div>
                </div>
            }

            {userId &&
                <div className="">
                    <form className="">
                        <div className="">
                            <div className="mb-[10px]">
                                <div className="flex justify-between">
                                    <div className="font-[700] flex">
                                        <span className="mr-[10px]">{userById?.name}</span>
                                        <div className="pl-[10px] flex border-l-[1px] border-slate-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                            </svg>
                                            <span>{userById?.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span>Địa chỉ: </span>
                                    <span>{userById?.address}</span>
                                </div>
                            </div>

                            <div className="mb-[5px]">
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Số nhà xe</label>
                                <select onChange={(e) => handleDelivery(e.target.value)} className='w-[100%] border-[1px] p-[9px_10px] rounded-[5px]' name="" id="">
                                    <option value="" selected>Chọn nhà xe</option>
                                    {delivery?.data.map((item: any) => (
                                        <option key={item._id} value={item._id}>{item.name + " (" + item.phone + ")" + " - " + item.type + " - (" + item.address + " - " + item.province + ")"}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="">
                                <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-[2px]">Ghi chú</label>
                                <textarea onChange={e => handleNote(e.target.value)} className="w-full p-[10px] h-[45px] border-[1px] rounded-[5px]" placeholder="Nhập ghi chú..."></textarea>
                            </div>
                        </div>

                        <div className="mt-[15px]">
                            <h2 className='font-[600] text-[18px]'>Đơn hàng</h2>
                            <div className="p-[10px] bg-slate-200 rounded-[5px]">
                                <div className="grid grid-cols-1 gap-2 ">
                                    <div className="p-[10px] bg-slate-100 rounded-[3px]">
                                        <table className="w-full">
                                            <tr className="text-left *:px-[10px]">
                                                <th>Đơn</th>
                                                <th>Màu</th>
                                                <th>Giá</th>
                                                <th>Số lượng</th>
                                                <th>Tổng</th>
                                                <th className="text-center">Thao tác</th>
                                            </tr>
                                            {products.map((item: any) => (
                                                <tr key={item._id} className="*:px-[10px]">
                                                    <td>
                                                        <select onChange={e => handleChage(item.id, "categoryId", e.target.value)} className='py-[9px] rounded-[5px] border-b-gray-400 border-[1px]' name="" id="">
                                                            <option selected value="">Chọn</option>
                                                            {
                                                                category?.data.map((item: any) => (
                                                                    <option value={item._id}>{item.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <select onChange={e => handleChage(item.id, "colorId", e.target.value)} className='py-[9px] rounded-[5px] border-b-gray-400 border-[1px]' name="" id="">
                                                            <option selected value="">Chọn</option>
                                                            {
                                                                color?.data.map((item: any) => (
                                                                    <option key={item._id} value={item._id}>{item?.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input
                                                            onChange={e => handleChage(item.id, "price", e.target.value)}
                                                            type="text"
                                                            placeholder="Nhập giá"
                                                            className="max-w-[100px] border border-gray-300 p-[8px_10px] rounded-md"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            onChange={e => handleChage(item.id, "quantity", e.target.value)}
                                                            defaultValue={1}
                                                            min={1}
                                                            type="number"
                                                            className=" max-w-[70px] border border-gray-300 p-[8px_10px] rounded-md"
                                                        />
                                                    </td>
                                                    <td>{Number(item.price * item.quantity).toLocaleString("vi-VN")}</td>
                                                    <td>
                                                        <div onClick={() => removeRow(item.id)} className="flex justify-center cursor-pointer hover:bg-red-500 hover:text-white font-[600] rounded-[5px] py-[2px]">
                                                            <span>Xóa</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </table>
                                    </div>
                                    <div className="flex justify-between mt-[10px]">
                                        <div className="font-[700] flex justify-between">
                                            <div className="mr-[20px]">
                                                <p>Tổng cộng: </p>
                                                <p>Đã thanh toán: </p>
                                                <p>Cần thanh toán: </p>
                                            </div>
                                            <div className="">
                                                <p>{Number(total).toLocaleString("vi-VN")}</p>
                                                <p>
                                                    <input defaultValue={0} onChange={(e: any) => handleMountTotal(e.target.value)} className='w-[100px]' type="text" />
                                                </p>
                                                <p>{Number(mountTotal || 0).toLocaleString("vi-VN")}</p>
                                            </div>
                                        </div>
                                        <div onClick={addRow} className="">
                                            <div className="border-[1px] border-black rounded-[5px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="float-end mt-[10px] flex">
                            <div onClick={deleteUser} className='bg-slate-500 p-[5px_15px] rounded-[3px] text-white font-[600] cursor-pointer'>Trở lại</div>
                            <div onClick={handleAddProduct} className='bg-blue-500 p-[5px_15px] rounded-[3px] text-white font-[600] ml-[10px] cursor-pointer'>Tạo đơn hàng</div>
                        </div>
                    </form>
                </div>
            }
        </div>

    );
}

export default ProductAddPage