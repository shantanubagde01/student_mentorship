# Integrate Mentor Profile Photo Upload into Profile Update for Real-Time Updates

## Tasks to Complete

- [x] Modify server/src/routes/mentor.js to use multer middleware for profile update route to accept multipart/form-data for avatar upload.
- [x] Update server/src/controllers/mentor.controller.js updateProfile method to handle avatar upload if provided, using cloudinary for upload and deletion of old avatar.
- [x] Modify client/src/components/dashboard/mentorDashboard/dashboardLinks/profile/ProfileModal.js to include file input for avatar and use FormData for submission.
- [x] Update client/src/api/mentor.js updateProfile to handle FormData instead of JSON.
- [x] Update client/src/actions/mentor.js mentorUpdateProfile to handle FormData.

## Followup Steps
- [ ] Test the integrated profile update with photo upload.
- [ ] Ensure real-time updates in the UI.
