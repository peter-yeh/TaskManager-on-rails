class Task < ApplicationRecord
  enum priority: [:High, :Medium, :Low]

  validates :title, presence: true
  validates :priority, presence: true
  validates :due, presence: true

end
