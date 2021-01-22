import { csrfToken } from './Constants'

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

export const fetchRemoveAppointment = (url, callback) => {
    fetch(url, {
        method: 'DELETE',
        headers: {
            "X-CSRF-Token": csrfToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((r) => {
            console.log('r', r)
            if (r.status == 204) {
                callback()
            }
        })
        .catch((e) => {
            console.error("Não foi possível deletar o evento", current_event, e)
        })

}