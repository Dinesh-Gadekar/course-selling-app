import Course from "../models/course.js";

// ✅ Create a new course (Admin only)
export const createCourse = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const course = await Course.create({
      title,
      description,
      price,
      instructor: req.user._id, // admin who creates it
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name email");
    if (course) res.json(course);
    else res.status(404).json({ message: "Course not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update course
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;
    course.price = req.body.price || course.price;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Enroll user in course
export const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.students.includes(req.user._id)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.students.push(req.user._id);
    await course.save();

    res.json({ message: "Enrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
