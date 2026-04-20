import React, { useEffect, useState } from "react";
import Dock from "./Dock";
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { ClipboardList, Stethoscope, Calendar, HeartPulse, Settings, Video } from "lucide-react";

const DockComponent = () => {
    const navigate = useNavigate();
    const { user, loading } = useUser();
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (user) {
            setRole(user.role);
        } else {
            setRole(null);
        }
    }, [user]);

    if (loading) return null;

    const userItems = [
        { icon: <VscHome size={18} className="text-white" />, label: "Home", onClick: () => navigate("/home") },
        { icon: <HeartPulse size={18} className="text-white" />, label: "Symptom Checker", onClick: () => navigate("/symptom-checker") },
        { icon: <Stethoscope size={18} className="text-white" />, label: "Doctors List", onClick: () => navigate("/doctorlist") },
        { icon: <Calendar size={18} className="text-white" />, label: "Appointments", onClick: () => navigate("/appointment-user") },
        { icon: <Video size={18} className="text-white" />, label: "Video Call", onClick: () => navigate("/video-call") },
        { icon: <ClipboardList size={18} className="text-white" />, label: "Medical Records", onClick: () => navigate("/medical-records") },
        { icon: <Settings size={18} className="text-white" />, label: "Edit Profile", onClick: () => navigate("/edit-profile") },
    ];

    const doctorItems = [
        { icon: <VscHome size={18} className="text-white" />, label: "Home", onClick: () => navigate("/home") },
        { icon: <Calendar size={18} className="text-white" />, label: "Appointments", onClick: () => navigate("/appointment-doc") },
        { icon: <Video size={18} className="text-white" />, label: "Video Call", onClick: () => navigate("/video-call") },
        { icon: <Settings size={18} className="text-white" />, label: "Edit Profile", onClick: () => navigate("/edit-doctor-profile") },
    ];

    return (
        <div className="fixed bottom-0 w-full text-white z-10">
            <Dock items={role === "Doctor" ? doctorItems : userItems} panelHeight={68} baseItemSize={50} magnification={70} />
        </div>
    );
};

export default DockComponent;
