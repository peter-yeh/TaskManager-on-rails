class TasksController < ApplicationController

  def index
    @tasks = Task.order(params[:sort] + ' ' + params[:direction])
  end

  def show
    @task = Task.find(params[:id])
  end

  def new
    @task = Task.new
  end

  def create
    @task = Task.new(task_params)
    print "\n\n\nIn create method\n\n\n"

    if @task.save
      print "\n\nTask is saved\n\n"
      redirect_to @task
    else
      render :new
      print "\n\nTask cannot be saved!!!\n\n"
    end

    print "The task title is: "
    print @task.priority
    print "\n\n\n"

  end

  def edit
    @task = Task.find(params[:id])
  end

  def update
    @task = Task.find(params[:id])

    if @task.update(task_params)
      redirect_to @task
    else
      render :edit
    end
  end
  
  def destroy
    @task = Task.find(params[:id])
    @task.destroy

    redirect_to root_path
  end

  private
    def task_params
      params.require(:task).permit(:title, :body, :due, :priority, :tag)
    end

end
