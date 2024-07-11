const form = document.querySelector("#login-form");


const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const sha256Pw = sha256(formData.get("password"));
    formData.set("password", sha256Pw);

    const res = await fetch('/login', {
        method: 'post',
        body: formData,
    });
    const data = await res.json();
    console.log(data)

    const accessToken = data.access_token;
    window.localStorage.setItem("token", accessToken);
    alert("로그인 되었습니다!")

    window.location.pathname = "/";
}


form.addEventListener("submit", handleSubmit);