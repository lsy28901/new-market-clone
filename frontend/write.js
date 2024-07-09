const form = document.getElementById('write-form')

const handleSubmitForm = async (event) => {
    event.preventDefault();
    const body = new FormData(form);
    //세계 시간기준으로 보내준다
    body.append('insertAt', new Date().getTime());

    try {
        const res = await fetch('/items', {
            method: "post",
            body,
        })
        const data = await res.json();
        console.log(data)
        if (data === "200") {
            window.location.pathname = "/";
            console.log("데이터는 200입니다.")
        }
    } catch (error) {
        console.error(error);
    }

}


form.addEventListener("submit", handleSubmitForm)