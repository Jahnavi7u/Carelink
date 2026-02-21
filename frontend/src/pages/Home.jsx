import React from "react";
import { useUser } from "../contexts/UserContext";
import User from "./user/User";
import Doctor from "./doctor/Doctor";

const Home = () => {
    const { user, loading } = useUser();

    if (loading) {
        return <div>Loading...</div>; // Prevent rendering while fetching user data
    }

    if (!user) {
        return <div>Error: User not found. Please log in again.</div>; // Handle case where user is null
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 py-3">
            {user.role === "User" ? <User /> : <Doctor />}
        </div>
    );
};

export default Home;
