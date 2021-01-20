import React from "react"
import PropTypes from "prop-types"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Modal from 'react-modal';

const localizer = momentLocalizer(moment)
const TRANSLATIONS = {
  month: 'Mês',
  day: 'Dia',
  week: 'Semana',
  today: 'Hoje',
  previous: '<',
  next: '>',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  showMore: function showMore(total) {
    return "+" + total + " eventos";
  }
}

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 101
  }
}

class Schedule extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      appointments: [],
      current_room: this.props.current_room
    }
    this.setRoom = this.setRoom.bind(this)
  }

  componentDidMount() {
    const appointments = this.props.appointments
    appointments.map((a) => {
      // js date obj conversion 
      a.start = moment(a.start).toDate();
      a.end = moment(a.end).toDate();
    })
    this.setState({ appointments })
  }

  setRoom(room) {
    console.log('room', room)
    this.setState({ current_room: room })
    fetch(`/?room=${room.id}`, { headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }})
      .then((r) => {
        if (r.status == 200) {
          r.json().then((data) => {
            this.setState({ appointments: data })
          })
        }
      })
      
  }

  render () {
    return (
      <React.Fragment>
        <div className="pt-2">
          {/* Room selector */}
          <div>
            <h2>Agenda da Sala</h2>
            <div className="btn-group btn-group-toggle mb-4">
              { this.props.rooms.map((room, idx) => {
                  return(
                    <button key={idx} className={`btn btn-primary ${ room.id == this.state.current_room.id && 'active' }`} onClick={() => this.setRoom(room)}>
                      { room.name }
                    </button>
                  )
                })
              }
            </div>
          </div>

          {/* Calendar component */}
          <Calendar
            localizer={localizer}
            events={this.state.appointments}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="name"
            messages={TRANSLATIONS}
            culture='pt-br'
            style={{ height: 500 }}
            onSelectEvent={event => this.setState({ evtModal: true, evtSelected: event })}
          />

          {/* appointment details modal */}
          <Modal
            isOpen={this.state.evtModal}
            onRequestClose={this.closeModal}
            style={customModalStyles}
            ariaHideApp={false}
          >
            {!!this.state.evtSelected &&
              <div className="inner-modal-evt">
                <button className="inner-close" onClick={() => this.setState({ evtModal: false })} type="button" className="close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h2 className="mb-2">
                  {this.state.evtSelected.name}
                </h2>
                <span>Sala reservada no seguinte horário: </span><br/>
                <h4 className="text-center mb-3">{moment(this.state.evtSelected.start).format("DD-MM HH:mm")} até {moment(this.state.evtSelected.end).format("DD-MM HH:mm")}</h4>
                { this.props.current_user.id == this.state.evtSelected.user_id &&
                  <button type="button" onClick={this.editEvent} className="btn btn-danger ml-auto d-block">Excluir reserva</button>
                }
              </div>
            }
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default Schedule
