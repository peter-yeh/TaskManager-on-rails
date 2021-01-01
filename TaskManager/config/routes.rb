Rails.application.routes.draw do
  root "tasks#index"

  get "/search", to: "tasks#search"

  resources :tasks

end
