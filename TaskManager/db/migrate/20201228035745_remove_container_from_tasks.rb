class RemoveContainerFromTasks < ActiveRecord::Migration[6.1]
  def change
    remove_reference :tasks, :container, null: false, foreign_key: true
  end
end
