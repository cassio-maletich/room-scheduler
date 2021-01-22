Rails.application.routes.draw do
  devise_for :admins
  devise_for :users
  resources :appointments

  root to: "appointments#index"
end
