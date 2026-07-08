import instance from "@/configs/axios"

const categoriesSevices = {
    addCategories: async (data: any) => {
        const res = await instance.post(`/category_add`, data)
        return res.data
    },

    listAllCategories: async () => {
        const res = await instance.get(`/category`)
        return res.data
    },

    deleteCtegories: async (id: any) => {

        console.log(id);
        
        const res = await instance.delete(`/category_delete/${id}`)
        return res.data
    }
}

export default categoriesSevices