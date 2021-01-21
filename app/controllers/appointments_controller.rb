class AppointmentsController < ApplicationController
  before_action :authenticate_user!
  before_action :get_rooms
  before_action :set_room, only: :index
  before_action :set_appointment, only: [:show, :edit, :update, :destroy]

  # GET /appointments
  # GET /appointments.json
  def index
    @appointments = @current_room.present? ? @current_room.appointments : []
    respond_to do |format|
      format.html
      format.json
    end
  end

  # GET /appointments/1
  # GET /appointments/1.json
  def show
  end

  # GET /appointments/new
  def new
    @appointment = Appointment.new
  end

  # GET /appointments/1/edit
  def edit
  end

  # POST /appointments
  # POST /appointments.json
  def create
    @appointment = Appointment.new(appointment_params)
    @appointment.user = current_user
    
    respond_to do |format|
      if @appointment.save
        format.html { redirect_to appointments_path(room: @appointment.room.id), notice: 'Appointment was successfully created.' }
        format.json { render :show, status: :created, location: @appointment }
      else
        format.html { render :new }
        format.json { render json: @appointment.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /appointments/1
  # PATCH/PUT /appointments/1.json
  def update
    respond_to do |format|
      if @appointment.update(appointment_params)
        format.html { redirect_to @appointment, notice: 'Appointment was successfully updated.' }
        format.json { render :show, status: :ok, location: @appointment }
      else
        format.html { render :edit }
        format.json { render json: @appointment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /appointments/1
  # DELETE /appointments/1.json
  def destroy
    return head 401 if @appointment.user_id != current_user.id
    @appointment.destroy
    
    respond_to do |format|
      format.html { redirect_to appointments_url, notice: 'Appointment was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def get_rooms
      @rooms = Room.all
    end
    
    def set_room
      @current_room = params[:room].present? ? Room.find(params[:room]) : Room.first
    end
    
    def set_appointment
      @appointment = Appointment.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def appointment_params
      params.require(:appointment).permit(:name, :start, :end, :user_id, :room_id)
    end
end
