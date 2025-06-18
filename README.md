# YouTube Premium Popup Blocker

A Tampermonkey userscript that automatically removes YouTube's annoying Premium subscription popups with optional visual notifications.

## The Problem

While adblockers effectively block most advertisements, they don't prevent YouTube's built-in Premium subscription popups that appear every 15 seconds during video playback, interrupting your viewing experience.

## Features

- **Automatic Detection**: Instantly detects and removes YouTube Premium upsell popups
- **Visual Notifications**: Optional slide-in notifications when popups are blocked
- **Customizable**: Easy on/off toggle for notifications
- **Lightweight**: Minimal performance impact
- **Smart Detection**: Uses multiple detection methods for reliability
- **SPA Compatible**: Works with YouTube's single-page application navigation

## Installation

### Prerequisites
- Tampermonkey

### Steps
1. Install Tampermonkey for your browser
2. Copy the script from `youtube-premium-blocker.js`
3. Open Tampermonkey Dashboard
4. Click "Create a new script"
5. Replace the default content with the copied script
6. Save (Ctrl+S / Cmd+S)
7. Refresh YouTube

## Configuration

### Disable Notifications
To turn off the "Ad Removed" notifications, change line 4:
```javascript
const SHOW_NOTIFICATIONS = false;
```

### Customize Notification Duration
To change how long notifications stay visible, modify line 52:
```javascript
}, 5000);  // 5 seconds (5000 milliseconds)
```

### Change Notification Color
To change the text color to black, modify line 23:
```javascript
color: black;
```


##  Troubleshooting

### Script Not Working?
- Ensure Tampermonkey is enabled
- Check that the script is active in Tampermonkey dashboard
- Refresh the YouTube page
- Check browser console for error messages

### Notifications Not Showing?
- Verify `SHOW_NOTIFICATIONS` is set to `true`
- Check if other extensions are blocking the notifications
- Look in browser console for "Showing notification" messages

##  Browser Compatibility

-  Chrome
-  Firefox  
-  Edge
-  Safari (with Tampermonkey equivalent)
-  Opera

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on YouTube
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This script is for educational purposes. Use responsibly and in accordance with YouTube's Terms of Service.

## Acknowledgments

- Inspired by the need for uninterrupted YouTube viewing
- Built for users frustrated with persistent Premium popups

---

**Star this repository if it helped you enjoy ad-free YouTube!**
