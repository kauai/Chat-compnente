const messageInput = document.querySelector('.message-input')
const chatBody = document.querySelector('.chat-body')
const sendMessageButton = document.querySelector('#send-message')

const userData = {
    message:null
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

    setTimeout(() => {
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