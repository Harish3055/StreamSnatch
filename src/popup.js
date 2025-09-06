document.addEventListener('DOMContentLoaded', async () => {
    const startBtn = document.getElementById('extBtn');
    const stopBtn = document.getElementById('stopBtn');
    const statusText = document.getElementById('statusText');
    const container = document.querySelector('.container');

    let isRecording = false;

    function updateUI(state, message = '') {
        container.className = 'container'; 
        
        switch (state) {
            case 'ready':
                startBtn.disabled = false;
                stopBtn.disabled = true;
                startBtn.innerHTML = '<span class="btn-icon">▶️</span>Start Recording';
                statusText.textContent = message || 'Ready to record';
                break;
                
            case 'recording':
                startBtn.disabled = true;
                stopBtn.disabled = false;
                startBtn.innerHTML = '<span class="btn-icon">🔴</span>Recording...';
                statusText.textContent = message || 'Recording in progress';
                container.classList.add('recording');
                isRecording = true;
                break;
                
            case 'stopping':
                startBtn.disabled = true;
                stopBtn.disabled = true;
                statusText.textContent = message || 'Stopping recording...';
                break;
                
            case 'success':
                startBtn.disabled = false;
                stopBtn.disabled = true;
                startBtn.innerHTML = '<span class="btn-icon">▶️</span>Start Recording';
                statusText.textContent = message || 'Download completed';
                container.classList.add('success');
                isRecording = false;
                setTimeout(() => {
                    updateUI('ready', 'Ready to record');
                }, 3000);
                break;
                
            case 'error':
                startBtn.disabled = false;
                stopBtn.disabled = true;
                startBtn.innerHTML = '<span class="btn-icon">▶️</span>Start Recording';
                statusText.textContent = message || 'An error occurred';
                container.classList.add('error');
                isRecording = false;
                setTimeout(() => {
                    updateUI('ready', 'Ready to record');
                }, 3000);
                break;
        }
    }

    async function sendToContentScript(action) {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                throw new Error('No active tab found');
            }

            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['src/content.js']
            });

            const response = await chrome.tabs.sendMessage(tab.id, { action });
            return response;
        } catch (error) {
            console.error('Error communicating with content script:', error);
            throw error;
        }
    }

    try {
        const response = await sendToContentScript('getStatus');
        if (response && response.isRecording) {
            updateUI('recording');
        } else {
            updateUI('ready');
        }
    } catch (error) {
        updateUI('ready');
    }

    startBtn.addEventListener('click', async () => {
        try {
            updateUI('recording', 'Starting recording...');
            await sendToContentScript('startRecording');
        } catch (error) {
            updateUI('error', 'Failed to start recording: ' + error.message);
        }
    });

    stopBtn.addEventListener('click', async () => {
        try {
            updateUI('stopping', 'Stopping recording...');
            await sendToContentScript('stopRecording');
        } catch (error) {
            updateUI('error', 'Failed to stop recording: ' + error.message);
        }
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'statusUpdate') {
            updateUI(message.status, message.message);
        }
    });
});