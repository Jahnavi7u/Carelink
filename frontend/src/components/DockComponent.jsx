import React, { useEffect, useState } from "react";
import Dock from "./Dock";
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { ClipboardList, Stethoscope, Calendar } from "lucide-react";

const DockComponent = () => {
    const navigate = useNavigate();
    const { user, loading } = useUser();
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (user) {
            setRole(user.role);
        } else {
            setRole(null); // Ensure role is cleared on logout
        }
    }, [user]);

    if (loading) return null; // Prevent rendering while loading

    const userItems = [
        { icon: <VscHome size={18} className="text-white" />, label: "Home", onClick: () => navigate("/home") },
        { icon: <ClipboardList size={18} className="text-white" />, label: "Medical Records", onClick: () => navigate("/medical-records") },
        { icon: <Stethoscope size={18} className="text-white" />, label: "Doctors List", onClick: () => navigate("/doctorlist") },
        { icon: <Calendar size={18} className="text-white" />, label: "Appointments", onClick: () => navigate("/appointment-user") },
    ];

    const doctorItems = [
        { icon: <VscHome size={18} className="text-white" />, label: "Home", onClick: () => navigate("/home") },
        { icon: <Calendar size={18} className="text-white" />, label: "Appointments", onClick: () => navigate("/appointment-doc") },
    ];

    return (
        <div className="fixed bottom-0 w-full text-white z-10">
            <Dock items={role === "Doctor" ? doctorItems : userItems} panelHeight={68} baseItemSize={50} magnification={70} />
        </div>
    );
};

export default DockComponent;
