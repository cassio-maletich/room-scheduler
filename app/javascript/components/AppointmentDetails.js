import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'
import moment from 'moment'
import { customModalStyles } from './Constants'

class AppointmentDetails extends React.Component {
  constructor(props) {
    super(props)
    this.requestCloseModal = this.requestCloseModal.bind(this)
  }

  requestCloseModal() {
    this.props.callbackClose(true)
  }

  render () {
    return (
      <React.Fragment>
        <Modal
          isOpen={this.props.modal}
          onRequestClose={this.requestCloseModal}
          style={customModalStyles}
          ariaHideApp={false}
        >
          {!!this.props.current_event &&
            <div className="inner-modal-evt">
              <button className="inner-close" onClick={this.requestCloseModal} type="button" className="close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h2 className="mb-2">
                {this.props.current_event.name}
              </h2>
              <span>Sala reservada no seguinte horário: </span><br />
              <h4 className="text-center mb-3">{moment(this.props.current_event.start).format("DD-MM HH:mm")} até {moment(this.props.current_event.end).format("DD-MM HH:mm")}</h4>
              { this.props.current_user.id == this.props.current_event.user_id &&
                <button type="button" onClick={this.editEvent} className="btn btn-danger ml-auto d-block">Excluir reserva</button>
              }
            </div>
          }
        </Modal>
      </React.Fragment>
    );
  }
}

export default AppointmentDetails
