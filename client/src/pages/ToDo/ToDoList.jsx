import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { Button, Divider, Input, message, Modal, Tag, Tooltip, Select, Empty, DatePicker } from 'antd';
import { getErrorMessage } from '../../util/GetError';
import { getUserDetails } from '../../util/GetUser';
import ToDoservices from '../../services/toDoServices';
import { useNavigate } from 'react-router';
import { CheckCircleFilled, CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './ToDoList.css';

function ToDoList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allToDo, setAllToDo] = useState([]);
  const [currentEditItem, setCurrentEditItem] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [currentTaskType, setCurrentTaskType] = useState("ACTIVE");
  const [currentTodoTask, setCurrentTodoTask] = useState([]);
  const [filteredTodo, setFilteredTodo] = useState([]);
  const [deadline, setDeadline] = useState(null);

  const navigate = useNavigate();

  const getAllToDo = async () => {
    try {
      let user = getUserDetails();
      console.log(user?.userId);
      const response = await ToDoservices.getAllToDo(user?.userId);
      console.log(response.data);
      setAllToDo(response.data);
    } catch (err) {
      console.log(err);
      message.error(getErrorMessage(err));
    }
  };

  useEffect(() => {
    let user = getUserDetails();
    if (user && user?.userId) getAllToDo();
    else navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const now = new Date();
    const filtered = allToDo
      .map(item => {
        if (item.deadline && new Date(item.deadline) < now && item.status !== 'COMPLETE') {
          return {...item, status: 'EXPIRED'};
        }
        return item;
      })
      .filter(item => 
        currentTaskType === 'ALL' ? true : item.status === currentTaskType
      );
    setCurrentTodoTask(sortTasks(filtered));
  }, [allToDo, currentTaskType]);

  const handleSubmitTask = async () => {
    setLoading(true);
    try {
      const userId = getUserDetails()?.userId;
      const data = {
        title,
        description,
        status: 'ACTIVE',
        deadline: deadline ? new Date(deadline).toISOString() : new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        isCompleted: false,
        createdBy: userId
      };
      const response = await ToDoservices.createToDo(data);
      console.log(response.data);
      setLoading(false);
      message.success('To Do Task Added Successfully');
      setIsAdding(false);
      getAllToDo();
    } catch (err) {
      console.log(err);
      setLoading(false);
      message.error(getErrorMessage(err));
    }
  };

  const getFormattedDate = (value) => {
    if (!value) return 'No deadline';
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata'
    };
    return new Intl.DateTimeFormat('en-IN', options).format(date);
  };

  const handleEdit = (item) => {
    console.log(item);
    setCurrentEditItem(item);
    setUpdatedTitle(item?.title);
    setUpdatedDescription(item?.description);
    setUpdatedStatus(item?.isCompleted);
    setIsEditing(true);
  };

  const handleDelete = async (item) => {
    try {
      const response = await ToDoservices.deleteToDo(item._id);
      console.log(response.data);
      message.success(`${item.title} is deleted successfully!`);
      getAllToDo();
    } catch (err) {
      console.log(err);
      message.error(getErrorMessage(err));
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    console.log(id);
    try {
      const statusOrder = ['ACTIVE', 'IN_PROGRESS', 'COMPLETE', 'EXPIRED'];
      const currentIndex = statusOrder.indexOf(currentStatus);
      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
      const response = await ToDoservices.updateToDo(id, {
        status: nextStatus,
        isCompleted: nextStatus === 'COMPLETE'
      });
      console.log(response.data);
      message.success(`Task status updated to ${nextStatus}!`);
      getAllToDo();
    } catch (err) {
      console.log(err);
      message.error(getErrorMessage(err));
    }
  };

  const handleUpdateTask = async () => {
    try {
      setLoading(true);
      const data = {
        title: updatedTitle,
        description: updatedDescription,
        status: updatedStatus,
        isCompleted: updatedStatus === 'COMPLETE'
      };
      console.log(data);
      const response = await ToDoservices.updateToDo(currentEditItem._id, data);
      console.log(response.data);
      message.success(`${currentEditItem?.title} updated successfully!`);
      setLoading(false);
      setIsEditing(false);
      getAllToDo();
    } catch (err) {
      console.log(err);
      setLoading(false);
      message.error(getErrorMessage(err));
    }
  };

  const handleTypeChange = (value) => {
    console.log(value);
    setCurrentTaskType(value);
    const filtered = allToDo.filter(item => 
      value === 'ALL' ? true : item.status === value
    );
    setCurrentTodoTask(sortTasks(filtered));
  };

  const handleSearch = (e) => {
    let query = e.target.value.toLowerCase();
    let filteredList = allToDo.filter((item) => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
    setFilteredTodo(query ? filteredList : []);
  };

  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      const deadlineA = a.deadline ? new Date(a.deadline) : new Date(8640000000000000);
      const deadlineB = b.deadline ? new Date(b.deadline) : new Date(8640000000000000);
      if (deadlineA !== deadlineB) return deadlineA - deadlineB;
      const statusOrder = ['ACTIVE', 'IN_PROGRESS', 'COMPLETE', 'EXPIRED'];
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    });
  };

  return (
    <>
      <Navbar active={"myTask"}/>
      <section className="todo-container">
        <div className="todo-content">
          <div className="todo-header">
            <h2 className="todo-title">Your Tasks</h2>
            <div className="todo-controls">
              <Input 
                onChange={handleSearch} 
                placeholder='Search your task here...'
                className="todo-search"
              />
              <Button 
                onClick={() => setIsAdding(true)} 
                type='primary' 
                size='large'
                className="todo-add-button"
              >
                Add Task
              </Button>
              <Select 
                size='large' 
                value={currentTaskType} 
                onChange={handleTypeChange} 
                className="todo-select"
                options={[
                  { value: "ALL", label: 'All Tasks' },
                  { value: "ACTIVE", label: 'Active' },
                  { value: "IN_PROGRESS", label: 'In Progress' },
                  { value: "COMPLETE", label: 'Complete' },
                  { value: "EXPIRED", label: 'Expired' }
                ]} 
              />
            </div>
          </div>
          <Divider/>
          <div className="task-list">
            {filteredTodo.length > 0 ? filteredTodo.map((item) => {
              return (
                <div key={item?._id} className="todo-task">
                  <div className="task-header">
                    <div className="task-details">
                      <div className="task-title-wrapper">
                        <h3 className="task-title">{item?.title}</h3>
                        <Tag color={
                          item?.status === 'ACTIVE' ? 'blue' :
                          item?.status === 'IN_PROGRESS' ? 'orange' :
                          item?.status === 'COMPLETE' ? 'green' :
                          'red'
                        }>
                          {item?.status}
                        </Tag>
                      </div>
                      <p className="task-description">{item?.description}</p>
                      <Tag className="task-deadline">
                        {getFormattedDate(item?.deadline)}
                      </Tag>
                    </div>
                    <div className="task-actions">
                      <Tooltip title="Edit task?">
                        <EditOutlined 
                          onClick={() => handleEdit(item)} 
                          className="task-action-icon edit"
                        />
                      </Tooltip>
                      <Tooltip title="Delete task?">
                        <DeleteOutlined 
                          onClick={() => handleDelete(item)} 
                          className="task-action-icon delete"
                        />
                      </Tooltip>
                      <Tooltip title="Update status">
                        {item?.status === 'COMPLETE' ? 
                          <CheckCircleFilled 
                            onClick={() => handleUpdateStatus(item._id, item.status)} 
                            className="task-action-icon status complete"
                          />
                          : 
                          <CheckCircleOutlined 
                            onClick={() => handleUpdateStatus(item._id, item.status)} 
                            className="task-action-icon status"
                          />
                        }
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            }) : currentTodoTask.length > 0 ? currentTodoTask.map((item) => {
              return (
                <div key={item?._id}>
                  <div>
                    <div>
                      <h3>{item?.title}</h3>
                      <Tag color={
                        item?.status === 'ACTIVE' ? 'blue' :
                        item?.status === 'IN_PROGRESS' ? 'orange' :
                        item?.status === 'COMPLETE' ? 'green' :
                        'red'
                      }>
                        {item?.status}
                      </Tag>
                    </div>
                    <p>{item?.description}</p>
                  </div>
                  <div>
                    <Tag>{getFormattedDate(item?.deadline)}</Tag>
                    <div>
                      <Tooltip title="Edit task?"><EditOutlined onClick={() => handleEdit(item)} /> </Tooltip>
                      <Tooltip title="Delete task?"><DeleteOutlined onClick={() => handleDelete(item)} /></Tooltip>
                      <Tooltip title="Update status">
                        {item?.status === 'COMPLETE' ? 
                          <CheckCircleFilled onClick={() => handleUpdateStatus(item._id, item.status)} />
                          : 
                          <CheckCircleOutlined onClick={() => handleUpdateStatus(item._id, item.status)} />
                        }
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="p-8 bg-white rounded-lg shadow-sm">
                <Empty description="No tasks found"/>
              </div>
            )}
          </div>
          <Modal confirmLoading={loading} title="Add new todo Task" open={isAdding} onOk={handleSubmitTask} onCancel={() => setIsAdding(false)}>
            <Input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)}/>
            <Input.TextArea placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
            <Select 
              placeholder="Select status" 
              defaultValue="ACTIVE" 
              options={[
                { value: 'ACTIVE', label: 'Active', key: 'ACTIVE' },
                { value: 'IN_PROGRESS', label: 'In Progress', key: 'IN_PROGRESS' },
                { value: 'COMPLETE', label: 'Complete', key: 'COMPLETE' },
                { value: 'EXPIRED', label: 'Expired', key: 'EXPIRED' }
              ]}
            />
            <DatePicker 
              placeholder="Select deadline" 
              showTime 
              style={{ width: '100%' }}
              onChange={(date) => setDeadline(date)} 
            />
          </Modal>
          <Modal confirmLoading={loading} title={`Update ${currentEditItem.title}`} open={isEditing} onOk={handleUpdateTask} onCancel={() => setIsEditing(false)}>
            <Input placeholder='Updated Title' value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} />
            <Input.TextArea placeholder='Updated Description' value={updatedDescription} onChange={(e) => setUpdatedDescription(e.target.value)}/>
            <Select 
              placeholder="Select status" 
              value={updatedStatus} 
              onChange={(value) => setUpdatedStatus(value)} 
              options={[
                { value: 'ACTIVE', label: 'Active', key: 'ACTIVE' },
                { value: 'IN_PROGRESS', label: 'In Progress', key: 'IN_PROGRESS' },
                { value: 'COMPLETE', label: 'Complete', key: 'COMPLETE' },
                { value: 'EXPIRED', label: 'Expired', key: 'EXPIRED' }
              ]}
            />
            <DatePicker 
              placeholder="Select deadline" 
              showTime 
              style={{ width: '100%' }} 
            />
          </Modal>
        </div>
      </section>
    </>
  );
}

export default ToDoList;