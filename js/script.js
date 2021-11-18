(function () {

    const formElement = document.getElementById('mainForm');




    /*
    * Secondary functions
    * */
    function ajax(params) {
        const xhr = new XMLHttpRequest();
        const url = params.url || '';
        const body = params.body || '';
        const success = params.success;
        const error = params.error;

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(body);
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200 && typeof success === 'function') {
                success(xhr.response);
            } else if (xhr.readyState === 4 && xhr.status !== 200 && typeof error === 'function') {
                error(xhr.response);
            }
        };
        xhr.onerror = error || null;
    }

    /*
    * Validation
    * */
    function checkRegExp(pattern, message, value) {
        return pattern.test(value) ? true : message;
    }

    const validations = {
        firstName: [
            checkRegExp.bind(null, /^[A-Zа-я]{2,}$/i, 'Field may contain only letters and not be less than 2 letters'),
            checkRegExp.bind(null, /^[A-Zа-я]{2,64}$/i, 'Field may contain only letters and not be more than 64 letters'),
        ],
        lastName: [
            checkRegExp.bind(null, /^[A-Zа-я]{2,}$/i, 'Field may contain only letters and not be less than 2 letters'),
            checkRegExp.bind(null, /^[A-Zа-я]{2,64}$/i, 'Field may contain only letters and not be more than 64 letters'),
        ],
        email: [
            checkRegExp.bind(null,
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please enter valid email'),
        ],
        phone: [
            checkRegExp.bind(null, /^[0-9]{8}$/, 'Field may contain only 8 digits'),
        ],
        password: [
            checkRegExp.bind(null,
                /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\!\@\#\$\%\^\&\*\-])/,
                'Required at least one number (0-9), uppercase and lowercase letters (a-Z) and at least one special character (!@#$%^&*-)'),
        ],
        password2: [
            checkRegExp.bind(null,
                /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\!\@\#\$\%\^\&\*\-])/,
                'Required at least one number (0-9), uppercase and lowercase letters (a-Z) and at least one special character (!@#$%^&*-)'),
        ],
        zip: [
            checkRegExp.bind(null, /^[0-9]{5}$/, 'Field must include 5 digits and only consist of numeric values'),
        ]
    };

    function validateField(element) {
        const fieldValidation = validations[element.id];
        const result = { valid: true, element: element, message: '' };

        if (fieldValidation) {
            for (let i = 0, len = fieldValidation.length; i < len; i++) {
                const validationFunction = fieldValidation[i];
                const answer = validationFunction(element.value);
                if (typeof answer === 'string') {
                    result.valid = false;
                    result.message = answer;
                    break;
                }
            }
        }

        return result;
    }

    /*
    * Other function
    * */
    function toggleError(element, message) {
        const errorMessageElement = element.nextElementSibling && element.nextElementSibling.classList.contains('field-error')
            ? element.nextElementSibling
            : null;

        errorMessageElement && message && (errorMessageElement.innerHTML = message);
        errorMessageElement && !message && (errorMessageElement.innerHTML = '');
    }

    function formOnchange(e) {
        if (e.target.dataset && e.target.dataset.validation !== undefined) {
            toggleError(e.target, validateField(e.target).message);
        }

        if (e.target.id === 'password' || e.target.id === 'password2') {
            const passwordElem = document.querySelector('#password');
            const password2Elem = document.querySelector('#password2');

            if (passwordElem.value === password2Elem.value) {
                passwordElem.nextElementSibling.innerHTML = ''
                password2Elem.nextElementSibling.innerHTML = ''
            }
        }
    }

    function onClickControl() {
        if (hasError()) {
            return;
        }

        const steps = document.querySelectorAll('.step');
        const buttons = document.querySelectorAll('.control');

        steps.forEach(element => {
            element.classList.contains('step_active') ? element.classList.remove('step_active') : element.classList.add('step_active');
        });

        buttons.forEach(element => {
            element.classList.contains('control_hide') ? element.classList.remove('control_hide') : element.classList.add('control_hide');
        });
    }

    function hasError() {
        const fields = document.querySelectorAll('.field');
        const fieldsArray = Array.from(fields);

        const errorsMessagesArray = fieldsArray.filter(element => element.closest('.step_active') && element.nextElementSibling.innerHTML);
        return errorsMessagesArray.length !== 0
    }

    /*
    * Listeners
    * */
    document.getElementById('mainForm').addEventListener('change', formOnchange);
    document.getElementById('mainForm').addEventListener('submit', (e) => e.preventDefault());
    document.querySelector('.control_next').addEventListener('click', onClickControl);
    document.querySelector('.control_prev').addEventListener('click', onClickControl);
})();
