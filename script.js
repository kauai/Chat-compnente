const messageInput = document.querySelector('.message-input')
const chatBody = document.querySelector('.chat-body')
const sendMessageButton = document.querySelector('#send-message')
const fileInput = document.querySelector('#file-input')
const fileUpload = document.querySelector('#file-upload')
const fileUploadWrapper = document.querySelector('.file-upload-wrapper')
const fileCancelButton = document.querySelector('#file-cancel')

const GOOGLE_API_KEY = 'AIzaSyAd30F-BNqxkKYOVvmUpdALsDIV7P_HqL8aa'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`

const userData = {
    message:null,
    file: {
        "data": null,
        "mime_type":null
    }
}

async function generateBotResponse(outGoingMessageDiv) {
    const messageElement = outGoingMessageDiv.querySelector('.message-text')

    try {
        const response = await fetch(API_URL, {
            method:'POST',
            header: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "contents":[{
                    parts: [
                    { 
                        text: userData.message 
                    },
                    userData.file.data ? [{
                        inline_data: userData.file
                    }] : []
                ]
                }]
            })
        })

        const data = await response.json()
        if(!response.ok) throw new Error(data.error.message)

        const apiResponseText = data.candidates[0]
        .content.
        parts[0].
        text
        .replace(/\*\*(.*?)\*\*/g,"$1")
        .trim()

        messageElement.innerText = apiResponseText
    } catch (error) {
        messageElement.innerText = error.message
        messageElement.style.color = "#ff0000"
    } finally {
        userData.file = {}
        chatBody.scrollTo({top: chatBody.scrollHeight,behavior: 'smooth'})
        outGoingMessageDiv.classList.remove('thinking')
    }
}

// Create message element with dynamic classes and return it
function createMessageElement(content,...classes) {
    const div = document.createElement('div')
    div.classList.add('message',...classes)
    div.innerHTML =  content
    return div
}

// Handleoutgoing userMessages
function handleOutgoingMessage(event) {
    event.preventDefault()
    userData.message = messageInput.value.trim()
    messageInput.value = ""
    fileUploadWrapper.classList.remove('file-uploaded')

    // create and display user messages
    const messageContent = `<div class="message-text"></div>
            ${userData.file.data ? `<img class="attachment" src="data:${userData.file.mime_type};base64,${userData.file.data}"/>`: ""}`;
    
    const outGoingMessageDiv = createMessageElement(messageContent,"user-message")
    outGoingMessageDiv.querySelector('.message-text').textContent = userData.message;
    chatBody.appendChild(outGoingMessageDiv)
    chatBody.scrollTo({top: chatBody.scrollHeight,behavior: 'smooth'})

    setTimeout(() => {
        chatBody.scrollTo({top: chatBody.scrollHeight,behavior: 'smooth'})
        const messageContent = `<span class="bot-avatar">🤖</span>
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;
        const outGoingMessageDiv = createMessageElement(messageContent,"bot-message","thinking")
        chatBody.appendChild(outGoingMessageDiv)
        generateBotResponse(outGoingMessageDiv)
    },600)
}

// Handle enter key press for sending messages 
messageInput.addEventListener('keydown',function(event) {
    const userMessage = event.target.value.trim()

    if(event.key === 'Enter' && userMessage) {
        handleOutgoingMessage(event)
    }
})

sendMessageButton.addEventListener('click',handleOutgoingMessage)

fileInput.addEventListener('change',function(event) {
    const file = fileInput.files[0];
    if(!file) return;

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = (e) => {
        fileUploadWrapper.querySelector('img').src = e.target.result;
        fileUploadWrapper.classList.add('file-uploaded');
        const base64String = e.target.result.split(",")[1];
        userData.file = {
            "data": base64String,
            "mime_type":file.type
        }

        fileInput.value = ""
    }

})

fileCancelButton.addEventListener('click',(e) => {
    e.preventDefault()
    userData.file = {}
    fileUploadWrapper.classList.remove('file-uploaded')
})

const picker = new EmojiMart.Picker({ 
    theme:'light',
    skinTonePosition:'none',
    previewPosition:'none',
    onEmojiSelect: (emoji) => {
        const { selectionStart: start,selectionEnd: end } = messageInput
        messageInput.setRangeText(emoji.native,start,end,"end") 
        messageInput.focus()
    },
    onClickOutside: (e) => {
        if(e.target.id.includes('emoji-picker')) {
            document.body.classList.toggle('show-emoji-picker')
            return;
        }
        document.body.classList.remove('show-emoji-picker')
    }
})

document.querySelector('.chat-form').appendChild(picker)

fileUpload.addEventListener('click',
    function(event) {
        event.preventDefault()
        fileInput.click()
})