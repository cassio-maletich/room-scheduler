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

  removeItem = () => {
    console.log('removeItem')
    let { appointments, current_event } = this.state
    console.log('removeItem', current_event)
    console.log('removeItem 2', appointments)
    console.log('removeItem 2', appointments.filter((a) => a.id != current_event.id))
    this.setState({
      appointments: appointments.filter((a) => a.id != current_event.id ),
      current_event: null,
      current_event_modal: false
    })
    console.log('closinggg Modal')
  }

  closeModal = () => {
    this.setState({ current_event_modal: false })
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
            callbackRemove={this.removeItem}
          />

        </div>
      </React.Fragment>
    );
  }
}

export default Schedule
