require 'test_helper'

class AppointmentsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  setup do
    # a1: 2021-01-16 17:00:00 - 18:00:00
    @appointment = appointments(:one)
    @room = rooms(:one)
    @room2 = rooms(:two)
    sign_in users(:one)
  end

  test "should get index" do
    get appointments_url
    assert_response :success
  end

  test "should get new" do
    get new_appointment_url
    assert_response :success
  end

  test "should create appointment" do
    assert_difference 'Appointment.count' do     
      post appointments_url, params: { appointment: { start: @appointment.end, end: @appointment.end + 1.hour, name: @appointment.name, room_id: @room.id } }
    end

    assert_redirected_to appointment_url(Appointment.last)
  end

  test "should create appointment 2" do
    assert_difference 'Appointment.count' do
      dt = DateTime.new 2021, 1, 15, 8, 0, 0, '-3'
      post appointments_url, params: { appointment: { start: dt, end: dt + 10.hour, name: @appointment.name, room_id: @appointment.room_id } }
    end
  end

  test "should not create appointment 1" do
    assert_no_difference 'Appointment.count' do
      post appointments_url, params: { appointment: { start: @appointment.start, end: @appointment.end, name: @appointment.name, room_id: @room.id } }
    end
  end

  test "should not create appointment 2" do
    assert_no_difference 'Appointment.count' do
      post appointments_url, params: { appointment: { start: @appointment.start - 1.hour, end: @appointment.end, name: @appointment.name, room_id: @room.id } }
    end
  end

  test "should not create appointment 3" do
    assert_no_difference 'Appointment.count' do
      post appointments_url, params: { appointment: { start: @appointment.start - 15.minute, end: @appointment.end + 1.hour, name: @appointment.name, room_id: @room.id } }
    end
  end

  test "should not create appointment 4" do
    assert_no_difference 'Appointment.count' do
      post appointments_url, params: { appointment: { start: @appointment.start, end: @appointment.end, name: @appointment.name, room_id: @room2.id } }
    end
  end

  test "should not create appointment 5" do
    assert_no_difference 'Appointment.count' do
      post appointments_url, params: { appointment: { start: @appointment.start + 15.minute, end: @appointment.end, name: @appointment.name, room_id: @room2.id } }
    end
  end

  test "should not create appointment 6" do
    assert_no_difference 'Appointment.count' do
      post appointments_url, params: { appointment: { start: @appointment.start + 15.minute, end: @appointment.end + 1.hour, name: @appointment.name, room_id: @room2.id } }
    end
  end

  test "should not create appointment 7" do
    assert_no_difference 'Appointment.count' do
      post appointments_url, params: { appointment: { start: @appointment.start + 10.minute, end: @appointment.start + 30.minute, name: @appointment.name, room_id: @room.id } }
    end
  end

  test "should not create appointment 8 - outsite of working hours" do
    assert_no_difference 'Appointment.count' do
      dt = DateTime.new 2021, 1, 15, 20, 0, 0, '-3'
      post appointments_url, params: { appointment: { start: dt, end: dt + 10.hour, name: @appointment.name, room_id: @appointment.room_id } }
    end
  end

  test "should not create appointment 9 - outsite of working hours" do
    assert_no_difference 'Appointment.count' do
      dt = DateTime.new 2021, 1, 15, 10, 0, 0, '-3'
      post appointments_url, params: { appointment: { start: dt, end: dt + 10.hour, name: @appointment.name, room_id: @appointment.room_id } }
    end
  end

  test "should show appointment" do
    get appointment_url(@appointment)
    assert_response :success
  end

  test "should get edit" do
    get edit_appointment_url(@appointment)
    assert_response :success
  end

  test "should update appointment" do
    patch appointment_url(@appointment), params: { appointment: { start: @appointment.start, end: @appointment.end, name: @appointment.name, room_id: @appointment.room_id } }
    assert_redirected_to appointment_url(@appointment)
  end

  test "should destroy appointment" do
    assert_difference('Appointment.count', -1) do
      delete appointment_url(@appointment)
    end

    assert_redirected_to appointments_url
  end
end
