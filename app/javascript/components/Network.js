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

export const fetchCreateAppointment = (appointment, callbackCreateSuccess, callbackCreateError) => {
    console.log('[fetchCreateAppointment] appointment', appointment)

    fetch('/appointments/', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ appointment })
    })
      .then((r) => {
        const { status } = r
        r.json().then((data) => {
          if (status == 201) {
            appointment['id'] = data['id']
            appointment['user_id'] = data['user_id']
            callbackCreateSuccess(appointment)
          } else if (status == 422) {
            console.log('Erro na criação', data['error'], data)
            callbackCreateError(data['error'])
          } else {
            console.error('Erro', data)
            callbackCreateError(data['error'])
          }
        })
      })
      .catch((e) => {
        console.error('Não foi possível criar o evento', e)
      })
}