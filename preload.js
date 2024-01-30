const { shell } = require("electron");

const fakeDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
window.addEventListener("DOMContentLoaded", async () => {
  const checkUrlPrint = document.getElementById("check-url-print");
  if (checkUrlPrint != null) {
    shell.openExternal(checkUrlPrint.value);
    window.location = document.referrer;
  }
  await fakeDelay(300);
  const btnCetakTandaTerima = document.getElementsByClassName("btn-print");

  for (let i = 0; i < btnCetakTandaTerima.length; i++) {
    btnCetakTandaTerima[i].addEventListener("click", (e) => {
      shell.openExternal(btnCetakTandaTerima[i].dataset.url);
    });
  }
  const btnCetakTInvoice = document.getElementById("cetakInvoice");
  if (btnCetakTInvoice != null) {
    btnCetakTInvoice.addEventListener("click", (e) => {
      shell.openExternal(btnCetakTInvoice.dataset.url);
    });
  }
});
