class Appointment < ApplicationRecord
  belongs_to :room
  belongs_to :user
  validate :check_day, :check_day_window, :check_time_window, :check_conflict

  def check_day
    if self.start.day != self.end.day
      errors.add(:date, "Deve ser no mesmo dia")
    end
  end
  
  def check_day_window
    excluded_days = [0, 6]
    if excluded_days.any? { |ed| ed == self.start.wday || ed == self.end.wday }
      errors.add(:date, "Fora dos dias permitidos")
    end
  end

  def check_time_window
    unless self.start.hour >= 8 && self.start.hour < 18 && self.end.hour > 8 && self.end.hour <= 18
      errors.add(:date, "Fora do horário permitido")
    end
  end
  
  def check_conflict
    if Appointment.where(room_id: self.room_id).where('(start >= :st AND start < :end) OR ("appointments"."start" <= :st AND "appointments"."end" > :st)', { st: self.start.to_s, end: self.end.to_s }).present?
      errors.add(:date, "Conflito com outro evento marcado")
    end
  end
end
