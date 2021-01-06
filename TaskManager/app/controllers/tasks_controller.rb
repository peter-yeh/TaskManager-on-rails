class TasksController < ApplicationController
  helper_method :sort_column, :sort_direction

  def index
    # @tasks = Task.order(sort_column + ' ' + sort_direction)
    @tasks = Task.all.to_json
    # render json: Task.all

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

    print "The task isdone: "
    print @task.is_done
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
    task = Task.where("name LIKE :q OR due LIKE :q OR priority LIKE :q OR description LIKE :q OR tag LIKE :q OR created_at LIKE :q", q: "%#{keyword}%")

    @tasks = task.order(sort_column + ' ' + sort_direction)

  end

  private
    def task_params
      params.require(:task).permit(:name, :description, :due, :priority, :tag, :is_done)
    end

    def sort_column
      Task.column_names.include?(params[:sort]) ? params[:sort] : "name"
    end
    
    def sort_direction
      %w[asc desc].include?(params[:direction]) ? params[:direction] :"asc"
    end
  
end
