import React from "react"
import PropTypes from "prop-types"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

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

class Schedule extends React.Component {
  state = {
    appointments: []
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

          <Calendar
            localizer={localizer}
            events={this.state.appointments}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="name"
            messages={TRANSLATIONS}
            culture='pt-br'
            style={{ height: 500 }}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Schedule
