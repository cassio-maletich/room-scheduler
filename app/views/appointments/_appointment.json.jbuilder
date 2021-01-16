json.extract! appointment, :id, :name, :date, :room_id, :created_at, :updated_at
json.url appointment_url(appointment, format: :json)
