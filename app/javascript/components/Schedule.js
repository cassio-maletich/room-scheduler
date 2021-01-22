import React from "react"
import PropTypes from "prop-types"
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import { translations, csrfToken } from './Constants'
import RoomSelector from './RoomSelector'
import AppointmentDetails from './AppointmentDetails'
import { fetchAppointments, fetchRemoveAppointment, fetchCreateAppointment } from './Network'

const localizer = momentLocalizer(moment)

class Schedule extends React.Component {
  state = {
    appointments: [],
    current_room: this.props.current_room,
    current_event: null,
    current_event_modal: false,
    error: null
  }

  componentDidMount() {
    this.convertAppointments(this.props.appointments)
  }

  convertAppointments = (appointments) => {
    appointments.map((a) => {
      // js date obj conversion 
      a.start = moment(a.start).toDate()
      a.end = moment(a.end).toDate()
    })
    this.setState({ appointments })
  }

  setRoom = (room) => {
    if (this.state.current_room.id != room.id) {
      this.setState({ current_room: room })
      const url = `/appointments?room=${room.id}`
      fetchAppointments(url, this.convertAppointments)
    }
  }

  removeAppointment = () => {
    let { appointments, current_event } = this.state
    const url = `/appointments/${current_event.id}`
    fetchRemoveAppointment(url, () => {
      this.setState({
        appointments: appointments.filter((a) => a.id != current_event.id),
        current_event: null,
        current_event_modal: false
      })
    })
  }

  closeModal = () => {
    this.setState({ current_event_modal: false })
  }

  handleSelectCreation = ({ start, end }) => {
    const name = window.prompt('Nome do novo evento')
    if (!name) return
    if (start == end) {
      // handle all day creation
      start = moment(start).set({ h: 8 })
      end = moment(end).set({ h: 18 })
    }
    let appointment = {
      name,
      start, 
      end,
      room_id: this.state.current_room.id,
    }

    fetchCreateAppointment(appointment, this.callbackCreateSuccess, this.callbackCreateError)
  }

  callbackCreateSuccess = (appointment) => {
    this.setState({
      appointments: [ ...this.state.appointments, appointment ],
      error: null
    })
  }
  
  callbackCreateError = (error) => {
    this.setState({ error: error })
  }

  render () {
    return (
      <React.Fragment>
        <div>
          <h2>Agendamento de Sala</h2>

          <div className="d-flex mb-2">
            <div className="mr-auto">
              {/* Room selector */}
              <RoomSelector rooms={this.props.rooms} current={this.state.current_room} callbackRoom={this.setRoom} />
            </div>
            <div>
              {/* New appointment btn */}
              <a href={`/appointments/new?room_id=${this.state.current_room.id}`} className="btn btn-primary">Novo agendamento</a>
            </div>
          </div>

          {/* Calendar component */}
          <Calendar
            selectable
            localizer={localizer}
            events={this.state.appointments}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="name"
            messages={translations}
            culture='pt-br'
            style={{ height: 500 }}
            defaultView={Views.WEEK}
            onSelectEvent={event => this.setState({ current_event_modal: true, current_event: event })}
            onSelectSlot={this.handleSelectCreation}
          />

          {/* Appointment details modal */}
          <AppointmentDetails
            current_event={this.state.current_event} 
            current_user={this.props.current_user} 
            modal={this.state.current_event_modal} 
            callbackClose={this.closeModal}
            callbackRemove={this.removeAppointment}
          />

          {/* Feedback for creation error */}
          { !!this.state.error &&
            <div id="notice" class="alert alert-danger alert-dismissible fade show fixed-bottom mx-auto w-75" role="alert">
              { this.state.error }
              <button type="button" class="close" aria-label="Close" onClick={() => this.setState({ error: null })}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          }

        </div>
      </React.Fragment>
    )
  }
}

export default Schedule
