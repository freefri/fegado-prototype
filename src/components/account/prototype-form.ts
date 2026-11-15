// There is no account service behind the prototype: a valid form only explains that.
for (const form of document.querySelectorAll<HTMLFormElement>(".prototype-form")) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.reportValidity()) form.querySelector(".prototype-status")?.classList.remove("hidden");
  });
}
