import orderSevices from "@/services/orderSevices"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"

export const orderMutations = () => {

    const queryClient = useQueryClient()

    const orderAdd = useMutation({
        mutationFn: async (data: any) => {
            try {
                return await orderSevices.addOrder(data)
            } catch (error) {
                throw new Error("Thêm sản phẩm không thành công")
            }
        },
        onSuccess: () => {
            message.open({
                type: "success",
                content: "Thêm sản phẩm thành công"
            }),
                queryClient.invalidateQueries({
                    queryKey: ["order"]
                })
        },
        onError: (error) => {
            message.open({
                type: "error",
                content: error.message
            })
        }
    });

    const upadateOrderById = useMutation({
        mutationFn: async (data: any) => {
            try {
                return await orderSevices.updateOrderById(data)
            } catch (error) {
                throw new Error("Cập nhập thất bại")
            }
        },
        onSuccess: () => {
            message.open({
                type: "success",
                content: "Cập nhập đơn hàng thành công"
            });
            queryClient.invalidateQueries({
                queryKey: ["order"]
            })
        },
        onError: (error) => {
            message.open({
                type: "error",
                content: error.message
            })
        }
    })

    const updateStatusProduct = useMutation({
        mutationFn: async (data: any) => {
            try {
                return await orderSevices.updateStatusProduct(data)
            } catch (error) {
                throw new Error("Đã xảy ra lỗi vui lòng thử lại")
            }
        },
        onSuccess: () => {
            message.open({
                type: "success",
                content: "Cập nhập trạng thái thành công"
            }),
                queryClient.invalidateQueries({
                    queryKey: ["order"]
                })
        },
        onError: (error) => {
            message.open({
                type: "error",
                content: error.message
            })
        }

    })

    const updatePinOrder = useMutation({
        mutationFn: async (data: any) => {
            try {
                return await orderSevices.updatePinById(data)
            } catch (error) {
                throw new Error("Đã xảy ra lỗi vui lòng thử lại")
            }
        },
        onSuccess: () => {
            message.open({
                type: "success",
                content: "Cập nhập trạng thái thành công"
            }),
                queryClient.invalidateQueries({
                    queryKey: ["order"]
                })
        },
        onError: (error) => {
            message.open({
                type: "error",
                content: error.message
            })
        }

    })

    const deleteOrderById = useMutation({
        mutationFn: async (id: any) => {
            try {
                return await orderSevices.deleteOrderbyId(id)
            } catch (error) {
                throw new Error("Đã xảy ra lỗi vui lòng thử lại")
            }
        },
        onSuccess: () => {
            message.open({
                type: "success",
                content: "Đã xóa đơn hàng"
            }),
                queryClient.invalidateQueries({
                    queryKey: ["order"]
                })
        },
        onError: (error) => {
            message.open({
                type: "error",
                content: error.message
            })
        }

    })
    
    return { orderAdd, upadateOrderById, deleteOrderById, updateStatusProduct, updatePinOrder }
}