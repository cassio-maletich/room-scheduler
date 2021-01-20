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
  state = {
    appointments: [],
    current_room: this.props.current_room
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

  render () {
    return (
      <React.Fragment>
        <div>
          <h2>Agenda da Sala</h2>

          <div className="btn-group btn-group-toggle mb-4">
            { this.props.rooms.map((event, idx) => {
                return(
                  <label key={idx} className={`btn btn-secondary ${ event.id == this.state.current_room.id ? 'active' : '' }`}>
                    <input type="radio" name="options" id="option1" autoComplete="off" /> { event.name }
                  </label>
                )
              })
            }
          </div>

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
