import categoriesSevices from "@/services/categoriesSevices"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"

export const categoriesMutations = () => {

    const queryClient = useQueryClient()

    const categoriesAdd = useMutation({
        mutationFn: async (data) => {
            try {
                return await categoriesSevices.addCategories(data)
            } catch (error) {
                throw new Error("Thao tác thất bại!")
            }
        },
        onSuccess: () => {
            message.open({
                type: "success",
                content: "Thêm danh mục thành công"
            });
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            })
        },
        onError: (error) => {
            message.open({
                type: "error",
                content: error.message
            })
        }
    });

    const categoriesDelete = useMutation({
        mutationFn: async (id) => {
            try {
                return await categoriesSevices.deleteCtegories(id)
            } catch (error) {
                throw new Error("Thao tác thất bại!")
            }
        },
        onSuccess: () => {
            message.open({
                type: "success",
                content: "Xóa danh mục thành công"
            });
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            })
        },
        onError: (error) => {
            message.open({
                type: "error",
                content: error.message
            })
        }
    })

    return { categoriesAdd, categoriesDelete }
}