import Header from "@/components/header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";


const AppLayout = ()=>{
    return (
            <div>
                <main className="min-h-screen container">
                    {/* Header */}
                    <Header/>

                    {/* body */}
                    <Outlet/>
                </main>

                {/* Footer */}
                <div className="p-10 text-center bg-gray-800 mt-10">
                    <Footer/>
                </div>
            </div>
    );
};

export default AppLayout;