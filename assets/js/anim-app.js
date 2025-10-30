     AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });

        // Initialize Sortable.js for drag and drop functionality
        document.addEventListener('DOMContentLoaded', function() {
            const sortableElement = document.getElementById('sortable-projects');
            
            if (sortableElement) {
                const sortable = new Sortable(sortableElement, {
                    animation: 200,
                    ghostClass: 'sortable-ghost',
                    dragClass: 'sortable-drag',
                    chosenClass: 'sortable-chosen',
                    handle: '.project-card', // Allow dragging by the entire card
                    swapThreshold: 0.65,
                    fallbackTolerance: 3,
                    forceFallback: false,
                    
                    onStart: function(evt) {
                        console.log('Drag started');
                        document.body.style.cursor = 'grabbing';
                        
                        // Add drag-over class to container
                        const container = evt.from.closest('.projects-container');
                        if (container) {
                            container.classList.add('drag-over');
                        }
                        
                        // Add dragging class to body for global styles
                        document.body.classList.add('is-dragging');
                    },
                    
                    onEnd: function(evt) {
                        console.log('Drag ended');
                        document.body.style.cursor = '';
                        
                        // Remove drag-over class from container
                        const container = evt.from.closest('.projects-container');
                        if (container) {
                            container.classList.remove('drag-over');
                        }
                        
                        // Remove dragging class from body
                        document.body.classList.remove('is-dragging');
                        
                        // Show success message
                        showNotification('Project reordered successfully! 🎉', 'success');
                        
                        // Save new order to localStorage
                        saveProjectOrder();
                        
                        // Re-initialize AOS for reordered elements
                        AOS.refreshHard();
                    },
                    
                    onMove: function(evt) {
                        const container = evt.from.closest('.projects-container');
                        if (container && !container.classList.contains('drag-over')) {
                            container.classList.add('drag-over');
                        }
                        return true;
                    },
                    
                    onClone: function(evt) {
                        console.log('Element cloned for dragging');
                    }
                });
                
                // Add touch event listeners for mobile
                let touchStartY = 0;
                let touchStartX = 0;
                
                sortableElement.addEventListener('touchstart', function(e) {
                    touchStartY = e.touches[0].clientY;
                    touchStartX = e.touches[0].clientX;
                });
                
                sortableElement.addEventListener('touchmove', function(e) {
                    // Prevent default scrolling behavior during drag
                    const touchY = e.touches[0].clientY;
                    const touchX = e.touches[0].clientX;
                    const diffY = Math.abs(touchY - touchStartY);
                    const diffX = Math.abs(touchX - touchStartX);
                    
                    if (diffX > diffY && diffX > 10) {
                        e.preventDefault();
                    }
                }, { passive: false });
                
                // Load saved project order
                loadProjectOrder();
                
                console.log('Sortable initialized successfully');
            } else {
                console.error('Sortable element not found');
            }
        });

        // Save project order to localStorage
        function saveProjectOrder() {
            const projectElements = document.querySelectorAll('#sortable-projects .col-lg-6');
            const order = Array.from(projectElements).map((el, index) => {
                const titleElement = el.querySelector('.card-title');
                const title = titleElement ? titleElement.textContent : `Project ${index + 1}`;
                return { title, index };
            });
            localStorage.setItem('projectOrder', JSON.stringify(order));
            console.log('Project order saved:', order);
        }

        // Load project order from localStorage
        function loadProjectOrder() {
            const savedOrder = localStorage.getItem('projectOrder');
            if (savedOrder) {
                try {
                    const order = JSON.parse(savedOrder);
                    console.log('Loaded project order:', order);
                    // For now, just log the order - full reordering implementation can be added later
                } catch (e) {
                    console.log('Error loading project order:', e);
                }
            }
        }
        
        // Add visual feedback for drag operations
        function addDragFeedback() {
            const cards = document.querySelectorAll('.project-card');
            cards.forEach(card => {
                card.addEventListener('mousedown', function(e) {
                    if (e.which === 1) { // Left mouse button
                        this.style.cursor = 'grabbing';
                    }
                });
                
                card.addEventListener('mouseup', function() {
                    this.style.cursor = 'grab';
                });
            });
        }

        // Show notification function
        function showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} position-fixed`;
            notification.style.cssText = `
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                animation: slideInRight 0.3s ease-out;
            `;
            notification.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="ti ti-check me-2"></i>
                    <span>${message}</span>
                    <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.animation = 'slideOutRight 0.3s ease-in';
                    setTimeout(() => notification.remove(), 300);
                }
            }, 3000);
        }

        // Enhanced card hover effects
        document.addEventListener('DOMContentLoaded', function() {
            // Add drag feedback
            addDragFeedback();
            
            const cards = document.querySelectorAll('.card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    if (!this.classList.contains('project-card')) {
                        this.style.transform = 'translateY(-10px) scale(1.02)';
                    }
                });
                
                card.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('project-card')) {
                        this.style.transform = '';
                    }
                });
            });
            
            // Add floating animation to random elements
            const floatingElements = document.querySelectorAll('.floating');
            floatingElements.forEach((el, index) => {
                el.style.animationDelay = `${index * 0.5}s`;
            });
            
            // Pulse animation for timeline points
            const pulseElements = document.querySelectorAll('.pulse');
            pulseElements.forEach((el, index) => {
                el.style.animationDelay = `${index * 0.3}s`;
            });
            
            // Show drag instructions after page load
            setTimeout(() => {
                showNotification('💡 Tip: Click and drag project cards to reorder them!', 'info');
            }, 2000);
        });

        // Add custom animations CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
            
            .sortable-chosen {
                opacity: 0.8;
            }
            
            .project-card:hover {
                transform: translateY(-5px) scale(1.02);
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            }
            
            /* Enhanced drag states */
            .is-dragging .project-card:not(.sortable-chosen) {
                transition: transform 0.2s ease;
            }
            
            .sortable-fallback {
                opacity: 0.8;
                transform: rotate(5deg);
                box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
            }
            
            /* Mobile touch enhancements */
            @media (max-width: 768px) {
                .project-card {
                    margin-bottom: 20px;
                }
                
                .projects-container::before {
                    content: '👆 Tap and drag to reorder';
                    font-size: 11px;
                }
                
                .drag-handle {
                    display: block !important;
                    opacity: 1 !important;
                }
            }
            
            /* Card grid improvements */
            #sortable-projects .col-lg-6 {
                transition: all 0.3s ease;
            }
            
            /* Smooth column reordering */
            .sortable-ghost .col-lg-6 {
                opacity: 0.5;
            }
            
            /* Enhanced responsive animations */
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
                
                .floating, .pulse {
                    animation: none !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Parallax effect removed for static banner image

        // Add typing effect to name
        document.addEventListener('DOMContentLoaded', function() {
            const nameElement = document.querySelector('.user-profile-info h4');
            if (nameElement) {
                const originalText = nameElement.textContent;
                nameElement.textContent = '';
                
                let i = 0;
                const typeWriter = () => {
                    if (i < originalText.length) {
                        nameElement.textContent += originalText.charAt(i);
                        i++;
                        setTimeout(typeWriter, 100);
                    }
                };
                
                setTimeout(typeWriter, 1000);
            }
        });