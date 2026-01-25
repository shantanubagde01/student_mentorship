import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// Components
import Main from "./components/Main";
import Auth from "./components/auth/Auth";
import MentorDashboard from "./components/dashboard/mentorDashboard/MentorDashboard";
import AIChatbot from "./components/Chat/AIChatbot"; 

// Context, Socket, and Utility
import { SocketContext, socket } from "./socket/socket";
import { Roles } from "./utility"; // 1. Ensure Roles is imported

const App = () => {
    // 2. Retrieve the user data to check the role
    const authData = localStorage.getItem("authData");
    const user = authData ? JSON.parse(authData) : null;

    return (
        <React.StrictMode>
            <BrowserRouter>
                <Switch>
                    {/* Public Landing Pages */}
                    <Route path="/" exact component={Main} />
                    <Route path="/admin" exact component={Auth} />
                    <Route path="/mentor" exact component={Auth} />
                    <Route path="/mentee" exact component={Auth} />

                    {/* Private Dashboard Area */}
                    <SocketContext.Provider value={socket}>
                        <Route path="/admin/dashboard" exact component={MentorDashboard} />
                        <Route path="/mentor/dashboard" exact component={MentorDashboard} />
                        <Route path="/mentee/dashboard" exact component={MentorDashboard} />
                        
                        {/* 3. ONLY render chatbot for Students */}
                        {user?.role === Roles.STUDENT && <AIChatbot />}
                        
                    </SocketContext.Provider>
                </Switch>
            </BrowserRouter>
        </React.StrictMode>
    );
};

export default App;