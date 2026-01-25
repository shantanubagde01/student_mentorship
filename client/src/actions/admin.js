import { toast } from "react-toastify";
import * as api from "../api/admin";
import { showToast } from "../components/toast/toast";

// Admin Sign In
export const adminSignIn = (fields, history) => async (dispatch) => {
    try {
        const { data } = await api.signIn(fields);
        if (data.code === 200) {
            dispatch({ type: "SIGN_IN_ADMIN", data });
            history.push("/admin/dashboard");
        } else {
            showToast("error", data.msg, 10000, toast.POSITION.TOP_RIGHT);
        }
    } catch (error) {
        console.log(error);
    }
};

// Get Admin Details
export const adminGetDetails = () => async (dispatch) => {
    try {
        const { data } = await api.fetchAdmin();
        if (data.code === 200) {
            return dispatch({ type: "FETCH_ADMIN", data });
        } else {
            showToast("error", data.msg, 10000, toast.POSITION.BOTTOM_LEFT);
        }
    } catch (error) {
        console.log(error);
    }
};

// Get all Mentors and Mentees
export const adminGetMentorMentee = () => async (dispatch) => {
    try {
        const { data } = await api.fetchMentorMentee();
        if (data.code === 200) {
            dispatch({ type: "FETCH_MENTOR_MENTEE", data });
        } else {
            showToast("error", data.msg, 10000, toast.POSITION.BOTTOM_LEFT);
        }
    } catch (error) {
        console.log(error);
    }
};

// --- FIX: Added adminFetchLogs for Logs.js component ---
export const adminFetchLogs = () => async (dispatch) => {
    try {
        const { data } = await api.fetchLogs();
        if (data.code === 200) {
            dispatch({ type: "FETCH_LOGS", data: data.data });
        }
    } catch (error) {
        console.log(error);
    }
};

// --- FIX: Added adminAssignMentees for ManageGroups.js component ---
export const adminAssignMentees = (groupData) => async (dispatch) => {
    try {
        const { data } = await api.assignMentees(groupData);
        if (data.code === 200) {
            dispatch(adminGetMentorMentee());
            showToast("success", data.msg, 3000, toast.POSITION.BOTTOM_LEFT);
        } else {
            showToast("error", data.msg, 10000, toast.POSITION.BOTTOM_LEFT);
        }
    } catch (error) {
        console.log(error);
    }
};

// --- FIX: THE PURGE ACTION for John undefined Doe ---
export const runDatabasePurge = () => async (dispatch) => {
    try {
        const { data } = await api.purgeInvalidUser();
        if (data.code === 200) {
            showToast("success", "John undefined Doe erased!", 5000, toast.POSITION.BOTTOM_LEFT);
            dispatch(adminGetMentorMentee());
        } else {
            showToast("error", data.msg, 10000, toast.POSITION.BOTTOM_LEFT);
        }
    } catch (error) {
        console.error("Purge failed:", error);
    }
};

export const adminRemoveMentees = (groupData) => async (dispatch) => {
    try {
        const { data } = await api.removeMentees(groupData);
        if (data.code === 200) {
            dispatch(adminGetMentorMentee());
            showToast("success", data.msg, 3000, toast.POSITION.BOTTOM_LEFT);
        } else {
            showToast("error", data.msg, 10000, toast.POSITION.BOTTOM_LEFT);
        }
    } catch (error) {
        console.log(error);
    }
};

export const adminCreateMentor = (mentorData) => async (dispatch) => {
    try {
        const { data } = await api.createMentor(mentorData);
        if (data.code === 200) {
            dispatch(adminGetMentorMentee());
            showToast("success", "Mentor created successfully", 3000, toast.POSITION.BOTTOM_LEFT);
        } else {
            showToast("error", data.msg, 10000, toast.POSITION.BOTTOM_LEFT);
        }
    } catch (error) {
        console.log(error);
    }
};

export const adminDeleteMentor = (mentorId) => async (dispatch) => {
    try {
        const { data } = await api.deleteMentor(mentorId);
        if (data.code === 200) {
            dispatch(adminGetMentorMentee());
            showToast("success", "Mentor deleted successfully", 3000, toast.POSITION.BOTTOM_LEFT);
        } else {
            showToast("error", data.msg, 10000, toast.POSITION.BOTTOM_LEFT);
        }
    } catch (error) {
        console.log(error);
    }
};

export const adminUpdateMentorCredentials = (mentorData) => async (dispatch) => {
    try {
        const { data } = await api.updateMentorCredentials(mentorData);
        if (data.code === 200) {
            dispatch(adminGetMentorMentee());
            showToast("success", "Mentor credentials updated", 3000, toast.POSITION.BOTTOM_LEFT);
        } else {
            showToast("error", data.msg || "Failed to update mentor credentials", 10000, toast.POSITION.BOTTOM_LEFT);
        }
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const adminCreateStudent = (studentData) => async (dispatch) => {
    try {
        const { data } = await api.createStudent(studentData);
        if (data.code === 200) {
            dispatch(adminGetMentorMentee());
            showToast("success", "Student created successfully", 3000, toast.POSITION.BOTTOM_LEFT);
        } else {
            showToast("error", data.msg, 10000, toast.POSITION.BOTTOM_LEFT);
        }
    } catch (error) {
        console.log(error);
    }
};

export const adminDeleteStudent = (studentId) => async (dispatch) => {
    try {
        const { data } = await api.deleteStudent(studentId);
        if (data.code === 200) {
            dispatch(adminGetMentorMentee());
            showToast("success", "Student deleted successfully", 3000, toast.POSITION.BOTTOM_LEFT);
        } else {
            showToast("error", data.msg, 10000, toast.POSITION.BOTTOM_LEFT);
        }
    } catch (error) {
        console.log(error);
    }
};

export const adminUpdateStudentCredentials = (studentData) => async (dispatch) => {
    try {
        const { data } = await api.updateStudentCredentials(studentData);
        if (data.code === 200) {
            dispatch(adminGetMentorMentee());
            showToast("success", "Student credentials updated", 3000, toast.POSITION.BOTTOM_LEFT);
        } else {
            showToast("error", data.msg || "Failed to update student credentials", 10000, toast.POSITION.BOTTOM_LEFT);
        }
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const adminGetInteractions = (history, setInteractions) => async (dispatch) => {
    try {
        const { data } = await api.getInteractions();
        if (data.code === 200) {
            setInteractions(data.data.interactions);
        } else {
            showToast("error", data.msg, 10000, toast.POSITION.BOTTOM_LEFT);
        }
    } catch (error) {
        console.log(error);
    }
};

export const adminBanUser = (id) => async (dispatch) => {
    try {
        const { data } = await api.banUser(id);
        if (data.code === 200) {
            dispatch(adminGetMentorMentee());
            showToast("success", data.msg, 2000, toast.POSITION.BOTTOM_LEFT);
        }
    } catch (error) {
        console.log(error);
    }
};

export const logoutAdmin = () => async (dispatch) => {
    try {
        dispatch({ type: "LOGOUT_ADMIN" });
    } catch (error) {
        console.log(error);
    }
};
