document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    const output = document.getElementById('output');
    let scrolling = false;

    startButton.addEventListener('click', startListening);

    function startListening() {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            output.textContent = `You said: ${transcript}`;

            // Perform actions based on the recognized command
            performAction(transcript);
        };

        recognition.start();
    }
    function performAction(command) {
        const lowerCaseCommand = command.toLowerCase();

        if (lowerCaseCommand.includes('new tab')) {
            chrome.tabs.create({});
        } else if (lowerCaseCommand.includes('search')) {
            const searchTerm = command.replace('search', '').trim();
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
            chrome.tabs.create({ url: searchUrl });
        } else if (lowerCaseCommand.includes('open ')) {
            const website = command.replace('open', '').trim();
            openWebsite(website);
        } else if (lowerCaseCommand.includes('close tab')) {
            closeTab();
        } else if (lowerCaseCommand.includes('close all tabs')) {
            closeAllTabs();
        } else if (lowerCaseCommand.includes('scroll down')) {
            scrolling = true;
            scrollDown();
        } else if (lowerCaseCommand.includes('scroll up')) {
            scrolling = true;
            scrollUp();
        } else if (lowerCaseCommand.includes('stop')) {
            scrolling = false;
        } else if (lowerCaseCommand.includes('history')) {
            chrome.tabs.create({ url: 'chrome://history' });
        } else if (lowerCaseCommand.includes('bookmarks')) {
            chrome.tabs.create({ url: 'chrome://bookmarks' });
        } else if (lowerCaseCommand.includes('reload')) {
            chrome.tabs.reload();
        } else if (lowerCaseCommand.includes('extensions')) {
            chrome.tabs.create({ url: 'chrome://extensions' });
        } else {
            speak('Unrecognized command. Please try again.');
        }
    }

    function openWebsite(website) {
        chrome.tabs.create({ url: 'https://' + website + '.com' });
    }

    function closeTab() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                chrome.tabs.remove(tabs[0].id);
            }
        });
    }

    function closeAllTabs() {
        chrome.tabs.query({}, function (tabs) {
            for (const tab of tabs) {
                chrome.tabs.remove(tab.id);
            }
        });
    }

    function scrollDown() {
        const scrollInterval = setInterval(() => {
            if (!scrolling) {
                clearInterval(scrollInterval);
            } else {
                chrome.tabs.executeScript({
                    code: 'window.scrollBy(0, 100);'
                });
            }
        }, 500); // Adjust the interval as needed
    }

    function scrollUp() {
        const scrollInterval = setInterval(() => {
            if (!scrolling) {
                clearInterval(scrollInterval);
            } else {
                chrome.tabs.executeScript({
                    code: 'window.scrollBy(0, -100);'
                });
            }
        }, 500); // Adjust the interval as needed
    }
    function speak(text) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        synth.speak(utterance);
    }


});