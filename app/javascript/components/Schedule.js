import React from "react"
import PropTypes from "prop-types"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

class Schedule extends React.Component {
  state = {
    appointments: []
  }

  componentDidMount() {
    const appointments = this.props.appointments
    appointments.map((a) => {
      a.start = moment(a.date).toDate();
      a.end = moment(a.date).add(30, "minutes").toDate();
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
            style={{ height: 500 }}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Schedule
