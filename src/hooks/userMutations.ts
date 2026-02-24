import userServices from "@/services/userServices"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"

export const userMutations = () => {
    const queryClient = useQueryClient()

    const addUserMutations = useMutation({
        mutationFn: async (data: any) => {
            try {
                return await userServices.addUser(data)
            } catch (error) {
                throw new Error('Thêm người dùng không thành công.')
            }
        },
        onSuccess: () => {
            message.open({
                type: "success",
                content: "Thêm người dùng thành công"
            }),
            queryClient.invalidateQueries({
                queryKey: ["user"]
            })
        },
        onError: (error) => {
            message.open({
                type: "error",
                content: error.message,
            })
        },
    });

    return { addUserMutations }
}