class ContainersController < ApplicationController
  def index
    @containers = Container.all
  end

  def show
    @container = Container.find(params[:id])
  end

end
