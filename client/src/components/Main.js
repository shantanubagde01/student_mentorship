import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { Roles } from "../utility";
import bg from "../assets/images/bg-2.png";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import ArrowRight from "../assets/icons/ArrowRight";

const Main = () => {
    const user = JSON.parse(localStorage.getItem("authData"));
    const history = useHistory();
    const [value, setValue] = useState("Admin");

    // Automatic Redirect Logic
    if (user?.role === Roles.ADMIN) history.push("/admin/dashboard");
    if (user?.role === Roles.MENTOR) history.push("/mentor/dashboard");
    if (user?.role === Roles.STUDENT) history.push("/mentee/dashboard");

    const handleChange = (e) => setValue(e.target.value);

    return (
        <div 
            className="w-full h-screen flex items-center justify-center relative overflow-hidden"
            style={{ 
                backgroundImage: `url(${bg})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
            }}
        >
            {/* Soft Overlay to improve readability without hiding the background image */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>

            {/* Main Centered Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-5xl">
                
                {/* Hero Header */}
                <div className="mb-12">
                    <h1 className="text-gray-900 font-black tracking-tighter leading-none mb-4" style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
                        Welcome To <br />
                        <span className="text-blue-600">Student Mentoring System</span>
                    </h1>
                    <p className="text-gray-700 text-lg md:text-2xl font-medium max-w-2xl mx-auto">
                        Empowering students through global mentorship and expert guidance.
                    </p>
                </div>

                {/* Highly Visible Selection Card */}
                <div className="bg-white p-10 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-xl border border-gray-100">
                    <h2 className="text-gray-800 text-2xl md:text-3xl font-bold mb-8">Select Your Role to Begin</h2>
                    
                    <div className="flex justify-center mb-10">
                        <FormControl component="fieldset">
                            <RadioGroup 
                                row 
                                value={value} 
                                onChange={handleChange} 
                                className="gap-x-4 md:gap-x-8"
                            >
                                <FormControlLabel 
                                    value="Admin" 
                                    control={<Radio color="primary" sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />} 
                                    label={<span className="text-gray-800 text-lg font-bold">Admin</span>} 
                                />
                                <FormControlLabel 
                                    value="Mentor" 
                                    control={<Radio color="primary" sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />} 
                                    label={<span className="text-gray-800 text-lg font-bold">Mentor</span>} 
                                />
                                <FormControlLabel 
                                    value="Mentee" 
                                    control={<Radio color="primary" sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />} 
                                    label={<span className="text-gray-800 text-lg font-bold">Mentee</span>} 
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>

                    <Link 
                        to={{ pathname: `/${value.toLowerCase()}`, state: value }}
                        className="bg-blue-600 text-white py-4 px-12 rounded-full flex items-center justify-center gap-3 text-xl font-black hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl mx-auto"
                        style={{ width: 'fit-content' }}
                    >
                        Get Started
                        <ArrowRight myStyle="h-6 w-6" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Main;