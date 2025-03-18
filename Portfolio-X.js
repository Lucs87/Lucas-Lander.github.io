document.addEventListener('DOMContentLoaded', function() {
  // Variables
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.nav');
  const backToTopBtn = document.querySelector('.back-to-top');
  const themeSwitch = document.getElementById('theme-switch');
  const portfolioItems = document.querySelectorAll('.portfolio__item');
  const skillBars = document.querySelectorAll('.skill-bar__fill');
  const contactForm = document.querySelector('.form');
  const sections = document.querySelectorAll('section[id]');
  const REVEAL_OFFSET = 150;
  
  // Mobile Navigation Toggle
  navToggle.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', function() {
      nav.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (nav.classList.contains('active') && !nav.contains(e.target) && !navToggle.contains(e.target)) {
      nav.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }
  });
  
  // Scroll functions
  function handleScroll() {
    // Sticky header
    if (window.scrollY > 100) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    
    // Show/hide back to top button
    if (window.scrollY > 700) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
    
    // Reveal animations
    revealOnScroll();
    
    // Highlight active nav link
    highlightNavLink();
  }
  
  window.addEventListener('scroll', handleScroll);
  
  // Smooth Scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = header.offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Back to Top Button
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Portfolio Filtering
  document.querySelector('.portfolio__filters').addEventListener('click', function(e) {
    if (e.target.classList.contains('portfolio__filter')) {
      // Remove active class from all filters
      document.querySelectorAll('.portfolio__filter').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to clicked filter
      e.target.classList.add('active');
      
      // Get filter value
      const filterValue = e.target.getAttribute('data-filter');
      
      // Filter items
      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }
  });
  
  // Theme Toggle
  themeSwitch.addEventListener('change', function() {
    document.body.classList.toggle('dark-theme');
    
    // Update header background when theme changes
    if (document.body.classList.contains('dark-theme')) {
      header.style.backgroundColor = 'var(--color-bg)';
    } else {
      header.style.backgroundColor = 'var(--color-bg)';
    }
    
    // Save theme preference
    const isDarkMode = document.body.classList.contains('dark-theme');
    localStorage.setItem('dark-theme', isDarkMode);
  });
  
  // Check saved theme preference
  const savedTheme = localStorage.getItem('dark-theme');
  if (savedTheme === 'true') {
    document.body.classList.add('dark-theme');
    themeSwitch.checked = true;
  }
  
  // Form Validation
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      
      let isValid = true;
      const errorMessages = [];
      
      if (!name) {
        isValid = false;
        errorMessages.push('Name is required');
      }
      
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        isValid = false;
        errorMessages.push('Valid email is required');
      }
      
      if (!subject) {
        isValid = false;
        errorMessages.push('Subject is required');
      }
      
      if (!message) {
        isValid = false;
        errorMessages.push('Message is required');
      }
      
      if (isValid) {
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
      } else {
        alert('Please fix the following errors:\n' + errorMessages.join('\n'));
      }
    });
  }
  
  // Scroll Reveal Animation
  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const revealElements = document.querySelectorAll('.reveal');
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - REVEAL_OFFSET) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
  }
  
  // Active Navigation Link
  function highlightNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      
      try {
        const navLink = document.querySelector('.nav__link[href*=' + sectionId + ']');
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      } catch (error) {
        // If nav link doesn't exist, just skip it
      }
    });
  }
  
  // Animate skill bars
  function animateSkillBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetWidth = entry.target.parentElement.previousElementSibling.querySelector('.skill-bar__percentage').textContent;
          entry.target.style.width = targetWidth;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    skillBars.forEach(bar => observer.observe(bar));
  }
  
  // Initialize everything
  handleScroll(); // Trigger scroll functions once on page load
  animateSkillBars();
  highlightNavLink();
  revealOnScroll();
});
