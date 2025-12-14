document.addEventListener('DOMContentLoaded', () => {
    // Added 'university', 'degree', 'gradYear'
    const fields = [
        'fname', 'lname', 'email', 'phone', 'address', 'gender', 
        'university', 'degree', 'gradYear', 
        'skills', 'resume', 'linkedin', 'github'
    ];

    // Load Data
    chrome.storage.local.get(fields, (data) => {
        fields.forEach(field => {
            if (data[field]) document.getElementById(field).value = data[field];
        });
    });

    // Save Data
    document.getElementById('saveBtn').addEventListener('click', () => {
        const data = {};
        fields.forEach(field => {
            data[field] = document.getElementById(field).value;
        });

        chrome.storage.local.set(data, () => {
            const btn = document.getElementById('saveBtn');
            const originalText = btn.innerText;
            
            btn.innerText = "SAVED ✓";
            btn.style.background = "#28a745";
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "#764ba2";
            }, 2000);
        });
    });
});