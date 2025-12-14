// --- CONFIGURATION: The Keyword Dictionary ---
const fieldMappings = {
    fname:      ['first', 'fname', 'given', 'forename', 'legal_first'],
    lname:      ['last', 'lname', 'surname', 'family', 'legal_last'],
    fullname:   ['fullname', 'full_name', 'your_name', 'complete_name', 'name'],
    email:      ['email', 'mail', 'e-mail'],
    phone:      ['phone', 'mobile', 'cell', 'contact'],
    address:    ['address', 'city', 'location', 'residence', 'street'],
    
    // NEW EDUCATION MAPPINGS
    university: ['university', 'college', 'school', 'institute', 'institution', 'education'],
    degree:     ['degree', 'major', 'specialization', 'qualification', 'course', 'stream'],
    gradYear:   ['year', 'graduation', 'passing', 'batch', 'end_date'],

    skills:     ['skill', 'technology', 'competency', 'tech_stack'],
    gender:     ['gender', 'sex', 'identify'],
    resume:     ['resume', 'cv', 'portfolio', 'file', 'upload'],
    linkedin:   ['linkedin', 'linked', 'profile_url'],
    github:     ['github', 'git', 'repo']
};

let userData = {};

// --- 1. STARTUP ---
chrome.storage.local.get(Object.keys(fieldMappings), (data) => {
    userData = data;
    startObserving();
});

function startObserving() {
    processPage();
    const observer = new MutationObserver(() => processPage());
    observer.observe(document.body, { childList: true, subtree: true });
}

// --- 2. MAIN LOGIC ---
function processPage() {
    if (!userData) return;

    const inputs = document.querySelectorAll('input:not([data-autofilled]), textarea:not([data-autofilled])');
    
    inputs.forEach(input => {
        if (input.type === 'hidden' || input.type === 'file' || input.type === 'submit') return;

        const labelText = findLabelText(input);
        const description = `${input.id} ${input.name} ${input.placeholder} ${labelText}`.toLowerCase();

        // 1. Check Education Fields
        if (checkMatch(input, description, fieldMappings.university, userData.university)) return;
        if (checkMatch(input, description, fieldMappings.degree, userData.degree)) return;
        if (checkMatch(input, description, fieldMappings.gradYear, userData.gradYear)) return;

        // 2. Check Standard Fields
        if (checkMatch(input, description, fieldMappings.fname, userData.fname)) return;
        if (checkMatch(input, description, fieldMappings.lname, userData.lname)) return;
        if (checkMatch(input, description, fieldMappings.fullname, `${userData.fname} ${userData.lname}`)) return;
        if (checkMatch(input, description, fieldMappings.email, userData.email)) return;
        if (checkMatch(input, description, fieldMappings.phone, userData.phone)) return;
        if (checkMatch(input, description, fieldMappings.address, userData.address)) return;
        if (checkMatch(input, description, fieldMappings.skills, userData.skills)) return;
        if (checkMatch(input, description, fieldMappings.linkedin, userData.linkedin)) return;
        if (checkMatch(input, description, fieldMappings.github, userData.github)) return;
        if (checkMatch(input, description, fieldMappings.resume, userData.resume)) return;
    });
}

// --- 3. HELPER FUNCTIONS ---
function findLabelText(input) {
    let text = "";
    if (input.getAttribute('aria-labelledby')) {
        input.getAttribute('aria-labelledby').split(' ').forEach(id => {
            const el = document.getElementById(id);
            if (el) text += " " + el.innerText;
        });
    }
    if (input.id) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) text += " " + label.innerText;
    }
    if (input.getAttribute('aria-label')) text += " " + input.getAttribute('aria-label');
    if (input.parentElement) {
        text += " " + input.parentElement.innerText;
        if (input.parentElement.parentElement) text += " " + input.parentElement.parentElement.innerText;
    }
    return text;
}

function checkMatch(input, textString, keywords, value) {
    if (!value) return false;
    const found = keywords.some(key => textString.includes(key));
    if (found) {
        input.value = value;
        input.setAttribute('data-autofilled', 'true');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('focus', { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));
        return true;
    }
    return false;
}