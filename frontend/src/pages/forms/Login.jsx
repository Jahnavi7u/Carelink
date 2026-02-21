import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UserContext";
import { EyeOff, Eye } from 'lucide-react';

const Login = () => {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [loadingOtp, setLoadingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const navigate = useNavigate();
    const { setUser } = useUser();

    useEffect(() => {
        const tkn = localStorage.getItem('userToken');
        if (tkn) {
            navigate('/home');
        }
    }, [navigate]);

    const handleLogin = async (data) => {
        try {
            const response = await axios.post("http://localhost:8080/v1/login", {
                email: data.email,
                password: data.password
            });

            if (response.data.success) {
                const curToken = response.data.token;

                localStorage.setItem('userToken', curToken);
                setUser(response.data.user);

                navigate('/home', { replace: true });
            }
        } catch (error) {
            console.error("Login error: ", error.response?.data || error.message);
            setIsError(true);
            setError("Invalid Credentials!");
        }
    };

    const handleSendOtp = async () => {
        const email = getValues("email");
        if (!email) {
            setError("Please enter your email first.");
            setIsError(true);
            return;
        }

        setLoadingOtp(true);
        try {
            const response = await axios.post("http://localhost:8080/v1/get-otp", { email });

            if (response.data.success) {
                setOtpSent(true);
                setIsError(false);
                setError("");
            } else {
                setIsError(true);
                setError(response.data.message || "Failed to send OTP.");
            }
        } catch (error) {
            console.error("Send OTP error:", error.response?.data || error.message);
            setIsError(true);
            setError("Error sending OTP.");
        } finally {
            setLoadingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        const email = getValues("email");
        const otp = getValues("otp");

        if (!email || !otp) {
            setError("Email and OTP are required.");
            setIsError(true);
            return;
        }

        setVerifyingOtp(true);
        try {
            console.log("Verifying OTP for email:", email, "with OTP:", otp);
            const response = await axios.post("http://localhost:8080/v1/verify-otp", { email, otp });
            console.log("OTP verification response:", response.data);

            if (response.data.success) {
                setIsVerified(true);
                setIsError(false);
                setError("");
            } else {
                setIsError(true);
                setError(response.data.message || "OTP verification failed.");
            }
        } catch (error) {
            console.error("Verify OTP error:", error.response?.data || error.message);
            setIsError(true);
            setError("Error verifying OTP.");
        } finally {
            setVerifyingOtp(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg flex w-full max-w-5xl p-5">
                {/* Left Section */}
                <div className="hidden md:flex w-1/2 justify-center items-center">
                    <img src="/illustrations/medicine.svg" alt="Medicine Illustration" className="w-full h-auto" />
                </div>

                {/* Right Section */}
                <div className="w-full md:w-1/2 p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back!</h2>
                    <form className="space-y-4" onSubmit={handleSubmit(handleLogin)} onChange={() => { setIsError(false) }}>
                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                placeholder="Enter your email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                {...register("password", { required: "Password is required" })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Eye /> : <EyeOff />}
                            </button>
                        </div>

                        {/* OTP Field */}
                        <div className='flex flex-col items-center justify-center mb-5'>
                            <div className='flex justify-center items-center space-x-3 w-full'>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    {...register("otp")}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={verifyingOtp}
                                    className="btn-primary"
                                >
                                    {isVerified ? "Verified" : verifyingOtp ? "Verifying..." : "Verify OTP"}
                                </button>
                            </div>

                            {!otpSent && (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    className="text-blue-600 mt-2"
                                    disabled={loadingOtp}
                                >
                                    {loadingOtp ? "Sending..." : "Send OTP"}
                                </button>
                            )}
                        </div>

                        {/* Error message */}
                        {isError && (
                            <div className="text-red-500 text-sm mt-2">{error}</div>
                        )}

                        {/* Submit button */}
                        <button
                            className="btn-primary w-full"
                            type="submit"
                            disabled={!isVerified}
                        >
                            Log in
                        </button>
                    </form>

                    <p className="text-center mt-4">Don't have an account? <Link to="/register" className="text-blue-600">Sign Up</Link></p>

                    <div className="flex justify-center items-center space-x-3 mt-4">
                        <button className="bg-blue-600 text-white p-2 rounded-full">F</button>
                        <button className="bg-blue-400 text-white p-2 rounded-full">T</button>
                        <button className="bg-red-500 text-white p-2 rounded-full">G</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
