class Appointment < ApplicationRecord
  belongs_to :room
  validates_uniqueness_of :date, scope: :room_id
end
