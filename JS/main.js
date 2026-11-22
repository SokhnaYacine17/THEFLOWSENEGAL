/* =========================================================
   THE FLOW SÉNÉGAL — JAVASCRIPT PRINCIPAL
   Menu responsive et interactions accessibles
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".mobile-toggle");
  const navigation = document.querySelector(".nav-list");
  const menuIcon = menuButton?.querySelector("i");

  if (!menuButton || !navigation) {
    return;
  }

  const mobileBreakpoint = window.matchMedia("(max-width: 850px)");

  function setMenuState(isOpen) {
    navigation.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));

    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Fermer le menu" : "Ouvrir le menu"
    );

    document.body.classList.toggle(
      "menu-open",
      isOpen && mobileBreakpoint.matches
    );

    if (menuIcon) {
      menuIcon.classList.toggle("fa-bars", !isOpen);
      menuIcon.classList.toggle("fa-xmark", isOpen);
    }
  }

  menuButton.addEventListener("click", () => {
    const isOpen =
      menuButton.getAttribute("aria-expanded") === "true";

    setMenuState(!isOpen);
  });

  // Fermer le menu après avoir choisi une page.
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  // Fermer le menu avec la touche Échap.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
      menuButton.focus();
    }
  });

  // Réinitialiser l'état du menu lors du passage sur ordinateur.
  function handleBreakpointChange(event) {
    if (!event.matches) {
      setMenuState(false);
    }
  }

  if (mobileBreakpoint.addEventListener) {
    mobileBreakpoint.addEventListener("change", handleBreakpointChange);
  } else {
    // Compatibilité avec les anciens navigateurs.
    mobileBreakpoint.addListener(handleBreakpointChange);
  }

  // Fermer le menu si l'utilisateur clique en dehors.
  document.addEventListener("click", (event) => {
    const isOpen =
      menuButton.getAttribute("aria-expanded") === "true";

    if (
      isOpen &&
      !navigation.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      setMenuState(false);
    }
  });

  // État initial propre.
  setMenuState(false);
});