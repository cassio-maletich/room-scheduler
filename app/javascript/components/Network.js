export const fetchAppointments = (url, callback) => {
    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((r) => {
            if (r.status == 200) {
                window.history.replaceState(null, "", url)
                r.json().then((data) => {
                    callback(data)
                })
            }
        })
        .catch((r) => {
            console.error("Não foi possível buscar a agenda", r.status, r)
        })
}