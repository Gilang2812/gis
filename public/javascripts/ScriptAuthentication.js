function login() {
    document.getElementById("login").addEventListener('submit', (event) => {
        event.preventDefault()
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let email = document.getElementById('email').value
        let password = document.getElementById('password').value
        var raw = JSON.stringify({
            "email": email,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3000/login", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if (result.message ) {
                    let role = result.role
                    console.log(role)
                    let token=result.token
                  
                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem("role", role);
                    localStorage.setItem("flashMessage", result.message);
                    if(role==='asisten'){
                        window.location=`/${role}/index`
                    }else if(role==='praktikan'){
                        window.location=`/${role}/tugas`

                    }
                } else if(result.error){
                    alert("gagal : " + result.error)
                }
            })
            .catch(error => {
                console.log('error', error)
                alert(error)
            });
    })
}

login();