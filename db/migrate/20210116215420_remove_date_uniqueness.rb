class RemoveDateUniqueness < ActiveRecord::Migration[6.0]
  def change
    remove_index :appointments, :date
  end
end
