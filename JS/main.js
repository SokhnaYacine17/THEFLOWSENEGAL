// ========== MENU MOBILE ==========
document.addEventListener('DOMContentLoaded', function() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navList = document.querySelector('.nav-list');
  
  if (mobileToggle && navList) {
    mobileToggle.addEventListener('click', function() {
      const isExpanded = navList.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }

  // Fermer le menu au clic sur un lien
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navList) {
        navList.classList.remove('active');
        if (mobileToggle) {
          mobileToggle.setAttribute('aria-expanded', 'false');
          const icon = mobileToggle.querySelector('i');
          if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
          }
        }
      }
    });
  });

  // ========== NEWSLETTER FORM ==========
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value.trim() : '';
      
      if (email && email.includes('@') && email.includes('.')) {
        alert(`Merci ${email} ! Vous êtes maintenant engagé(e) avec The Flow Sénégal. Ensemble, protégeons le fleuve. 🌊`);
        emailInput.value = '';
      } else if (email) {
        alert('Veuillez entrer une adresse email valide (ex: nom@domaine.com).');
      } else {
        alert('Veuillez entrer votre adresse email.');
      }
    });
  }

  // ========== SCROLL ANIMATION ==========
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.action-card, .stat-item, .why-text, .why-image, .flash-card');
    
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 80;
      
      if (isVisible) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  };

  // Initialisation des styles pour animation
  const animatedElements = document.querySelectorAll('.action-card, .stat-item, .why-text, .why-image, .flash-card');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Déclencher au chargement

  // ========== HEADER SCROLL EFFECT ==========
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.style.padding = '12px 0';
        header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
      } else {
        header.style.padding = '16px 0';
        header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.06)';
      }
    });
  }

  // ========== HERO OVERLAY CUSTOM IMAGE (si vous avez une image locale) ==========
  // Pour utiliser votre propre image de bannière, décommentez la ligne ci-dessous
  // et remplacez 'votre-image.jpg' par le chemin de votre image
  
  const heroOverlay = document.querySelector('.hero-overlay');
  if (heroOverlay) {
    heroOverlay.style.backgroundImage = "url('../images/hero.png')";
  }
  
});
/**
 * The Flow Sénégal - Page À propos
 * Scripts spécifiques pour la page apropos.html
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ========== ANIMATION AU SCROLL ==========
  const animatedElements = document.querySelectorAll('.identity-grid, .letter-card, .team-card, .gallery-item, .stat-item');
  
  const animateOnScroll = () => {
    animatedElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 80;
      
      if (isVisible) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Initialisation des styles pour animation
  animatedElements.forEach(el => {
    el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll();
  
  // ========== GALERIE & LIGHTBOX ==========
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.querySelector('.lightbox-image');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  
  let currentIndex = 0;
  let imagesList = [];

  if (galleryItems.length > 0 && lightboxModal && lightboxImage) {
    // Récupérer toutes les images de la galerie
    galleryItems.forEach((item, index) => {
      const fullImageUrl = item.getAttribute('data-full');
      if (fullImageUrl) {
        imagesList.push(fullImageUrl);
      }
      
      item.addEventListener('click', () => {
        currentIndex = index;
        const imageUrl = item.getAttribute('data-full');
        if (imageUrl) {
          lightboxImage.src = imageUrl;
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Fonction pour afficher l'image courante
    const showImage = (index) => {
      if (imagesList.length > 0 && index >= 0 && index < imagesList.length) {
        lightboxImage.src = imagesList[index];
        currentIndex = index;
      }
    };

    // Navigation précédente
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = imagesList.length - 1;
        showImage(newIndex);
      });
    }

    // Navigation suivante
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let newIndex = currentIndex + 1;
        if (newIndex >= imagesList.length) newIndex = 0;
        showImage(newIndex);
      });
    }

    // Fermer la lightbox
    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
      });
    }

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
      if (lightboxModal && lightboxModal.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          let newIndex = currentIndex - 1;
          if (newIndex < 0) newIndex = imagesList.length - 1;
          showImage(newIndex);
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          let newIndex = currentIndex + 1;
          if (newIndex >= imagesList.length) newIndex = 0;
          showImage(newIndex);
        }
      }
    });
  }
  
  // ========== EFFET DE SURVOL SUR LA LETTRE ==========
  const letterCard = document.querySelector('.letter-card');
  if (letterCard) {
    letterCard.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.01)';
    });
    
    letterCard.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  }
  
  // ========== EFFET DE PARALLAXE SUR LE HEADER ==========
  const pageHeader = document.querySelector('.page-header');
  if (pageHeader) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const overlay = pageHeader.querySelector('.page-header-overlay');
      if (overlay && scrolled < 400) {
        overlay.style.transform = `translateY(${scrolled * 0.2}px)`;
      }
    });
  }
});