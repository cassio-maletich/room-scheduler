class CreateAppointments < ActiveRecord::Migration[6.0]
  def change
    create_table :appointments do |t|
      t.string :name
      t.datetime :date
      t.belongs_to :room, null: false, foreign_key: true

      t.timestamps
    end
    add_index :appointments, :date, unique: true
  end
end
