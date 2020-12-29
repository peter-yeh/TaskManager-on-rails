class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.string :title
      t.text :body
      t.datetime :due
      t.integer :priority
      t.text :tag

      t.timestamps
    end
  end
end
