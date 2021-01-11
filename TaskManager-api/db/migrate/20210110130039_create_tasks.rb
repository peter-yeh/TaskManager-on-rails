class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.string :name
      t.string :description
      t.datetime :due
      t.integer :priority
      t.string :tag
      t.boolean :done

      t.timestamps
    end
  end
end
