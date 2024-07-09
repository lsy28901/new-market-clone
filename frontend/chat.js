function displayChat(chat) {
    const ul = document.querySelector("#chat-ul");
    const li = document.createElement("li");
    li.innerText = ` ${chat.content}`;
    ul.appendChild(li);
}

async function readChat() {
    const res = await fetch("/chats");
    const jsonRes = await res.json();
    const ul = document.querySelector("#chat-ul");
    ul.innerHTML = "";
    jsonRes.forEach(displayChat);
}


async function createChat(value) {
    const res = await fetch("/chat", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: new Date().getTime().toString(),
            content: value,
        }),
    });
    readChat()
}

const handleSubmitForm = async (event) => {
    event.preventDefault();
    const input = document.querySelector('#content')
    createChat(input.value);
    input.value = "";
}

const chatform = document.getElementById("chat-form")
chatform.addEventListener("submit", handleSubmitForm)
readChat() 