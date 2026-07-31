// Manager para captura de evento de instalación PWA en Celulares

let deferredPrompt = null;

export const initPwaInstallListener = (onCanInstall) => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (onCanInstall) onCanInstall(true);
  });
};

export const triggerPwaInstall = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return outcome === 'accepted';
  }
  return false;
};
