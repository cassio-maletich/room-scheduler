class AddStartEndDateToAppointment < ActiveRecord::Migration[6.0]
  def change
    add_column :appointments, :start, :datetime
    add_column :appointments, :end, :datetime
    # remove old col
    remove_column :appointments, :date
  end
end
