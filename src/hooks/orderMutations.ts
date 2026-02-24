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
    })

    return { orderAdd }
}