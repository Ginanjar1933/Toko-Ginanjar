import AuthAPI from '../api/auth-api.js';

// Pindahkan variabel ke scope global
let passwordInput;
let confirmPasswordInput;

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const phoneInput = document.getElementById('phone');
    // Inisialisasi variabel global
    passwordInput = document.getElementById('password');
    confirmPasswordInput = document.getElementById('confirm-password');
    const requirements = document.querySelectorAll('.requirement');

    // Format nomor telepon
    phoneInput.addEventListener('input', (e) => {
        // Hapus semua karakter non-digit dan prefix yang ada
        let number = e.target.value.replace(/\D/g, '').replace(/^62+/, '');
        
        // Hapus angka 0 di depan jika ada
        if (number.startsWith('0')) {
            number = number.substring(1);
        }

        // Tambahkan prefix +62 hanya jika ada nomor
        if (number) {
            e.target.value = '+62' + number;
        } else {
            e.target.value = '';
        }

        // Batasi panjang nomor (misalnya: +62 + 11 digit)
        if (number.length > 11) {
            e.target.value = e.target.value.slice(0, 14);
        }
    });

    // Real-time password validation
    passwordInput.addEventListener('input', () => {
        const validations = validatePassword(passwordInput.value);
        
        requirements.forEach(req => {
            const requirement = req.dataset.requirement;
            if (validations[requirement]) {
                req.classList.add('valid');
                req.querySelector('i').className = 'fas fa-check-circle';
            } else {
                req.classList.remove('valid');
                req.querySelector('i').className = 'fas fa-times-circle';
            }
        });
        
        checkPasswordMatch();
    });

    confirmPasswordInput.addEventListener('input', checkPasswordMatch);

    // Perbaikan toggle password visibility
    document.querySelectorAll('.toggle-button').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });

    registerForm.addEventListener('submit', handleRegister);
});

// Fungsi toggle password visibility
window.togglePassword = function(inputId) {
    const input = document.getElementById(inputId);
    const eyeIcon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
};

// Event listeners untuk password requirements
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const requirements = document.querySelectorAll('.requirement');
    const passwordMatchError = document.querySelector('.password-match-error');

    // Fungsi validasi password
    function validatePassword() {
        const password = passwordInput.value;
        
        // Check uppercase
        const hasUpperCase = /[A-Z]/.test(password);
        updateRequirement('uppercase', hasUpperCase);
        
        // Check number
        const hasNumber = /[0-9]/.test(password);
        updateRequirement('number', hasNumber);
        
        // Check special character
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        updateRequirement('special', hasSpecial);
        
        // Check length
        const hasLength = password.length >= 8;
        updateRequirement('length', hasLength);
    }

    // Fungsi update requirement visual
    function updateRequirement(requirement, valid) {
        const reqElement = document.querySelector(`[data-requirement="${requirement}"]`);
        const icon = reqElement.querySelector('i');
        
        if (valid) {
            reqElement.classList.add('valid');
            icon.classList.remove('fa-times-circle');
            icon.classList.add('fa-check-circle');
        } else {
            reqElement.classList.remove('valid');
            icon.classList.remove('fa-check-circle');
            icon.classList.add('fa-times-circle');
        }
    }

    // Fungsi validasi konfirmasi password
    function validateConfirmPassword() {
        if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
            passwordMatchError.textContent = 'Password tidak sama';
            confirmPasswordInput.setCustomValidity('Password tidak sama');
        } else {
            passwordMatchError.textContent = '';
            confirmPasswordInput.setCustomValidity('');
        }
    }

    // Event listeners
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
});

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function checkPasswordMatch() {
    // Sekarang bisa mengakses passwordInput dan confirmPasswordInput
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const errorDiv = document.querySelector('.password-match-error');
    
    if (confirmPassword) {
        if (password !== confirmPassword) {
            errorDiv.textContent = 'Password tidak cocok';
            confirmPasswordInput.classList.add('error');
        } else {
            errorDiv.textContent = '';
            confirmPasswordInput.classList.remove('error');
        }
    }
}

async function handleRegister(e) {
    e.preventDefault();

    // Ambil dan validasi semua field form
    const formFields = {
        username: document.getElementById('username').value.trim(),
        name: document.getElementById('fullname').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirm-password').value
    };

    // Debug log untuk memastikan data terambil
    console.log('Form fields:', formFields);

    // Validasi data sebelum dikirim
    if (!formFields.username) {
        showAlert('Username harus diisi', 'error');
        return;
    }

    if (validateRegistration(formFields)) {
        try {
            // Persiapkan data untuk dikirim ke server
            const dataToSend = {
                username: formFields.username,
                name: formFields.name,
                email: formFields.email,
                phone: formFields.phone.replace(/\D/g, ''),
                password: formFields.password
            };

            // Debug log sebelum mengirim ke API
            console.log('Data yang akan dikirim ke API:', dataToSend);

            const response = await AuthAPI.register(dataToSend);
            console.log('Response from server:', response);

            showAlert('Registrasi berhasil! Silakan login.', 'success');
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);
            showAlert(error.message || 'Gagal melakukan registrasi', 'error');
        }
    }
}

function validatePassword(password) {
    const validations = {
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*]/.test(password),
        length: password.length >= 8
    };

    const errors = [];
    if (!validations.uppercase) errors.push("Harus ada huruf besar");
    if (!validations.number) errors.push("Harus ada angka");
    if (!validations.special) errors.push("Harus ada karakter khusus (!@#$%^&*)");
    if (!validations.length) errors.push("Minimal 8 karakter");

    return {
        isValid: Object.values(validations).every(v => v),
        errors
    };
}

function validateRegistration(data) {
    // Tambah validasi username
    if (!data.username || data.username.trim() === '') {
        showAlert('Username harus diisi', 'error');
        return false;
    }

    const passwordCheck = validatePassword(data.password);
    
    if (!passwordCheck.isValid) {
        showAlert('Password tidak valid:\n' + passwordCheck.errors.join('\n'), 'error');
        return false;
    }

    if (data.password !== data.confirmPassword) {
        showAlert('Konfirmasi password tidak cocok', 'error');
        return false;
    }

    return true;
}
