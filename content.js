// --- CONFIGURATION: The Keyword Dictionary ---
const fieldMappings = {
    // 1. SPECIFIC LINKS (Unlikely to be confused)
    linkedin:   ['linkedin', 'linked', 'profile_url'],
    github:     ['github', 'git', 'repo'],
    resume:     ['resume', 'cv', 'portfolio', 'file', 'upload'],
    
    // 2. EDUCATION (Specific terms)
    university: ['university', 'college', 'school', 'institute', 'institution'],
    degree:     ['degree', 'major', 'specialization', 'qualification', 'stream'],
    gradYear:   ['graduation_year', 'grad_year', 'passing_year', 'year_of_passing', 'batch'],

    // 3. PERSONAL NAMES (Check these BEFORE Email)
    fname:      ['first_name', 'firstname', 'fname', 'given_name', 'forename'],
    lname:      ['last_name', 'lastname', 'lname', 'surname', 'family_name'],
    fullname:   ['full_name', 'fullname', 'your_name', 'complete_name'], 

    // 4. CONTACT (Check Email LAST to prevent overwriting)
    phone:      ['phone', 'mobile', 'cell', 'contact', 'whatsapp'],
    email:      ['email', 'e-mail'], // Removed 'mail' to avoid "Mailing Address" confusion
    
    // 5. OTHERS
    address:    ['address', 'city', 'location', 'residence', 'street'],
    skills:     ['skill', 'technology', 'competency', 'tech_stack'],
};

let userData = {};

// --- 1. STARTUP ---
const allKeys = Object.keys(fieldMappings).concat(['gender']); 

chrome.storage.local.get(allKeys, (data) => {
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

    const inputs = document.querySelectorAll('input:not([data-autofilled]), textarea:not([data-autofilled]), select:not([data-autofilled])');
    
    inputs.forEach(input => {
        if (input.type === 'hidden' || input.type === 'file' || input.type === 'submit') return;

        // RULE 0: If the browser explicitely says it's an Email field, fill it.
        if (input.type === 'email') {
            fillInput(input, userData.email);
            return;
        }

        const labelText = findLabelText(input);
        const description = `${input.id} ${input.name} ${input.placeholder} ${labelText}`.toLowerCase();

        // PRIORITY ORDER (Crucial Fix)
        
        // 1. Check Links
        if (checkMatch(input, description, fieldMappings.linkedin, userData.linkedin)) return;
        if (checkMatch(input, description, fieldMappings.github, userData.github)) return;
        if (checkMatch(input, description, fieldMappings.resume, userData.resume)) return;

        // 2. Check Education
        if (checkMatch(input, description, fieldMappings.university, userData.university)) return;
        if (checkMatch(input, description, fieldMappings.degree, userData.degree)) return;
        if (checkMatch(input, description, fieldMappings.gradYear, userData.gradYear)) return;

        // 3. Check Names (Fix: Check Names BEFORE Email)
        if (checkMatch(input, description, fieldMappings.fname, userData.fname)) return;
        if (checkMatch(input, description, fieldMappings.lname, userData.lname)) return;
        if (checkMatch(input, description, fieldMappings.fullname, `${userData.fname} ${userData.lname}`)) return;

        // 4. Check Phone & Address
        if (checkMatch(input, description, fieldMappings.phone, userData.phone)) return;
        if (checkMatch(input, description, fieldMappings.address, userData.address)) return;

        // 5. Check Email (Fix: Check this late)
        if (checkMatch(input, description, fieldMappings.email, userData.email)) return;
        
        // 6. Others
        if (checkMatch(input, description, fieldMappings.skills, userData.skills)) return;
    });
}

// --- 3. HELPER FUNCTIONS ---
function findLabelText(input) {
    let text = "";
    // Google Forms
    if (input.getAttribute('aria-labelledby')) {
        input.getAttribute('aria-labelledby').split(' ').forEach(id => {
            const el = document.getElementById(id);
            if (el) text += " " + el.innerText;
        });
    }
    // Standard Label
    if (input.id) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) text += " " + label.innerText;
    }
    // Accessibility Label
    if (input.getAttribute('aria-label')) text += " " + input.getAttribute('aria-label');
    
    // Parent Text (Be careful with this)
    if (input.parentElement) {
        text += " " + input.parentElement.innerText;
        // Only check grandparent if parent text is very short (prevents grabbing whole page text)
        if (input.parentElement.innerText.length < 50 && input.parentElement.parentElement) {
             text += " " + input.parentElement.parentElement.innerText;
        }
    }
    return text;
}

function checkMatch(input, textString, keywords, value) {
    if (!value) return false;
    const found = keywords.some(key => textString.includes(key));
    if (found) {
        fillInput(input, value);
        return true;
    }
    return false;
}

function fillInput(input, value) {
    input.value = value;
    input.setAttribute('data-autofilled', 'true');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new Event('focus', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
}
