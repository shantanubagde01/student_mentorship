import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { mentorUpdateProfile } from "../../../../../actions/mentor";
import Resizer from "react-image-file-resizer";

const ProfileModal = ({
    nodeRef,
    mentorProfileData,
    setShowOverlay,
    setShowEditModal,
    setMentorProfileData,
}) => {
    const history = useHistory();
    const dispatch = useDispatch();

    // state to control the disabled state of the update button
    const [disable, setDisable] = useState(true);

    // state for avatar file
    const [avatar, setAvatar] = useState(null);

    // function to handle modal actions
    const handleModalActions = () => {
        setShowOverlay(false);
        setShowEditModal(false);
    };

    // function to resize image
    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file, // Is the file of the image which will resized.
                200, //Is the maxWidth of the resized new image.
                200, // Is the maxHeight of the resized new image.
                "JPEG", // Is the compressFormat of the resized new image. (JPEG, PNG or WEBP)
                90, // Is the quality of the resized new image. (0-100)
                0, // Is the degree of clockwise rotation. (0, 90, 180, 270, 360)
                (uri) => resolve(uri), // Is the callBack function of the resized new image URI.
                "file" // Is the output type of the resized new image. (file, base64 or blob)
            );
        });

    // function to handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("firstname", mentorProfileData.firstname);
        formData.append("middlename", mentorProfileData.middlename);
        formData.append("lastname", mentorProfileData.lastname);
        formData.append("phone", mentorProfileData.phone);
        formData.append("address", mentorProfileData.address);
        formData.append("department", mentorProfileData.department);
        formData.append("designation", mentorProfileData.designation);
        if (avatar) {
            formData.append("avatar", avatar);
        }
        dispatch(mentorUpdateProfile(history, formData));
        handleModalActions();
    };

    // function to handle change in the inputs
    const handleChange = (e) => {
        setDisable(false);
        setMentorProfileData({
            ...mentorProfileData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <div className="w-full h-full bg-transparent absolute top-0 left-0 flex items-center justify-center">
                <div
                    ref={nodeRef}
                    className="max-h-500 overflow-y-auto w-3/5 z-50 p-6 bg-white rounded-md"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="mr-5">Edit information</h4>
                        <button onClick={handleModalActions} className="text-2xl">
                            &times;
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col items-start justify-center">
                            <h4 className="mb-2 font-bold">Proffesional Information</h4>
                            <div className="grid grid-cols-2 gap-x-7 w-full">
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="department" className="mb-2">
                                        Department
                                    </label>
                                    <select
                                        id="department"
                                        name="department"
                                        className="rounded-lg border-gray-300"
                                        value={mentorProfileData.department}
                                        onChange={handleChange}
                                        required
                                        selected={mentorProfileData.department}
                                    >
                                        <option value="">Select department</option>
                                        <option value="Computer Science & Engineering">
                                            Computer Science & Engineering
                                        </option>
                                    </select>
                                </div>
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="designation" className="mb-2">
                                        Designation
                                    </label>
                                    <input
                                        id="designation"
                                        type="text"
                                        name="designation"
                                        required
                                        className="rounded-lg border-gray-300"
                                        value={mentorProfileData.designation}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <h4 className="mb-2 font-bold">Personal Information</h4>
                            <div className="grid grid-cols-3 gap-x-7 w-full">
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="firstname" className="mb-2">
                                        First name
                                    </label>
                                    <input
                                        id="firstname"
                                        type="text"
                                        name="firstname"
                                        required
                                        className="rounded-lg border-gray-300"
                                        value={mentorProfileData.firstname}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="middlename" className="mb-2">
                                        Middle name
                                    </label>
                                    <input
                                        id="middlename"
                                        type="text"
                                        name="middlename"
                                        className="rounded-lg border-gray-300"
                                        value={mentorProfileData.middlename}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="lastname" className="mb-2">
                                        Last name
                                    </label>
                                    <input
                                        id="lastname"
                                        type="text"
                                        name="lastname"
                                        required
                                        className="rounded-lg border-gray-300"
                                        value={mentorProfileData.lastname}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="phone" className="mb-2">
                                        Phone No.
                                    </label>
                                    <input
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        required
                                        className="rounded-lg border-gray-300"
                                        value={mentorProfileData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="address" className="mb-2">
                                        Address
                                    </label>
                                    <input
                                        id="address"
                                        type="text"
                                        name="address"
                                        required
                                        className="rounded-lg border-gray-300"
                                        value={mentorProfileData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <h4 className="mb-2 font-bold">Profile Picture</h4>
                            <div className="flex flex-col mb-3">
                                <label htmlFor="avatar" className="mb-2">
                                    Upload a new profile picture (optional)
                                </label>
                                <input
                                    id="avatar"
                                    type="file"
                                    name="avatar"
                                    className="rounded-lg border-gray-300"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={async (e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            const resizedFile = await resizeFile(file);
                                            setAvatar(resizedFile);
                                            setDisable(false);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="w-full flex items-center justify-end">
                            <button
                                disabled={disable}
                                type="submit"
                                className="flex items-center justify-between py-3 px-4 rounded-md bg-blue-600 hover:bg-blue-800 transition-colors text-white disabled:opacity-50"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProfileModal;
