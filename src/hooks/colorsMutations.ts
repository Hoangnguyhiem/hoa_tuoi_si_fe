import colorSevices from "@/services/colorSevices";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"

export const colorsMutations = () => {

    const queryClient = useQueryClient()

    const colorsAdd = useMutation({
        mutationFn: async (data) => {
            try {
                return await colorSevices.addColor(data)
            } catch (error) {
                throw new Error("Thao tác thất bại!")
            }
        },
        onSuccess: () => {
            message.open({
                type: "success",
                content: "Thêm màu thành công"
            });
            queryClient.invalidateQueries({
                queryKey: ["color"]
            })
        },
        onError: (error) => {
            message.open({
                type: "error",
                content: error.message
            })
        }
    });

    return { colorsAdd }
}