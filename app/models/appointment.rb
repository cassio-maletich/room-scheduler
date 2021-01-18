class Appointment < ApplicationRecord
  belongs_to :room
  validate :check_time_window, :check_conflict

  def check_time_window
    unless self.start.hour >= 8 && self.start.hour < 18 && self.end.hour > 8 && self.end.hour <= 18
      errors.add(:date, "Fora do horário permitido")
    end
  end

  def check_conflict
    if Appointment.where('id <> ?', self.id || 0).where(room_id: self.room_id).where('(start BETWEEN :st AND :end) OR (:st > "appointments"."start" AND :st < "appointments"."end")', { st: self.start.to_s, end: self.end.to_s }).present?
      errors.add(:date, "Conflito com outro evento marcado")
    end
  end
end
