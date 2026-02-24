import ProductAddPage from "@/pages/(dashboard)/product/add/page";
import ProductPage from "@/pages/(dashboard)/product/page";
import { Route, Routes } from "react-router-dom";


const Router = () => {

    return (
        <>
            <Routes>
                <Route path="/">
                    <Route index element={<ProductPage />} />
                    <Route path="/add" element={<ProductAddPage />} />
                </Route>
            </Routes>
        </>
    );
};

export default Router;
