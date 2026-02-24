import { useRef } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { toPng } from "html-to-image";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/axios";
import dayjs from "dayjs";

const ProductPage = () => {

	const refs = useRef<Record<string, HTMLDivElement | null>>({});

	// download ảnh
	const handleDownload = async (id: string) => {
		const el = refs.current[id];
		if (!el) return;

		const dataUrl = await toPng(el, {
			cacheBust: true,
			pixelRatio: 2,
			backgroundColor: "#ffffff"
		});

		const link = document.createElement("a");
		link.download = `don-hang-${id}.png`;
		link.href = dataUrl;
		link.click();
	};

	// copy ảnh
	const handleCopy = async (id: string) => {
		const el = refs.current[id];
		if (!el) return;

		const dataUrl = await toPng(el, {
			cacheBust: true,
			pixelRatio: 2,
			backgroundColor: "#ffffff"
		});

		const blob = await (await fetch(dataUrl)).blob();

		await navigator.clipboard.write([
			new ClipboardItem({ "image/png": blob })
		]);

		alert("Đã copy ảnh!");
	};

	const { data: order } = useQuery({
		queryKey: ["order"],
		queryFn: async () => {
			return await instance.get(`order`)
		}
	})

	console.log(order);
	

	return (
		<div className="bg-slate-100 h-screen">
			<div className="p-[10px] grid-cols-1 gap-2 grid lg:grid-cols-2 lg:gap-3">
				{order?.data.map((item: any) => {
					const hasUndelivered = item.products.every(
						(p: any) => p.status === true);
					return (
						<div key={item._id} className="bg-white rounded-[5px] shadow-md">
							{/* phần muốn chụp */}
							<div ref={(el) => (refs.current[item._id] = el)}>
								<div className={`p-[10px_10px_0px_10px] border-r-[5px] ${hasUndelivered && item?.paid === 0 ? "border-green-500" : "border-red-500 "} rounded-t-[5px]`}>
									<div className="flex justify-between overflow-hidden">
										<div className="w-[100%] border-slate-300">
											<div className="mb-[10px]">
												<div className="flex justify-between">
													<div className="font-[600] text-[17px] flex mb-[5px]">
														<span className="mr-[10px]">{item?.userId?.name}</span>
														<div className="pl-[10px] flex border-l-[1px] border-slate-300">
															<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
																<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
															</svg>
															<span>{item?.userId?.phone}</span>
														</div>
													</div>
													<div className="font-[600]">{dayjs(item?.createdAt).format("DD/MM/YYYY HH:mm")}</div>
												</div>
												<div>
													<span className="font-[500]">Địa chỉ: </span>
													<span>{item?.userId?.address}</span>
												</div>
												<div>
													<span className="font-[500]">Số nhà xe:</span>
													<span> {item?.deliveryId?.phone + " (" + item?.deliveryId.name + " - " + item?.deliveryId?.type + ") "}</span>
												</div>
												<div>
													<span className="font-[500]">Nợi nhận: </span>
													<span>{item?.deliveryId.province + " - " + item?.deliveryId.address}</span>
												</div>
												<div className="">
													<span className="font-[500]">Ghi chú: </span>
													{item.note === "" ? (
														<span>Không có ghi chú</span>
													) : (
														<span>{item.note}</span>
													)}
												</div>
											</div>
											<hr className="mb-[10px]" />
											<div className="mb-[10px] bg-slate-100 rounded-[3px] p-[5px]">
												<div className="flex justify-between">
													<div className="w-[calc(100%-30px)]">
														<table className="w-full">
															<tr className="text-left">
																<th>Đơn</th>
																<th>Màu</th>
																<th>Giá</th>
																<th>Số lượng</th>
																<th>Tổng</th>
																<th className="text-center">Đã giao</th>
															</tr>
															{
																item.products.map((item: any) => (
																	<tr className={`${!item.status ? "bg-red-200" : "bg-green-200"} border-b-[1px] font-[500]`}>
																		<td>{item?.categoryId.name}</td>
																		<td>{item?.colorId.name}</td>
																		<td>x{Number(item?.price).toLocaleString("vi-VN") || 0}</td>
																		<td>{item?.quantity}</td>
																		<td>{Number(item?.total).toLocaleString("vi-VN") || 0}</td>
																		<div className="h-[26px] flex justify-center items-center">
																			<input className="" type="checkbox" />
																		</div>
																	</tr>
																))
															}

														</table>
													</div>
													<div className="w-[30px] flex items-center border-l-[1px] justify-center">
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
															<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
														</svg>
													</div>
												</div>

											</div>
											<div className="w-full flex mb-[10px] justify-between">
												<div className="flex justify-between w-[200px]">
													<div className="font-[600]">
														<p>Tổng cộng: </p>
														<p>Đã thanh toán: </p>
														{item.paid >= 0 ?
															(<p>Cần thanh toán: </p>) :
															(<p>Trả lại: </p>)
														}
													</div>
													<div className="font-[700] text-right">
														<p>{Number(item?.totalPrice).toLocaleString("vi-VN") || 0}</p>
														<p>{Number(item?.pay).toLocaleString("vi-VN") || 0}</p>
														{item?.paid > 0 ? (
															<p className="text-red-700">{Number(item?.paid).toLocaleString("vi-VN") || 0}</p>
														) : (
															<p>{Number(item?.paid).toLocaleString("vi-VN") || 0}</p>
														)}
													</div>
												</div>
												<div className="flex items-end">
													<button className="bg-slate-300 font-[600] p-[5px_15px] rounded-[5px]">Chỉnh sửa</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<hr />
							<div className="flex justify-center">
								<div className="flex m-[8px]">
									<div onClick={() => handleDownload(item._id)} className="flex mr-[100px] cursor-pointer">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
											<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
										</svg>
										<button>
											Tải ảnh
										</button>
									</div>
									<div onClick={() => handleCopy(item._id)} className="flex cursor-pointer">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
											<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
										</svg>
										<button>
											Copy ảnh
										</button>
									</div>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	);
}

export default ProductPage
