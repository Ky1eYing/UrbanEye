function showConfirmModal(title, text, yes, no, onConfirm) {
    return new Promise(resolve => {
        const modal = document.getElementById('confirmModal');
        const confirmTitle = document.getElementById('confirmTitle');
        const confirmText = document.getElementById('confirmText');
        const btnYes = document.getElementById('confirmYes');
        const btnNo = document.getElementById('confirmNo');

        if (title)
            confirmTitle.textContent = title;
        if (text)
            confirmText.textContent = text;
        if (yes)
            btnYes.textContent = yes;
        if (no)
            btnNo.textContent = no;

        document.body.style.overflow = 'hidden';
        modal.style.display = 'flex';

        btnYes.onclick = () => {
            document.body.style.overflow = '';
            modal.style.display = 'none';
            resolve(true);
        };

        btnNo.onclick = () => {
            document.body.style.overflow = '';
            modal.style.display = 'none';
            resolve(false);
        };
    });
}
