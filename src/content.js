let currentNode;

async function downloadOnPause(video, filename = "video.webm") {
    if (!video) {
        console.error("❌ No video element found");
        sendMessageToPopup("error", "No video element found");
        return;
    }
    
    try {
        const stream = video.captureStream();
        const recorder = new MediaRecorder(stream);
        currentNode = {video, filename, recorder};
        const chunks = [];

        recorder.ondataavailable = e => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            URL.revokeObjectURL(a.href);
            currentNode = undefined;
            console.log(`✅ Downloaded on pause: ${filename}`);
            sendMessageToPopup("success", `Downloaded: ${filename}`);
        };

        recorder.start();
        video.play();
        sendMessageToPopup("recording", "Recording started");
        console.log("📹 Recording started");
    } catch (err) {
        console.error("❌ Could not capture video:", err);
        sendMessageToPopup("error", "Could not capture video: " + err.message);
    }
}

function sendMessageToPopup(status, message) {
    chrome.runtime.sendMessage({
        action: "statusUpdate",
        status: status,
        message: message
    }).catch(() => {
    });
}

function startRecording() {
    if (!currentNode) {
        let videoNode;
        
        const selectors = [
            ".video-stream",
            "video",
            ".video-player video",
            ".player-video video",
            "[data-testid*='video']",
            ".html5-video-container video"
        ];
        
        for (const selector of selectors) {
            const videos = document.querySelectorAll(selector);
            videos.forEach(video => {
                if (video.src || video.srcObject) {
                    videoNode = video;
                    return;
                }
            });
            if (videoNode) break;
        }
        
        if (!videoNode) {
            console.error("❌ No video element found");
            sendMessageToPopup("error", "No video element found on this page");
            return;
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `video_${timestamp}.webm`;
        downloadOnPause(videoNode, filename);
    } else {
        sendMessageToPopup("error", "Recording already in progress");
    }
}

function stopRecording() {
    if (currentNode) {
        const {video, recorder} = currentNode;
        if (video) {
            video.pause();
        }
        if (recorder && recorder.state === "recording") {
            recorder.stop();
        }
        sendMessageToPopup("stopping", "Stopping recording...");
    } else {
        sendMessageToPopup("error", "No recording in progress");
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startRecording") {
        startRecording();
        sendResponse({success: true});
    } else if (request.action === "stopRecording") {
        stopRecording();
        sendResponse({success: true});
    } else if (request.action === "getStatus") {
        sendResponse({
            isRecording: !!currentNode,
            status: currentNode ? "recording" : "ready"
        });
    }
    return true; 
});

console.log("🎥 StreamSnatch content script loaded");