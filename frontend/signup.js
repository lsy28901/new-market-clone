const form = document.querySelector("#signup-form");

const checkPassword = () => {
    const formData = new FormData(form);
    const password1 = formData.get("password");
    const password2 = formData.get("password2");
    if (password1 === password2) {
        return true;
    } else {
        return false;
    }
}

const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const sha256Pw = sha256(formData.get("password"));
    formData.set("password", sha256Pw);

    const info = document.querySelector("#info");

    if (checkPassword()) {
        const res = await fetch('/signup', {
            method: 'post',
            body: formData,
        });
        const data = await res.json();

        if (data === "200") {
            info.innerText = "회원가입에 성공했습니다.";
            info.style.color = "blue";
            alert("회원 가입에 성공했습니다.");
            window.location.pathname = "/login.html";
        }
    } else {
        info.innerText = "비밀번호가 일치하지 않습니다.";
        info.style.color = "red";
        form.appendChild(info);
    }


}


form.addEventListener("submit", handleSubmit);