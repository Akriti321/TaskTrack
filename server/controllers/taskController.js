const mongoose = require('mongoose');
const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const priorityRank = { High: 3, Medium: 2, Low: 1 };
const statusRank = { Pending: 1, 'In Progress': 2, Completed: 3 };
const sortMap = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  dueAsc: { dueDate: 1, createdAt: -1 },
  dueDesc: { dueDate: -1, createdAt: -1 },
  alphaAsc: { title: 1 },
  alphaDesc: { title: -1 },
};

const normalizeTaskPayload = (body) => ({
  title: typeof body.title === 'string' ? body.title.trim() : body.title,
  description:
    typeof body.description === 'string' ? body.description.trim() : body.description,
  status: body.status,
  priority: body.priority,
  dueDate: body.dueDate || null,
});

const buildTaskQuery = (req) => {
  const query = { user: req.user._id };
  const { search, status, priority, dueDate, overdue } = req.query;

  if (search?.trim()) {
    query.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  if (status && status !== 'All') query.status = status;
  if (priority && priority !== 'All') query.priority = priority;

  const now = new Date();
  if (overdue === 'true') {
    query.dueDate = { $lt: now };
    query.status = { $ne: 'Completed' };
  } else if (dueDate === 'today') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    query.dueDate = { $gte: start, $lt: end };
  } else if (dueDate === 'tomorrow') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    query.dueDate = { $gte: start, $lt: end };
  } else if (dueDate === 'week') {
    const end = new Date();
    end.setDate(end.getDate() + 7);
    query.dueDate = { $gte: now, $lte: end };
  } else if (dueDate === 'none') {
    query.dueDate = null;
  }

  return query;
};

const sortInMemory = (tasks, sort) => {
  if (sort === 'priority') {
    return tasks.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
  }
  if (sort === 'status') {
    return tasks.sort((a, b) => statusRank[a.status] - statusRank[b.status]);
  }
  return tasks;
};

const getTasks = asyncHandler(async (req, res) => {
  const sort = req.query.sort || 'newest';
  const query = buildTaskQuery(req);
  let tasks = await Task.find(query).sort(sortMap[sort] || sortMap.newest);
  tasks = sortInMemory(tasks, sort);

  sendSuccess(res, 200, 'Tasks loaded', tasks, {
    count: tasks.length,
    activeSort: sort,
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid task id' });
  }

  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  sendSuccess(res, 200, 'Task loaded', task);
});

const createTask = asyncHandler(async (req, res) => {
  const payload = normalizeTaskPayload(req.body);

  if (!payload.title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  const task = await Task.create({ ...payload, user: req.user._id });
  sendSuccess(res, 201, 'Task created', task);
});

const updateTask = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid task id' });
  }

  const payload = normalizeTaskPayload(req.body);

  if (Object.prototype.hasOwnProperty.call(payload, 'title') && !payload.title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  sendSuccess(res, 200, 'Task updated', task);
});

const deleteTask = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid task id' });
  }

  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  sendSuccess(res, 200, 'Task deleted successfully');
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
