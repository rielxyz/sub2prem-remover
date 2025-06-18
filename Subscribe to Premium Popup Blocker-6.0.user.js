// ==UserScript==
// @name         Subscribe to Premium Popup Blocker
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Remove Youtube Subscribe to Premium popups
// @author       rielxyz
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Configuration: Set to false to disable notifications
    const SHOW_NOTIFICATIONS = true;

    // Function to show notification popup
    function showNotification(message) {
        // Remove any existing notification
        const existingNotif = document.getElementById('youtube-blocker-notification');
        if (existingNotif) {
            existingNotif.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'youtube-blocker-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #FAFAFA;
            color: black;
            padding: 8px 16px;
            border-radius: 2px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            opacity: 0.95;
        `;

        document.body.appendChild(notification);

        // Slide in animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 5 seconds with slide out animation
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Function to remove premium popups
    function removePremiumPopups() {
        let popupsRemoved = false;

        // Target the main popup container
        const popupContainers = document.querySelectorAll('tp-yt-paper-dialog.ytd-popup-container');

        console.log(`Checking ${popupContainers.length} popup containers`);

        popupContainers.forEach(popup => {
            // Check if this is a premium upsell popup by looking for specific content
            const upsellElement = popup.querySelector('upsell-view-model');
            const premiumText = popup.textContent.toLowerCase();

            console.log('Popup text preview:', premiumText.substring(0, 100));

            if (upsellElement ||
                premiumText.includes('premium') ||
                premiumText.includes('ad-free') ||
                premiumText.includes('enhanced quality') ||
                premiumText.includes('get youtube premium')) {

                console.log('Premium popup detected and removing...');
                popup.remove();
                popupsRemoved = true;
            }
        });

        // Also target dialog containers that might contain premium popups
        const dialogContainers = document.querySelectorAll('yt-dialog-view-model');

        console.log(`Checking ${dialogContainers.length} dialog containers`);

        dialogContainers.forEach(dialog => {
            const dialogText = dialog.textContent.toLowerCase();

            if (dialogText.includes('premium') ||
                dialogText.includes('ad-free') ||
                dialogText.includes('enhanced quality') ||
                dialogText.includes('get youtube premium')) {

                console.log('Premium dialog detected and removing...');
                dialog.closest('tp-yt-paper-dialog')?.remove() || dialog.remove();
                popupsRemoved = true;
            }
        });

        // Show notification if popups were removed
        if (popupsRemoved && SHOW_NOTIFICATIONS) {
            console.log('Showing notification: Ad Removed');
            showNotification('Ad Removed');
        }

        // Remove any backdrop/overlay that might be left behind
        const backdrops = document.querySelectorAll('tp-yt-iron-overlay-backdrop');
        backdrops.forEach(backdrop => {
            if (backdrop.style.display !== 'none') {
                backdrop.remove();
            }
        });
    }

    // Function to hide premium popups with CSS (backup method)
    function addCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Hide premium popups */
            tp-yt-paper-dialog:has(upsell-view-model),
            tp-yt-paper-dialog:has([class*="premium"]),
            ytd-popup-container:has(upsell-view-model) {
                display: none !important;
            }

            /* Hide premium upsell components */
            upsell-view-model,
            .ytUpsellViewModelHost {
                display: none !important;
            }

            /* Hide any remaining backdrop */
            tp-yt-iron-overlay-backdrop[opened] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Run immediately when script loads
    addCSS();
    removePremiumPopups();

    // Create a MutationObserver to watch for new popups
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;

        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Check if the added node or its children contain popup elements
                        if (node.tagName === 'TP-YT-PAPER-DIALOG' ||
                            node.querySelector && (
                                node.querySelector('tp-yt-paper-dialog') ||
                                node.querySelector('upsell-view-model') ||
                                node.querySelector('yt-dialog-view-model')
                            )) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });

        if (shouldCheck) {
            // Small delay to ensure the popup is fully rendered
            setTimeout(removePremiumPopups, 100);
        }
    });

    // Start observing when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    } else {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Also run the removal function periodically as a failsafe
    setInterval(removePremiumPopups, 2000);

    // Listen for navigation changes (YouTube is a SPA)
    let currentUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            // Run popup removal after navigation
            setTimeout(removePremiumPopups, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

    console.log('YouTube Premium Popup Blocker loaded');
})();