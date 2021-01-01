class TasksController < ApplicationController
  helper_method :sort_column, :sort_direction

  def index
    @tasks = Task.order(sort_column + ' ' + sort_direction)
    # @tasks = Task.search(params[:search])
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

  def search
    keyword = params[:input]
    task = Task.where("title LIKE ?", "%#{keyword}%")
    @tasks = task.order(sort_column + ' ' + sort_direction)

  end

  private
    def task_params
      params.require(:task).permit(:title, :body, :due, :priority, :tag)
    end

    def sort_column
      Task.column_names.include?(params[:sort]) ? params[:sort] : "title"
    end
    
    def sort_direction
      %w[asc desc].include?(params[:direction]) ? params[:direction] :"asc"
    end
  
end
