import deliverySevices from "@/services/deliverySevices"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"

export const deliveryMutations = () => {
    
    const queryClient = useQueryClient()

    const deliveryAdd = useMutation({
        mutationFn: async (data) => {
            try {
                return deliverySevices.addDelivery(data)
            } catch (error) {
                throw new Error(`Thao tác thất bại`)
            }
        },
        onSuccess: () => {
            message.open({
                type: "success",
                content: "Thêm nhà xe thành công"
            }),
            queryClient.invalidateQueries({
                queryKey: ["delivery"]
            })
        },
        onError: (error) => {
            message.open({
                type: "error",
                content: error.message
            })
        }
    })


    return { deliveryAdd }
}