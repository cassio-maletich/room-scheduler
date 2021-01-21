import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'
import moment from 'moment'
import { customModalStyles, csrfToken } from './Constants'

class AppointmentDetails extends React.Component {
  requestCloseModal = () => {
    this.props.callbackClose(true)
  }

  removeAppointment = (id) => {
    console.log('id', id)
    const url = `/appointments/${id}`
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
          this.props.callbackRemove()
        }
      })
      .catch((r) => {
        console.error("Não foi possível deletar a agenda", id, r)
      })
  }

  render () {
    let { current_event } = this.props
    return (
      <React.Fragment>
        <Modal
          isOpen={this.props.modal}
          onRequestClose={this.requestCloseModal}
          style={customModalStyles}
          ariaHideApp={false}
        >
          {!!current_event &&
            <div className="inner-modal-evt">
              <button className="inner-close" onClick={this.requestCloseModal} type="button" className="close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h2 className="mb-2">
                {current_event.name}
              </h2>
              <label>Data:</label><br />
              <h4 className="mb-3">{moment(current_event.start).format("DD-MM-YYYY")}</h4>
              <label>Hora:</label><br />
              <h5 className="mb-3">{moment(current_event.start).format("HH:mm")} até {moment(current_event.end).format("HH:mm")}</h5>
              { this.props.current_user.id == current_event.user_id &&
                <button type="button" onClick={() => this.removeAppointment(current_event.id)} className="btn btn-danger ml-auto d-block">Excluir reserva</button>
              }
            </div>
          }
        </Modal>
      </React.Fragment>
    );
  }
}

export default AppointmentDetails
