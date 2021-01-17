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
    assert_difference('Appointment.count') do
      post appointments_url, params: { appointment: { start: @appointment.start + 1.hour, end: @appointment.end + 1.hour, name: @appointment.name, room_id: @room.id } }
    end

    assert_redirected_to appointment_url(Appointment.last)
  end

  test "should not create appointment 1" do
    assert_difference('Appointment.count', 0) do
      post appointments_url, params: { appointment: { start: @appointment.start, end: @appointment.end, name: @appointment.name, room_id: @room.id } }
    end
  end

  test "should not create appointment 2" do
    assert_difference('Appointment.count', 0) do
      post appointments_url, params: { appointment: { start: @appointment.start - 1.hour, end: @appointment.end, name: @appointment.name, room_id: @room.id } }
    end
  end

  test "should not create appointment 3" do
    assert_difference('Appointment.count', 0) do
      post appointments_url, params: { appointment: { start: @appointment.start - 15.minute, end: @appointment.end + 1.hour, name: @appointment.name, room_id: @room.id } }
    end
  end

  test "should not create appointment 4" do
    assert_difference('Appointment.count', 0) do
      post appointments_url, params: { appointment: { start: @appointment.start, end: @appointment.end, name: @appointment.name, room_id: @room2.id } }
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
