import React from "react"
import PropTypes from "prop-types"
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import { translations, csrfToken } from './Constants'
import RoomSelector from './RoomSelector'
import AppointmentDetails from './AppointmentDetails'

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

  handleSelectCreation = ({ start, end }) => {
    const title = window.prompt('Nome do novo evento')
    let appointment = {
      name: title,
      room_id: this.state.current_room.id,
      start, 
      end
    }
    console.log('title', appointment)
    if (title) {
      fetch('/appointments/', {
        method: 'POST',
        headers: {
          "X-CSRF-Token": csrfToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          appointment: appointment
        })
      })
        .then((r) => {
          console.log('r', r.text)
          const status = r.status;

          return r.text().then((data) => {
            if (status == 201) {
              console.log('data', data)
              this.setState({
                appointments: [
                  ...this.state.appointments,
                  {
                    ...appointment,
                    id: data,
                    user_id: this.props.current_user.id
                  },
                ],
                error: null
              })
            } else {
              console.log("Erro na criação", data);
              this.setState({ error: data })
            }
          })
        })
        .catch((r) => {
          console.error("Não foi possível criar o evento", r)
        })
    }
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
            callbackRemove={this.removeItem}
          />

          {/* Feedback for creation error */}
          { !!this.state.error &&
            <div id="notice" class="alert alert-danger alert-dismissible fixed-bottom mx-auto w-75 fade show" role="alert">
              { this.state.error }
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          }

        </div>
      </React.Fragment>
    );
  }
}

export default Schedule
