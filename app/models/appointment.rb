class Appointment < ApplicationRecord
  belongs_to :room
  validate :check_conflict

  def check_conflict
    if Appointment.where('id <> ?', self.id || 0).where(room_id: self.room_id).where('start BETWEEN ? AND ?', self.start.to_s, (self.end - 1.minute).to_s).present?
      errors.add(:date, "Conflito com outro evento marcado")
    end
  end
end
