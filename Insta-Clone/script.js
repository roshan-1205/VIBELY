 const sendBtn = document.querySelector("#send");
  const textBox = document.querySelector("#text-box");
  const chatBox = document.querySelector(".chat-area .message-box");
  
  sendBtn.addEventListener("change", function () {
    let message = textBox.value.trim();
    if (message !== "") {
      let div = document.createElement("div");
      div.classList.add("my-chat");
      div.textContent = message;
      chatBox.appendChild(div);

      textBox.value = "";
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    sendBtn.checked = false;
  });

  textBox.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendBtn.dispatchEvent(new Event("change"));
    }
  });