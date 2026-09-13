/**
 * VOYA - Contact & Expedition Inquiry Form + FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Optional: Close others
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 2. Booking Form Validation & Interactive Feedback
  const bookingForm = document.getElementById('expeditionForm');
  const confirmationModal = document.getElementById('bookingConfirmationModal');
  const closeConfirmBtn = document.getElementById('closeConfirmModal');
  const confirmRefCode = document.getElementById('confirmRefCode');
  const confirmDetails = document.getElementById('confirmDetails');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName')?.value.trim();
      const email = document.getElementById('emailAddress')?.value.trim();
      const phone = document.getElementById('phoneNumber')?.value.trim();
      const destination = document.getElementById('preferredRegion')?.value;
      const travelDate = document.getElementById('travelDate')?.value;
      const travelers = document.getElementById('travelerCount')?.value;
      const expeditionType = document.getElementById('expeditionType')?.value;

      // Basic validation
      if (!fullName || !email || !phone || !travelDate) {
        alert('Please fill in all mandatory fields so our basecamp coordinators can prepare your plan.');
        return;
      }

      // Generate a simulated booking reference number
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const bookingRef = `VYA-${randomNum}`;

      if (confirmRefCode) confirmRefCode.textContent = bookingRef;
      if (confirmDetails) {
        confirmDetails.innerHTML = `
          <p><strong>Lead Explorer:</strong> ${fullName}</p>
          <p><strong>Selected Expedition:</strong> ${destination} (${expeditionType})</p>
          <p><strong>Departure Date:</strong> ${travelDate} &bull; <strong>Group:</strong> ${travelers} Travelers</p>
          <p><strong>Contact Email:</strong> ${email}</p>
        `;
      }

      if (confirmationModal) {
        confirmationModal.classList.add('active');
      } else {
        alert(`Inquiry Confirmed! Your Reference: ${bookingRef}. Our Gilgit-Baltistan guide team will contact you shortly.`);
      }

      bookingForm.reset();
    });
  }

  closeConfirmBtn?.addEventListener('click', () => {
    confirmationModal?.classList.remove('active');
  });

  confirmationModal?.addEventListener('click', (e) => {
    if (e.target === confirmationModal) {
      confirmationModal.classList.remove('active');
    }
  });
});
