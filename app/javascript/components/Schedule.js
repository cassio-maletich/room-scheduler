import React from "react"
import PropTypes from "prop-types"
class Schedule extends React.Component {
  componentDidMount() {
    console.log("Init", this.props.appointments);
  }
  render () {
    return (
      <React.Fragment>
        <div>
          <h2>Schedule test</h2>
        </div>
      </React.Fragment>
    );
  }
}

export default Schedule
