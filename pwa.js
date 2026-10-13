'use strict';
let deferredInstallPrompt = null;
let pwaRegistration = null;

function needsInternet() {
    if (navigator.onLine) return false;
    alertModal('TIADA SAMBUNGAN INTERNET', 'Sambungkan internet dahulu untuk memuatkan data, menyimpan atau menghantar tugasan.');
    return true;
}

function updateConnectionNotice() {
    document.getElementById('offlineNotice').hidden = navigator.onLine;
}

function hideInstallButton() {
    document.getElementById('installAppButton').hidden = true;
}

async function installPDPRApp() {
    if (deferredInstallPrompt) {
        await deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        hideInstallButton();
    } else {
        alertModal('PASANG APLIKASI PDPR', 'iPhone/iPad: buka dalam Safari, tekan Kongsi dan pilih Add to Home Screen / Tambah ke Skrin Utama. Android/komputer: buka menu pelayar dan pilih Install app / Pasang aplikasi.');
    }
}

window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    document.getElementById('installAppButton').hidden = false;
});
window.addEventListener('appinstalled', hideInstallButton);
window.addEventListener('offline', updateConnectionNotice);
window.addEventListener('online', () => {
    updateConnectionNotice();
    fetchStudentCSV();
    fetchDataFromAppsScript();
});

window.addEventListener('DOMContentLoaded', () => {
    updateConnectionNotice();
    if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) hideInstallButton();
    document.getElementById('updateAppButton').addEventListener('click', () => {
        if (pwaRegistration && pwaRegistration.waiting) {
            document.getElementById('updateAppButton').disabled = true;
            pwaRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    });
});

if ('serviceWorker' in navigator && window.isSecureContext) {
    let reloading = false;
    let hadController = Boolean(navigator.serviceWorker.controller);
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!hadController) { hadController = true; return; }
        if (!reloading) { reloading = true; window.location.reload(); }
    });
    window.addEventListener('load', async () => {
        try {
            pwaRegistration = await navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' });
            function showUpdate() { document.getElementById('updateNotice').hidden = false; }
            if (pwaRegistration.waiting) showUpdate();
            pwaRegistration.addEventListener('updatefound', () => {
                const worker = pwaRegistration.installing;
                worker.addEventListener('statechange', () => {
                    if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate();
                });
            });
        } catch (error) {
            console.warn('PWA tidak dapat didaftarkan:', error);
        }
    });
}
