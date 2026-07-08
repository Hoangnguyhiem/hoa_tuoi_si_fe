import CategoryAddPage from "@/pages/(dashboard)/categories/add/page";
import CategoryEditPage from "@/pages/(dashboard)/categories/edit/page";
import CategoryPage from "@/pages/(dashboard)/categories/page";
import ColorAddPage from "@/pages/(dashboard)/colers/add/page";
import ColorPage from "@/pages/(dashboard)/colers/page";
import DeliveryAddPage from "@/pages/(dashboard)/delivery/add/page";
import DeliveryPage from "@/pages/(dashboard)/delivery/page";
import ProductAddPage from "@/pages/(dashboard)/product/add/page";
import ProductEditPage from "@/pages/(dashboard)/product/edit/page";
import ProductPage from "@/pages/(dashboard)/product/page";
import { Route, Routes } from "react-router-dom";


const Router = () => {

    return (
        <>
            <Routes>
                <Route path="/order">
                    <Route index element={<ProductPage />} />
                    <Route path="add" element={<ProductAddPage />} />
                    <Route path="edit/:id" element={<ProductEditPage />} />
                </Route>
                <Route path="/categories">
                    <Route index element={<CategoryPage />} />
                    <Route path="add" element={<CategoryAddPage />}/>
                    <Route path="edit/:id" element={<CategoryEditPage />}/>
                </Route>
                <Route path="/delivery">
                    <Route index element={<DeliveryPage />} />
                    <Route path="add" element={<DeliveryAddPage />}/>
                    <Route path="edit/:id" element={<CategoryEditPage />}/>
                </Route>
                <Route path="/color">
                    <Route index element={<ColorPage />} />
                    <Route path="add" element={<ColorAddPage/>}/>
                    <Route path="edit/:id" element={<CategoryEditPage />}/>
                </Route>
            </Routes>
        </>
    );
};

export default Router;
