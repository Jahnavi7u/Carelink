import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBotBtn from "../components/ChatBotBtn";

const MainLayout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main>{children}</main>
            <ChatBotBtn />
            <Footer />
        </div>
    );
};

export default MainLayout;
