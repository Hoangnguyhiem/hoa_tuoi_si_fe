import deliverySevices from '@/services/deliverySevices';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const DeliveryPage = () => {

    const { data: delivery } = useQuery({
        queryKey: ["delivery"],
        queryFn: async () => {
            return await deliverySevices.listDelivery()
        }
    })
    return (
        <div className="overflow-x-auto rounded-[10px] border border-gray-200 px-[10px]">
            <Link to={`/order`} className="">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </Link>
            <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                    <tr className='*:p-[10px]'>
                        <th className="text-left">STT</th>
                        <th className="text-left">Tên</th>
                        <th className="text-left">Số</th>
                        <th className="text-left">Tỉnh/Thành</th>
                        <th className="text-left">Địa chỉ</th>
                        <th className="text-left">Loại xe</th>
                        <th className="text-center">Ghi chú</th>
                        <th className="text-center">Trạng thái</th>
                        <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {delivery?.map((item: any, i: number) => (
                        <tr className="border-t hover:bg-gray-50 *:p-[5px]">
                            <td>{i + 1}</td>
                            <td>
                                {item.name}
                            </td>
                            <td>
                                {item.phone}
                            </td>
                            <td>
                                {item.province}
                            </td>
                            <td>
                                {item.address}
                            </td>
                            <td>
                                {item.type}
                            </td>
                            <td>
                                <div className="flex justify-center items-center cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                </div>
                            </td>
                            <td className="p-[12px] flex justify-center items-center">
                                <span className="bg-green-100 text-green-700 px-[10px] py-[3px] rounded-full text-sm">
                                    Hoạt động
                                </span>
                            </td>
                            <td className="p-[12px]">
                                <div className="flex items-center justify-center gap-[10px] *:cursor-pointer">
                                    <div className="">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </div>
                                    <div className="">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DeliveryPage;
