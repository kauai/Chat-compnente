const messageInput = document.querySelector('.message-input')
const chatBody = document.querySelector('.chat-body')
const sendMessageButton = document.querySelector('#send-message')

const GOOGLE_API_KEY = 'AIzaSyAd30F-BNqxkKYOVvmUpdALsDIV7P_HqL8'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`

const userData = {
    message:null
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
                    parts: [{ text: userData.message }]
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
    // create and display user messages
    const messageContent = `<div class="message-text"></div>`;
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