import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
    adminCreateMentor,
    adminCreateStudent,
    adminDeleteMentor,
    adminDeleteStudent,
    adminUpdateMentorCredentials,
    adminUpdateStudentCredentials,
} from "../../../../../actions/admin";

const CreateUsers = () => {
    const dispatch = useDispatch();

    // State for mentor form
    const [mentorForm, setMentorForm] = useState({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        middlename: "",
        department: "",
        designation: "",
    });

    // State for student form
    const [studentForm, setStudentForm] = useState({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        middlename: "",
        enrollment_no: "",
        semester: "",
        department: "",
    });

    // State for update forms
    const [updateMentorForm, setUpdateMentorForm] = useState({
        id: "",
        email: "",
        password: "",
    });

    const [updateStudentForm, setUpdateStudentForm] = useState({
        id: "",
        email: "",
        password: "",
    });

    // State for delete forms
    const [deleteMentorId, setDeleteMentorId] = useState("");
    const [deleteStudentId, setDeleteStudentId] = useState("");

    const handleMentorChange = (e) => {
        setMentorForm({ ...mentorForm, [e.target.name]: e.target.value });
    };

    const handleStudentChange = (e) => {
        setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
    };

    const handleUpdateMentorChange = (e) => {
        setUpdateMentorForm({ ...updateMentorForm, [e.target.name]: e.target.value });
    };

    const handleUpdateStudentChange = (e) => {
        setUpdateStudentForm({ ...updateStudentForm, [e.target.name]: e.target.value });
    };

    const handleCreateMentor = async (e) => {
        e.preventDefault();
        const result = await dispatch(adminCreateMentor(mentorForm));
        if (result && result.code === 200) {
            setMentorForm({
                email: "",
                password: "",
                firstname: "",
                lastname: "",
                middlename: "",
                department: "",
                designation: "",
            });
        }
        // else error toast is already shown in action
    };

    const handleCreateStudent = (e) => {
        e.preventDefault();
        dispatch(adminCreateStudent(studentForm));
        setStudentForm({
            email: "",
            password: "",
            firstname: "",
            lastname: "",
            middlename: "",
            enrollment_no: "",
            semester: "",
            department: "",
        });
    };

    const handleDeleteMentor = (e) => {
        e.preventDefault();
        if (deleteMentorId) {
            dispatch(adminDeleteMentor(deleteMentorId));
            setDeleteMentorId("");
        }
    };

    const handleDeleteStudent = (e) => {
        e.preventDefault();
        if (deleteStudentId) {
            dispatch(adminDeleteStudent(deleteStudentId));
            setDeleteStudentId("");
        }
    };

    const handleUpdateMentor = (e) => {
        e.preventDefault();
        dispatch(adminUpdateMentorCredentials(updateMentorForm));
        setUpdateMentorForm({
            id: "",
            email: "",
            password: "",
        });
    };

    const handleUpdateStudent = (e) => {
        e.preventDefault();
        dispatch(adminUpdateStudentCredentials(updateStudentForm));
        setUpdateStudentForm({
            id: "",
            email: "",
            password: "",
        });
    };

    return (
        <div className="p-5 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Manage Users</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Mentor */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-medium mb-4">Create Mentor</h3>
                    <form onSubmit={handleCreateMentor} className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={mentorForm.email}
                            onChange={handleMentorChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={mentorForm.password}
                            onChange={handleMentorChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="firstname"
                            placeholder="First Name"
                            value={mentorForm.firstname}
                            onChange={handleMentorChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Last Name"
                            value={mentorForm.lastname}
                            onChange={handleMentorChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="middlename"
                            placeholder="Middle Name"
                            value={mentorForm.middlename}
                            onChange={handleMentorChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="department"
                            placeholder="Department"
                            value={mentorForm.department}
                            onChange={handleMentorChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="designation"
                            placeholder="Designation"
                            value={mentorForm.designation}
                            onChange={handleMentorChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                            Create Mentor
                        </button>
                    </form>
                </div>

                {/* Create Student */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-medium mb-4">Create Student</h3>
                    <form onSubmit={handleCreateStudent} className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={studentForm.email}
                            onChange={handleStudentChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={studentForm.password}
                            onChange={handleStudentChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="firstname"
                            placeholder="First Name"
                            value={studentForm.firstname}
                            onChange={handleStudentChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Last Name"
                            value={studentForm.lastname}
                            onChange={handleStudentChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="middlename"
                            placeholder="Middle Name"
                            value={studentForm.middlename}
                            onChange={handleStudentChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="enrollment_no"
                            placeholder="Enrollment Number"
                            value={studentForm.enrollment_no}
                            onChange={handleStudentChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="semester"
                            placeholder="Semester"
                            value={studentForm.semester}
                            onChange={handleStudentChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="department"
                            placeholder="Department"
                            value={studentForm.department}
                            onChange={handleStudentChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                        >
                            Create Student
                        </button>
                    </form>
                </div>

                {/* Update Mentor Credentials */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-medium mb-4">Update Mentor Credentials</h3>
                    <form onSubmit={handleUpdateMentor} className="space-y-4">
                        <input
                            type="text"
                            name="id"
                            placeholder="Mentor ID"
                            value={updateMentorForm.id}
                            onChange={handleUpdateMentorChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="New Email (optional)"
                            value={updateMentorForm.email}
                            onChange={handleUpdateMentorChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="New Password (optional)"
                            value={updateMentorForm.password}
                            onChange={handleUpdateMentorChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                            type="submit"
                            className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700"
                        >
                            Update Mentor
                        </button>
                    </form>
                </div>

                {/* Update Student Credentials */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-medium mb-4">Update Student Credentials</h3>
                    <form onSubmit={handleUpdateStudent} className="space-y-4">
                        <input
                            type="text"
                            name="id"
                            placeholder="Student ID"
                            value={updateStudentForm.id}
                            onChange={handleUpdateStudentChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="New Email (optional)"
                            value={updateStudentForm.email}
                            onChange={handleUpdateStudentChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="New Password (optional)"
                            value={updateStudentForm.password}
                            onChange={handleUpdateStudentChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
                        >
                            Update Student
                        </button>
                    </form>
                </div>

                {/* Delete Mentor */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-medium mb-4">Delete Mentor</h3>
                    <form onSubmit={handleDeleteMentor} className="space-y-4">
                        <input
                            type="text"
                            name="deleteMentorId"
                            placeholder="Mentor ID"
                            value={deleteMentorId}
                            onChange={(e) => setDeleteMentorId(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                        >
                            Delete Mentor
                        </button>
                    </form>
                </div>

                {/* Delete Student */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-medium mb-4">Delete Student</h3>
                    <form onSubmit={handleDeleteStudent} className="space-y-4">
                        <input
                            type="text"
                            name="deleteStudentId"
                            placeholder="Student ID"
                            value={deleteStudentId}
                            onChange={(e) => setDeleteStudentId(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                        >
                            Delete Student
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateUsers;
