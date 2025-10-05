import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminGetMentorMentee } from "../../../../../actions/admin";
import { adminAssignMentees, adminRemoveMentees } from "../../../../../actions/admin";
import { showToast } from "../../../../toast/toast";
import { toast } from "react-toastify";

const ManageGroups = () => {
    const dispatch = useDispatch();

    const { mentorMenteeDetails: { mentors, students } } = useSelector((state) => state.admin);

    const [selectedMentorId, setSelectedMentorId] = useState(null);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);

    useEffect(() => {
        dispatch(adminGetMentorMentee());
    }, [dispatch]);

    const handleMentorSelect = (e) => {
        setSelectedMentorId(e.target.value);
        setSelectedStudentIds([]);
    };

    const handleStudentToggle = (studentId) => {
        if (selectedStudentIds.includes(studentId)) {
            setSelectedStudentIds(selectedStudentIds.filter(id => id !== studentId));
        } else {
            setSelectedStudentIds([...selectedStudentIds, studentId]);
        }
    };

    const handleAssign = () => {
        if (!selectedMentorId) {
            showToast("error", "Please select a mentor", 3000, toast.POSITION.BOTTOM_LEFT);
            return;
        }
        if (selectedStudentIds.length === 0) {
            showToast("error", "Please select at least one student", 3000, toast.POSITION.BOTTOM_LEFT);
            return;
        }
        dispatch(adminAssignMentees({ mentorId: selectedMentorId, studentIds: selectedStudentIds }));
        setSelectedStudentIds([]);
    };

    const handleRemove = () => {
        if (!selectedMentorId) {
            showToast("error", "Please select a mentor", 3000, toast.POSITION.BOTTOM_LEFT);
            return;
        }
        if (selectedStudentIds.length === 0) {
            showToast("error", "Please select at least one student", 3000, toast.POSITION.BOTTOM_LEFT);
            return;
        }
        dispatch(adminRemoveMentees({ mentorId: selectedMentorId, studentIds: selectedStudentIds }));
        setSelectedStudentIds([]);
    };

    return (
        <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Manage Mentor-Student Groups</h2>
            <div className="mb-4">
                <label htmlFor="mentorSelect" className="block mb-2 font-medium">Select Mentor:</label>
                <select
                    id="mentorSelect"
                    value={selectedMentorId || ""}
                    onChange={handleMentorSelect}
                    className="border border-gray-300 rounded p-2 w-full max-w-xs"
                >
                    <option value="" disabled>Select a mentor</option>
                    {mentors && mentors.map((mentor) => (
                        <option key={mentor._id} value={mentor._id}>
                            {mentor.firstname} {mentor.lastname} ({mentor.email})
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <h3 className="font-medium mb-2">Select Students:</h3>
                <div className="max-h-64 overflow-y-auto border border-gray-300 rounded p-2">
                    {students && students.map((student) => (
                        <div key={student._id} className="flex items-center mb-1">
                            <input
                                type="checkbox"
                                id={`student-${student._id}`}
                                checked={selectedStudentIds.includes(student._id)}
                                onChange={() => handleStudentToggle(student._id)}
                                className="mr-2"
                            />
                            <label htmlFor={`student-${student._id}`}>
                                {student.firstname} {student.lastname} ({student.email})
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex space-x-4">
                <button
                    onClick={handleAssign}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Assign Selected Students
                </button>
                <button
                    onClick={handleRemove}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Remove Selected Students
                </button>
            </div>
        </div>
    );
};

export default ManageGroups;
