import React from "react"
import PropTypes from "prop-types"
class RoomSelector extends React.Component {
  callbackSetRoom(room) {
    this.props.callbackRoom(room)
  }

  render () {
    return (
      <React.Fragment>
        <div>
          <div className="btn-group btn-group-toggle">
            {this.props.rooms.map((room, idx) => {
              return (
                <button key={idx} className={`btn btn-primary ${room.id == this.props.current.id && 'active'}`} onClick={() => this.callbackSetRoom(room)}>
                  { room.name }
                </button>
              )
            })
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RoomSelector
