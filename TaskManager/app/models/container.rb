class Container < ApplicationRecord
    has_many :tasks

    validates :name, presence: true
    # A tasks with a due date is more likely to be completed
    # validates :due, presence: true
end
