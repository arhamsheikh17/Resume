"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Get form and preview elements
const form = document.getElementById("resumeForm");
const resumePage = document.getElementById("resumePage");
const resumePhoto = document.getElementById("resumePhoto");
const resumeName = document.getElementById("resumeName");
const resumeEmail = document.getElementById("resumeEmail");
const resumePhone = document.getElementById("resumePhone");
const resumeEducation = document.getElementById("resumeEducation");
const resumeWorkExperience = document.getElementById("resumeWorkExperience");
const resumeSkills = document.getElementById("resumeSkills");
const downloadPdfButton = document.getElementById('download-pdf');
const backButton = document.getElementById("backButton");
const editButton = document.getElementById("editButton");
const resumeContent = document.getElementById("resumeContent");
const shareLinkButton = document.getElementById("shareLinkButton");
// Handle form submission
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    // Collect form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const degree = document.getElementById("degree").value;
    const education = document.getElementById("education").value;
    const workExperience = document.getElementById("workExperience").value;
    const skills = document.getElementById("skills").value;
    const photoInput = document.getElementById("photo");
    const photoFile = photoInput.files ? photoInput.files[0] : null;
    let photoBase64 = '';
    if (photoFile) {
        photoBase64 = await fileToBase64(photoFile);
        // Store the photo in localStorage instead of passing it in the URL
        localStorage.setItem("resumePhoto", photoBase64);
        resumePhoto.src = photoBase64;
    }
    // Populate the resume preview
    resumeName.textContent = name;
    resumeEmail.textContent = `Email: ${email}`;
    resumePhone.textContent = `Phone: ${phone}`;
    resumeEducation.textContent = `${degree} from ${education}`;
    resumeWorkExperience.textContent = workExperience;
    resumeSkills.textContent = skills;
    // Hide form and show resume page
    document.querySelector(".container")?.classList.add("hidden");
    resumePage.classList.remove("hidden");
    // Generate shareable link without the photo
    const queryParams = new URLSearchParams({
        name: name,
        email: email,
        phone: phone,
        degree: degree,
        education: education,
        workExperience: workExperience,
        skills: skills,
    });
    const uniqueUrl = `${window.location.origin}?${queryParams.toString()}`;
    shareLinkButton.addEventListener("click", () => {
        navigator.clipboard.writeText(uniqueUrl);
        alert('Shareable link copied to clipboard!');
    });
    window.history.replaceState(null, '', `?${queryParams.toString()}`);
});
// Convert photo to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
// Add back button functionality to go back to the form
backButton.addEventListener("click", () => {
    // Show the form again and hide the resume preview
    document.querySelector(".container")?.classList.remove("hidden");
    resumePage.classList.add("hidden");
    // Optionally clear query parameters
    window.history.replaceState(null, '', '/');
});
// Add edit button functionality
editButton.addEventListener("click", () => {
    // Populate the form with current resume data for editing
    updateFormFromResume();
    // Show the form again for editing
    document.querySelector(".container")?.classList.remove("hidden");
    resumePage.classList.add("hidden");
});
// Function to update the form fields with current resume data
function updateFormFromResume() {
    const [degree, education] = resumeEducation.textContent?.split(" from ") || [];
    document.getElementById("name").value = resumeName.textContent || '';
    document.getElementById("email").value = resumeEmail.textContent?.replace('Email: ', '') || '';
    document.getElementById("phone").value = resumePhone.textContent?.replace('Phone: ', '') || '';
    document.getElementById("degree").value = degree || '';
    document.getElementById("education").value = education || '';
    document.getElementById("workExperience").value = resumeWorkExperience.textContent || '';
    document.getElementById("skills").value = resumeSkills.textContent || '';
}
// Handle PDF download
downloadPdfButton.addEventListener('click', () => {
    if (typeof html2pdf === 'undefined') {
        alert('Error: html2pdf library is not loaded.');
        return;
    }
    const resumeOptions = {
        margin: 0.5,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    // Generate and download PDF
    html2pdf()
        .from(resumeContent)
        .set(resumeOptions)
        .save()
        .catch((error) => {
        console.error('PDF generation error:', error);
    });
});
// Handle query parameters on page load
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || '';
    const email = params.get('email') || '';
    const phone = params.get('phone') || '';
    const degree = params.get('degree') || '';
    const education = params.get('education') || '';
    const workExperience = params.get('workExperience') || '';
    const skills = params.get('skills') || '';
    if (name || email || phone || degree || education || workExperience || skills) {
        // Populate the resume preview if query params are present
        resumeName.textContent = name;
        resumeEmail.textContent = `Email: ${email}`;
        resumePhone.textContent = `Phone: ${phone}`;
        resumeEducation.textContent = `${degree} from ${education}`;
        resumeWorkExperience.textContent = workExperience;
        resumeSkills.textContent = skills;
        // Retrieve photo from localStorage (if available)
        const savedPhoto = localStorage.getItem("resumePhoto");
        if (savedPhoto) {
            resumePhoto.src = savedPhoto;
        }
        // Hide form and show resume page
        document.querySelector(".container")?.classList.add("hidden");
        resumePage.classList.remove("hidden");
    }
});
// CSS for ensuring the image is styled properly
resumePhoto.style.width = "150px"; // Adjust width as per your requirement
resumePhoto.style.height = "150px";
resumePhoto.style.objectFit = "cover";
resumePhoto.style.borderRadius = "50%"; // Circular image
resumePhoto.style.display = "block";
resumePhoto.style.margin = "0 auto";
