# StreamSnatch Chrome Extension

A professional Chrome extension that allows you to capture and download videos from web pages with a clean, modern interface.

## Features

- 🎥 **Video Capture**: Automatically detects and captures video streams from web pages
- 📱 **Clean UI**: Modern, professional interface with intuitive controls
- 🔄 **Real-time Status**: Live status updates and visual feedback
- 💾 **Automatic Download**: Downloads videos in WebM format with timestamps
- 🎯 **Smart Detection**: Supports multiple video player types and platforms

## Installation

1. **Download/Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** by toggling the switch in the top right corner
4. **Click "Load unpacked"** and select the folder containing the extension files
5. The extension icon should now appear in your Chrome toolbar

## Usage

1. **Navigate** to a webpage with video content
2. **Click** the StreamSnatch extension icon in your toolbar
3. **Click "Start Recording"** to begin capturing the video
4. **Click "Stop & Download"** when you want to stop and save the video
5. The video will be automatically downloaded to your default Downloads folder

## Files Structure

```
video-downloader-extension/
├── manifest.json       # Extension configuration
├── popup.html         # Extension popup interface
├── popup.css          # Styling for the popup
├── popup.js           # Popup functionality and UI controls
├── content.js         # Content script for video capture
└── README.md          # This file
```

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Active tab and scripting permissions only
- **Video Format**: WebM format for optimal compatibility
- **Browser Support**: Chrome 88+ (Manifest V3 support required)

## Supported Video Platforms

The extension automatically detects videos from various sources including:
- Standard HTML5 video players
- Streaming platforms with `.video-stream` class
- Custom video players
- And many more through intelligent element detection

## Privacy & Security

- ✅ **No data collection**: The extension doesn't collect or transmit any personal data
- ✅ **Local processing**: All video processing happens locally in your browser
- ✅ **Minimal permissions**: Only requests necessary permissions for functionality
- ✅ **Open source**: All code is visible and auditable

## Troubleshooting

### "No video element found"
- Make sure the page has loaded completely
- Try refreshing the page and waiting for video content to load
- Some platforms may use custom video players that aren't detected

### Recording doesn't start
- Check if the video is playing or paused
- Ensure the browser has necessary media permissions
- Try on a different video source

### Extension icon not visible
- Make sure Developer Mode is enabled in Chrome extensions
- Check that the extension was loaded successfully
- Look for the extension in the Chrome extensions menu (puzzle piece icon)

## Development

To modify or enhance the extension:

1. Edit the relevant files (`popup.js`, `content.js`, etc.)
2. Reload the extension in `chrome://extensions/`
3. Test your changes on various video platforms