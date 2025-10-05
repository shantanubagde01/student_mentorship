import API from "./index";

export const signIn = (fields) =>
    API.post("/admin/login", fields).catch((error) => {
        return error.response;
    });

export const fetchAdmin = () =>
    API.get("/admin/dashboard").catch((error) => {
        return error.response;
    });

export const fetchMentorMentee = () =>
    API.get("/admin/getAllUsers").catch((error) => {
        return error.response;
    });

export const assignMentees = (groupData) =>
    API.post("/admin/assignMentees", groupData).catch((error) => {
        return error.response;
    });

export const removeMentees = (groupData) =>
    API.post("/admin/removeMentees", groupData).catch((error) => {
        return error.response;
    });

export const fetchLogs = () =>
    API.get("/admin/logs").catch((error) => {
        return error.response;
    });

export const getInteractions = () =>
    API.get("/admin/interactions").catch((error) => {
        return error.response;
    });

export const banUser = (id) =>
    API.patch("/admin/banUser", { id: id }).catch((error) => {
        return error.response;
    });

export const createMentor = (mentorData) =>
    API.post("/admin/createMentor", mentorData).catch((error) => {
        return error.response;
    });

export const deleteMentor = (mentorId) =>
    API.delete("/admin/deleteMentor", { data: { id: mentorId } }).catch((error) => {
        return error.response;
    });

export const updateMentorCredentials = (mentorData) =>
    API.patch("/admin/updateMentorCredentials", mentorData).catch((error) => {
        return error.response;
    });

export const createStudent = (studentData) =>
    API.post("/admin/createStudent", studentData).catch((error) => {
        return error.response;
    });

export const deleteStudent = (studentId) =>
    API.delete("/admin/deleteStudent", { data: { id: studentId } }).catch((error) => {
        return error.response;
    });

export const updateStudentCredentials = (studentData) =>
    API.patch("/admin/updateStudentCredentials", studentData).catch((error) => {
        return error.response;
    });
