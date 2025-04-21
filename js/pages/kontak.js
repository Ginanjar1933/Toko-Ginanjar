document.addEventListener('DOMContentLoaded', () => {
    setupContactForm();
});

function setupContactForm() {
    const form = document.querySelector('.contact-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            subject: form.querySelector('#subject').value,
            message: form.querySelector('#message').value
        };

        if (validateForm(formData)) {
            try {
                const response = await sendMessage(formData);
                if (response.success) {
                    showAlert('Pesan berhasil dikirim!', 'success');
                    form.reset();
                }
            } catch (error) {
                showAlert('Gagal mengirim pesan', 'error');
            }
        }
    });
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name.trim()) errors.push('Nama harus diisi');
    if (!data.email.trim()) errors.push('Email harus diisi');
    if (!isValidEmail(data.email)) errors.push('Email tidak valid');
    if (!data.message.trim()) errors.push('Pesan harus diisi');

    if (errors.length > 0) {
        showAlert(errors.join('\n'), 'error');
        return false;
    }
    return true;
}

async function sendMessage(data) {
    const response = await fetch(`${CONFIG.API_URL}/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}
