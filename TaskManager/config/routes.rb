Rails.application.routes.draw do
  root "tasks#index"

  resources :tasks
  # resources :containers do
  #   resources :tasks
  # end

end
