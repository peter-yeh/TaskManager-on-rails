class Task < ApplicationRecord
    enum priority: [:High, :Medium, :Low]
  
    validates :name, presence: true
    validates :priority, presence: true
    validates :due, presence: true
  
  end
  