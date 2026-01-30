import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { CSSTransition } from "react-transition-group";
import { ToastContainer } from "react-toastify";

// Actions & Context
import { Roles } from "../../../utility";
import { SocketContext } from "../../../socket/socket";
import { authContext } from "../../../contexts/authContext";
import { mentorGetAllMentees, mentorGetDetails, mentorGetProfile, logoutMentor } from "../../../actions/mentor";
import { studentGetDetails, studentGetProfileDetails, logoutStudent } from "../../../actions/student";
import { adminFetchLogs, adminGetDetails, logoutAdmin } from "../../../actions/admin";
import { getAllChat, logoutChats, addMessages, addNotification, addSingleChat, reorderChats, updateLatestMessage } from "../../../actions/chat";
import { getAllNotifications, logoutNotifications, markNotificationRead, addGlobalNotification } from "../../../actions/notification";
import { getAllPosts, logoutPosts } from "../../../actions/post";
import { getMeetings } from "../../../actions/meeting";

// Components
import Chat from "./dashboardLinks/chat/Chat";
import MenteeInfo from "./dashboardLinks/menteeInfo/MenteeInfo";
import Post from "./dashboardLinks/post/Post";
import Profile from "./dashboardLinks/profile/Profile";
import AcademicDetails from "./dashboardLinks/academicdetails/AcademicDetails";
import ManageGroups from "./dashboardLinks/manageGroups/ManageGroups";
import CreateUsers from "./dashboardLinks/createUsers/CreateUsers";
import Logs from "./dashboardLinks/logs/Logs";
import Home from "./dashboardLinks/home/Home";
import Meetings from "./dashboardLinks/meetings/Meetings";
import AdminInteractions from "./dashboardLinks/adminInteractions/AdminInteractions";
import Notification from "../../notification/Notification";
import NotificationCounter from "../../notification/NotificationCounter";
import NotificationModal from "../../notification/notificationModal/NotificationModal";
import ModalOverlay from "../../modal/ModalOverlay";
import Loading from "../../loading/Loading";
import AIChatbot from "../../Chat/AIChatbot"; 

// Icons & Assets
import ChatAlt2Icon from "../../../assets/icons/ChatAlt2Icon";
import HomeIcon from "../../../assets/icons/HomeIcon";
import AnnotationIcon from "../../../assets/icons/AnnotationIcon";
import AcademicCapIcon from "../../../assets/icons/AcademicCapIcon";
import Code from "../../../assets/icons/Code";
import LogoutIcon from "../../../assets/icons/LogoutIcon";
import UserCircleIcon from "../../../assets/icons/UserCircleIcon";
import DotIcon from "../../../assets/icons/DotIcon";
import BellIcon from "../../../assets/icons/BellIcon";
import DocumentTextIcon from "../../../assets/icons/DocumentTextIcon";
import Plus from "../../../assets/icons/Plus";
import UserGroupIcon from "../../../assets/icons/UserGroupIcon";
import NotifySound from "../../../assets/sounds/light-562.ogg";

const MentorDashboard = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const socket = useContext(SocketContext);

    const authData = JSON.parse(localStorage.getItem("authData"));
    const uid = authData?.uid;
    const role = authData?.role;

    if (!authData) history.push("/");

    const [activeTab, setActiveTab] = useState(role === Roles.ADMIN ? "allInteractions" : "home");
    const [loading, setLoading] = useState(true);
    const [newMsgNotify, setNewMsgNotify] = useState(false);
    const [streamUpdated, setStreamUpdated] = useState(false);
    const [showNotificationDropDown, setShowNotificationDropDown] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const notificationDropDownRef = useRef(null);
    const overlayRef = useRef(null);
    const notificationModalRef = useRef(null);

    const profileData = useSelector((state) => (role === Roles.MENTOR ? state.mentor.profileData : state.student.profileData));
    const adminData = useSelector((state) => state.admin.adminData);

    useEffect(() => {
        const fetchData = async () => {
            const dis = [];
            if (role === Roles.ADMIN) {
                dis.push(dispatch(adminGetDetails(history)), dispatch(adminFetchLogs(history)));
            } else {
                if (role === Roles.MENTOR) {
                    dis.push(dispatch(mentorGetDetails(history)), dispatch(mentorGetProfile(history)), dispatch(mentorGetAllMentees(history)));
                } else if (role === Roles.STUDENT) {
                    dis.push(dispatch(studentGetDetails(history)), dispatch(studentGetProfileDetails(history)));
                }
                dis.push(dispatch(getAllChat(history)), dispatch(getAllNotifications(history)), dispatch(getMeetings(history)));
            }
            try { await Promise.all(dis); } catch (e) { console.log(e); } finally { setLoading(false); }
        };
        fetchData();
        ["persistChat", "selectedChat", "chats", "0", "visible"].forEach(key => localStorage.removeItem(key));
    }, [dispatch, history, role]);

    useEffect(() => {
        socket.emit("setup", uid);
        const handleNewNoti = (data) => {
            if (data.event.type === "POST_CREATED" && JSON.parse(localStorage.getItem("postRoute"))) {
                setStreamUpdated(true);
                dispatch(markNotificationRead(history, [{ id: data._id, willReceive: false }]));
            } else { dispatch(addGlobalNotification(history, data)); }
        };
        socket.on("new Notification", handleNewNoti);
        return () => socket.off("new Notification", handleNewNoti);
    }, [socket, uid, dispatch, history]);

    const handleRouteChange = (e) => {
        const tab = e.currentTarget.id;
        setActiveTab(tab);
        localStorage.setItem("chatRoute", JSON.stringify(tab === "chat"));
        localStorage.setItem("postRoute", JSON.stringify(tab === "post"));
        if (tab === "chat") setNewMsgNotify(false);
    };

    const handleLogout = () => {
        if (role === Roles.MENTOR) dispatch(logoutMentor());
        if (role === Roles.STUDENT) dispatch(logoutStudent());
        if (role === Roles.ADMIN) dispatch(logoutAdmin());
        dispatch(logoutChats());
        dispatch(logoutNotifications());
        dispatch(logoutPosts());
        history.push("/");
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "home": return <Home name={profileData ? `${profileData.firstname} ${profileData.lastname}` : `${adminData?.firstname} ${adminData?.lastname}`} />;
            case "post": return <Post socket={socket} streamUpdated={streamUpdated} setStreamUpdated={setStreamUpdated} />;
            case "menteeInfo": return <MenteeInfo />;
            case "chat": return <Chat />;
            case "profile": return <Profile profileData={profileData} />;
            case "academicDetails": return <AcademicDetails />;
            case "manageGroups": return <ManageGroups />;
            case "createUsers": return <CreateUsers />;
            case "logs": return <Logs />;
            case "meetings": return <Meetings />;
            case "allInteractions": return <AdminInteractions />;
            default: return null;
        }
    };

    if (loading) return <div className="w-full h-screen flex items-center justify-center gap-x-3"><Loading /><h3>Loading user data...</h3></div>;

    return (
        <authContext.Provider value={{ uid, role }}>
            <div className="h-screen flex bg-gray-50 overflow-hidden">
                <nav className="w-3/20 h-screen bg-white flex flex-col z-10">
                    <div className="h-1/10 flex items-center justify-center">
                        <Code alt={true} myStyle="w-7 h-7 mr-4" />
                        <h1 className="capitalize">{role.toLowerCase()}</h1>
                    </div>
                    {role === Roles.ADMIN && (
                        <>
                            <button id="manageGroups" onClick={handleRouteChange} className="flex items-center justify-between bg-blue-600 hover:bg-blue-800 text-white m-4 p-3 rounded-md">Manage groups <Plus alt={true} myStyle="h-6 w-6 text-white" /></button>
                            <button id="createUsers" onClick={handleRouteChange} className="flex items-center justify-between bg-blue-600 hover:bg-blue-800 text-white m-4 p-3 rounded-md">Create Users <Plus alt={true} myStyle="h-6 w-6 text-white" /></button>
                        </>
                    )}
                    <SidebarLink id="home" active={activeTab} onClick={handleRouteChange} icon={<HomeIcon alt={true} myStyle={`h-5 w-5 mr-3 ${activeTab === 'home' && 'text-blue-600'}`} />} label="Home" hidden={role === Roles.ADMIN} />
                    <SidebarLink id="allInteractions" active={activeTab} onClick={handleRouteChange} icon={<UserGroupIcon alt={true} myStyle={`h-5 w-5 mr-3 ${activeTab === 'allInteractions' && 'text-blue-600'}`} />} label="Users" hidden={role !== Roles.ADMIN} />
                    <SidebarLink id="post" active={activeTab} onClick={handleRouteChange} icon={<AnnotationIcon alt={true} myStyle={`h-5 w-5 mr-3 ${activeTab === 'post' && 'text-blue-600'}`} />} label="Post" hidden={role === Roles.ADMIN} />
                    <SidebarLink id="meetings" active={activeTab} onClick={handleRouteChange} icon={<UserGroupIcon alt={true} myStyle={`h-5 w-5 mr-3 ${activeTab === 'meetings' && 'text-blue-600'}`} />} label="Meetings" hidden={role === Roles.ADMIN} />
                    {role === Roles.MENTOR && <SidebarLink id="menteeInfo" active={activeTab} onClick={handleRouteChange} icon={<AcademicCapIcon alt={true} myStyle={`h-5 w-5 mr-3 ${activeTab === 'menteeInfo' && 'text-blue-600'}`} />} label="Mentees" />}
                    {role === Roles.STUDENT && <SidebarLink id="academicDetails" active={activeTab} onClick={handleRouteChange} icon={<AcademicCapIcon alt={true} myStyle={`h-5 w-5 mr-3 ${activeTab === 'academicDetails' && 'text-blue-600'}`} />} label="Academics" />}
                    <SidebarLink id="chat" active={activeTab} onClick={handleRouteChange} icon={<ChatAlt2Icon alt={true} myStyle={`h-5 w-5 mr-3 ${activeTab === 'chat' && 'text-blue-600'}`} />} label="Chat" notify={newMsgNotify} hidden={role === Roles.ADMIN} />
                    <SidebarLink id="profile" active={activeTab} onClick={handleRouteChange} icon={<UserCircleIcon alt={true} myStyle={`h-5 w-5 mr-3 ${activeTab === 'profile' && 'text-blue-600'}`} />} label="Profile" hidden={role === Roles.ADMIN} />
                    {role === Roles.ADMIN && <SidebarLink id="logs" active={activeTab} onClick={handleRouteChange} icon={<DocumentTextIcon alt={true} myStyle={`h-5 w-5 mr-3 ${activeTab === 'logs' && 'text-blue-600'}`} />} label="Logs" />}
                    <button onClick={handleLogout} className="flex items-center text-left hover:bg-red-200 text-gray-800 mt-auto m-4 p-3 rounded-md bg-red-100 transition-all"><LogoutIcon myStyle="h-5 w-5 mr-3 text-red-600" alt={true} /> Logout</button>
                </nav>
                <div className="w-17/20 h-screen">
                    <Header role={role} data={role === Roles.ADMIN ? adminData : profileData} onNotiClick={() => setShowNotificationDropDown(!showNotificationDropDown)} showNoti={showNotificationDropDown}/>
                    <div className="h-9/10 bg-gray-100 overflow-hidden">{renderTabContent()}</div>
                </div>
            </div>

            {/* Chatbot integrated for Students */}
            {role === Roles.STUDENT && <AIChatbot />}

            <NotificationElements showOverlay={showOverlay} overlayRef={overlayRef} showNotificationModal={showNotificationModal} notificationModalRef={notificationModalRef} modalContent={modalContent} setShowNotificationModal={setShowNotificationModal} setShowOverlay={setShowOverlay} showNotificationDropDown={showNotificationDropDown} notificationDropDownRef={notificationDropDownRef} setModalContent={setModalContent}/>
            <ToastContainer limit={5} draggable={false} pauseOnFocusLoss={false} />
        </authContext.Provider>
    );
};

const SidebarLink = ({ id, active, onClick, icon, label, notify, hidden }) => {
    if (hidden) return null;
    return (
        <button id={id} onClick={onClick} className={`${active === id ? "text-gray-700 bg-gray-100" : "text-gray-400"} flex items-center justify-between hover:bg-gray-100 mt-2 mx-4 p-3 pl-8 rounded-md`}>
            <span className="flex items-center pointer-events-none">{icon} {label}</span>
            {notify && <DotIcon myStyle="h-3 w-3 bg-blue-500 rounded-full" />}
        </button>
    );
};

const Header = ({ role, data, onNotiClick, showNoti }) => (
    <div className="relative w-full h-1/10 bg-white shadow-md flex items-center justify-end px-8">
        <div className="flex items-center gap-x-6">
            <button onClick={onNotiClick} className="hover:bg-gray-200 p-2 rounded-full relative">
                <BellIcon myStyle="h-7 w-7 text-blue-600" alt={!showNoti} />
                <NotificationCounter />
            </button>
            <div className="flex items-center gap-x-3">
                <img src={data?.avatar?.url || `https://api.dicebear.com/9.x/personas/svg`} alt="avatar" className="w-12 h-12 rounded-full border" />
                <div className="text-right">
                    <h3 className="text-sm font-bold">{`${data?.firstname || ''} ${data?.lastname || ''}`}</h3>
                    <h6 className="text-xs text-gray-500">{data?.email}</h6>
                </div>
            </div>
        </div>
    </div>
);

const NotificationElements = ({ showOverlay, overlayRef, showNotificationModal, notificationModalRef, modalContent, setShowNotificationModal, setShowOverlay, showNotificationDropDown, notificationDropDownRef, setModalContent }) => (
    <>
        <CSSTransition nodeRef={overlayRef} in={showOverlay} timeout={300} classNames="overlay" unmountOnExit><ModalOverlay nodeRef={overlayRef} /></CSSTransition>
        <CSSTransition nodeRef={notificationModalRef} in={showNotificationModal} timeout={300} classNames="modal" unmountOnExit><NotificationModal nodeRef={notificationModalRef} setShowNotificationModal={setShowNotificationModal} setShowOverlay={setShowOverlay} notification={modalContent} /></CSSTransition>
        <CSSTransition nodeRef={notificationDropDownRef} in={showNotificationDropDown} timeout={300} classNames="modal" unmountOnExit><Notification nodeRef={notificationDropDownRef} setShowNotificationModal={setShowNotificationModal} setShowOverlay={setShowOverlay} setModalContent={setModalContent} /></CSSTransition>
    </>
);

export default MentorDashboard;