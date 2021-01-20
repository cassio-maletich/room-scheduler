import React from "react"
import PropTypes from "prop-types"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { translations } from './Constants'
import RoomSelector from './RoomSelector'
import AppointmentDetails from './AppointmentDetails'

const localizer = momentLocalizer(moment)

class Schedule extends React.Component {
  state = {
    appointments: [],
    current_room: this.props.current_room,
    current_event: null,
    current_event_modal: false
  }

  componentDidMount() {
    this.convertAppointments(this.props.appointments)
  }

  convertAppointments = (appointments) => {
    appointments.map((a) => {
      // js date obj conversion 
      a.start = moment(a.start).toDate();
      a.end = moment(a.end).toDate();
    });
    this.setState({ appointments });
  }

  setRoom = (room) => {
    if (this.state.current_room.id != room.id) {
      this.setState({ current_room: room })
      const url = `/appointments?room=${room.id}`
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
              this.convertAppointments(data)
            })
          }
        })
        .catch((r) => {
          console.error("Não foi possível buscar a agenda", r.status, r)
        })
    }
  }

  closeModal = () => {
    this.setState({ current_event_modal: false })
  }

  render () {
    return (
      <React.Fragment>
        <div className="pt-2">
          <h2>Agenda da Sala</h2>

          {/* Room selector */}
          <RoomSelector rooms={this.props.rooms} current={this.state.current_room} callbackRoom={this.setRoom} />

          {/* Calendar component */}
          <Calendar
            localizer={localizer}
            events={this.state.appointments}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="name"
            messages={translations}
            culture='pt-br'
            style={{ height: 500 }}
            onSelectEvent={event => this.setState({ current_event_modal: true, current_event: event })}
          />

          {/* Appointment details modal */}
          <AppointmentDetails
            current_event={this.state.current_event} 
            current_user={this.props.current_user} 
            modal={this.state.current_event_modal} 
            callbackClose={this.closeModal}
          />

        </div>
      </React.Fragment>
    );
  }
}

export default Schedule
