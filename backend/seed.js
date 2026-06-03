const User = require('./models/User');
const Employee = require('./models/Employee');
const Leave = require('./models/Leave');
const Payroll = require('./models/Payroll');
const PerformanceTask = require('./models/PerformanceTask');
const Appraisal = require('./models/Appraisal');
const Announcement = require('./models/Announcement');
const Ticket = require('./models/Ticket');
const Course = require('./models/Course');
const Onboarding = require('./models/Onboarding');

const employees = [
  { firstName: 'Ravi', lastName: 'Sharma', email: 'ravi.sharma@ems.com', phone: '9876543210', department: 'Engineering', position: 'Sr. Developer', salary: 1200000, shift: 'Morning', joinDate: '2021-03-15', status: 'Active' },
  { firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@ems.com', phone: '9876543211', department: 'Marketing', position: 'Marketing Head', salary: 1500000, shift: 'Morning', joinDate: '2020-06-01', status: 'Active' },
  { firstName: 'Amit', lastName: 'Verma', email: 'amit.verma@ems.com', phone: '9876543212', department: 'Engineering', position: 'Frontend Developer', salary: 900000, shift: 'Morning', joinDate: '2022-01-10', status: 'Active' },
  { firstName: 'Sneha', lastName: 'Reddy', email: 'sneha.reddy@ems.com', phone: '9876543213', department: 'HR', position: 'HR Manager', salary: 1100000, shift: 'Morning', joinDate: '2021-07-20', status: 'Active' },
  { firstName: 'Vikram', lastName: 'Singh', email: 'vikram.singh@ems.com', phone: '9876543214', department: 'Finance', position: 'Finance Analyst', salary: 850000, shift: 'Morning', joinDate: '2022-03-05', status: 'Active' },
  { firstName: 'Ananya', lastName: 'Gupta', email: 'ananya.gupta@ems.com', phone: '9876543215', department: 'Engineering', position: 'Backend Developer', salary: 1300000, shift: 'Evening', joinDate: '2021-11-15', status: 'Active' },
  { firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh.kumar@ems.com', phone: '9876543216', department: 'Sales', position: 'Sales Executive', salary: 700000, shift: 'Morning', joinDate: '2023-02-01', status: 'Active' },
  { firstName: 'Deepika', lastName: 'Nair', email: 'deepika.nair@ems.com', phone: '9876543217', department: 'Design', position: 'UI/UX Designer', salary: 950000, shift: 'Evening', joinDate: '2022-06-15', status: 'Active' },
  { firstName: 'Arjun', lastName: 'Menon', email: 'arjun.menon@ems.com', phone: '9876543218', department: 'Engineering', position: 'DevOps Engineer', salary: 1400000, shift: 'Night', joinDate: '2021-05-10', status: 'Active' },
  { firstName: 'Kavya', lastName: 'Iyer', email: 'kavya.iyer@ems.com', phone: '9876543219', department: 'HR', position: 'HR Executive', salary: 600000, shift: 'Morning', joinDate: '2023-03-01', status: 'Active' },
  { firstName: 'Manish', lastName: 'Joshi', email: 'manish.joshi@ems.com', phone: '9876543220', department: 'Marketing', position: 'Content Writer', salary: 550000, shift: 'Evening', joinDate: '2023-04-10', status: 'Active' },
  { firstName: 'Neha', lastName: 'Kapoor', email: 'neha.kapoor@ems.com', phone: '9876543221', department: 'Finance', position: 'Accountant', salary: 650000, shift: 'Morning', joinDate: '2022-09-01', status: 'Inactive' },
  { firstName: 'Rohit', lastName: 'Deshmukh', email: 'rohit.deshmukh@ems.com', phone: '9876543222', department: 'Sales', position: 'Sales Manager', salary: 1200000, shift: 'Morning', joinDate: '2021-04-01', status: 'Active' },
  { firstName: 'Pooja', lastName: 'Mehta', email: 'pooja.mehta@ems.com', phone: '9876543223', department: 'Design', position: 'Graphic Designer', salary: 700000, shift: 'Night', joinDate: '2022-11-15', status: 'Active' },
  { firstName: 'Karan', lastName: 'Malhotra', email: 'karan.malhotra@ems.com', phone: '9876543224', department: 'Engineering', position: 'Full Stack Developer', salary: 1600000, shift: 'Morning', joinDate: '2020-08-01', status: 'Active' },
  { firstName: 'Isha', lastName: 'Agarwal', email: 'isha.agarwal@ems.com', phone: '9876543225', department: 'Marketing', position: 'SEO Specialist', salary: 600000, shift: 'Morning', joinDate: '2023-05-20', status: 'Inactive' },
];

const announcements = [
  { title: 'Company-wide Town Hall Meeting', content: 'Join us for the quarterly town hall meeting this Friday at 3 PM in the main conference room.', author: 'Admin', dept: 'All', priority: 'High', date: '2024-01-15', comments: 12 },
  { title: 'Annual Day Celebrations', content: 'Annual day is scheduled for March 15th. Start preparing your performances!', author: 'Admin', dept: 'All', priority: 'Medium', date: '2024-01-12', comments: 8 },
  { title: 'New Leave Policy Update', content: 'Effective from Feb 1st, the casual leave quota has been increased to 15 days per year.', author: 'HR', dept: 'HR', priority: 'High', date: '2024-01-10', comments: 15 },
  { title: 'Office Closed on Republic Day', content: 'Office will remain closed on January 26th on account of Republic Day.', author: 'Admin', dept: 'All', priority: 'Medium', date: '2024-01-08', comments: 3 },
  { title: 'Team Outing', content: 'Team outing to Lonavala is planned for Feb 10th. Sign up by Jan 25th.', author: 'HR', dept: 'All', priority: 'Low', date: '2024-01-05', comments: 20 },
];

const courses = [
  { title: 'React.js Masterclass', category: 'Technology', duration: '6 weeks', lessons: 24, progress: 0, enrolled: false, image: '' },
  { title: 'Python for Data Science', category: 'Data Science', duration: '8 weeks', lessons: 32, progress: 0, enrolled: false, image: '' },
  { title: 'Leadership & Management', category: 'Management', duration: '4 weeks', lessons: 16, progress: 0, enrolled: false, image: '' },
  { title: 'Advanced JavaScript', category: 'Technology', duration: '5 weeks', lessons: 20, progress: 0, enrolled: false, image: '' },
  { title: 'Communication Skills', category: 'Soft Skills', duration: '3 weeks', lessons: 12, progress: 0, enrolled: false, image: '' },
  { title: 'AWS Cloud Practitioner', category: 'Cloud', duration: '6 weeks', lessons: 28, progress: 0, enrolled: false, image: '' },
  { title: 'Machine Learning Basics', category: 'Data Science', duration: '8 weeks', lessons: 30, progress: 0, enrolled: false, image: '' },
  { title: 'Time Management', category: 'Soft Skills', duration: '2 weeks', lessons: 8, progress: 0, enrolled: false, image: '' },
];

const tickets = [
  { title: 'Email not working', category: 'Technical', empName: 'Ravi Sharma', priority: 'High', status: 'Open', date: '2024-01-15', desc: 'Unable to send/receive emails since yesterday.' },
  { title: 'Salary discrepancy', category: 'Finance', empName: 'Priya Patel', priority: 'High', status: 'Open', date: '2024-01-14', desc: 'January salary does not match the expected amount.' },
  { title: 'Access to HR portal', category: 'HR', empName: 'Amit Verma', priority: 'Medium', status: 'In Progress', date: '2024-01-13', desc: 'Need access to the new HR portal for leave applications.' },
  { title: 'System slow', category: 'Technical', empName: 'Sneha Reddy', priority: 'Medium', status: 'Open', date: '2024-01-12', desc: 'Laptop is running very slow since last update.' },
  { title: 'New software request', category: 'Technical', empName: 'Vikram Singh', priority: 'Low', status: 'Open', date: '2024-01-11', desc: 'Request to install Tableau for data visualization.' },
  { title: 'WFH request', category: 'HR', empName: 'Ananya Gupta', priority: 'Low', status: 'Resolved', date: '2024-01-10', desc: 'Requesting work from home for 2 days next week.' },
];

let seeded = false;

async function seedDatabase() {
  if (seeded) return;
  seeded = true;

  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Database already seeded, skipping');
      return;
    }

    await User.create({ email: 'admin@ems.com', username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin', permissions: ['add_employee', 'edit_employee', 'delete_employee', 'manage_users'] });
    await User.create({ email: 'sectionadmin@ems.com', username: 'sectionadmin', password: 'sec123', name: 'Section Admin', role: 'section_admin', department: 'Engineering', permissions: ['add_employee', 'edit_employee'] });
    await User.create({ email: 'employee@ems.com', username: 'employee', password: 'emp123', name: 'Employee User', role: 'employee' });
    console.log('Users seeded');

    const createdEmployees = await Employee.insertMany(employees);
    console.log(`${createdEmployees.length} employees seeded`);

    const today = new Date().toISOString().split('T')[0];
    const month = `${today.slice(0, 7)}`;

    const payrolls = createdEmployees.map(e => {
      const basic = Math.round(e.salary * 0.5 / 12);
      const hra = Math.round(e.salary * 0.2 / 12);
      const da = Math.round(e.salary * 0.1 / 12);
      const other = Math.round(e.salary * 0.2 / 12);
      const pf = Math.round(basic * 0.12);
      const tds = Math.round(e.salary * 0.05 / 12);
      const net = basic + hra + da + other - pf - tds;
      return { employee: e._id, empName: `${e.firstName} ${e.lastName}`, month, annualSalary: e.salary, basic, hra, da, otherAllowances: other, pf, monthlyTds: tds, monthlyNet: net, payMode: 'Bank Transfer', paidDate: today, status: 'Paid' };
    });
    await Payroll.insertMany(payrolls);
    console.log('Payroll seeded');

    const ravi = createdEmployees.find(e => e.firstName === 'Ravi');
    const priya = createdEmployees.find(e => e.firstName === 'Priya');
    const amit = createdEmployees.find(e => e.firstName === 'Amit');
    const sneha = createdEmployees.find(e => e.firstName === 'Sneha');

    const leaves = [];
    if (ravi) leaves.push({ employee: ravi._id, empName: 'Ravi Sharma', department: 'Engineering', type: 'Sick Leave', from: '2024-01-20', to: '2024-01-21', days: 2, reason: 'Not feeling well', status: 'Pending', appliedOn: '2024-01-18' });
    if (priya) leaves.push({ employee: priya._id, empName: 'Priya Patel', department: 'Marketing', type: 'Casual Leave', from: '2024-01-25', to: '2024-01-25', days: 1, reason: 'Personal work', status: 'Approved', appliedOn: '2024-01-20' });
    if (amit) leaves.push({ employee: amit._id, empName: 'Amit Verma', department: 'Engineering', type: 'Annual Leave', from: '2024-02-01', to: '2024-02-05', days: 5, reason: 'Family vacation', status: 'Approved', appliedOn: '2024-01-15' });
    if (sneha) leaves.push({ employee: sneha._id, empName: 'Sneha Reddy', department: 'HR', type: 'Sick Leave', from: '2024-01-10', to: '2024-01-12', days: 3, reason: 'Medical treatment', status: 'Rejected', appliedOn: '2024-01-08' });
    await Leave.insertMany(leaves);
    console.log('Leaves seeded');

    const tasks = [];
    if (ravi) tasks.push({ employee: ravi._id, empName: 'Ravi Sharma', empDept: 'Engineering', title: 'Implement Dashboard API', desc: 'Create REST endpoints for admin dashboard', priority: 'High', dueDate: '2024-02-01', status: 'Assigned', assignedDate: today });
    if (amit) tasks.push({ employee: amit._id, empName: 'Amit Verma', empDept: 'Engineering', title: 'Fix Login Bug', desc: 'Users unable to login with special characters', priority: 'High', dueDate: '2024-01-25', status: 'In Progress', assignedDate: today });
    if (sneha) tasks.push({ employee: sneha._id, empName: 'Sneha Reddy', empDept: 'HR', title: 'Update Employee Handbook', desc: 'Revise company policies for 2024', priority: 'Medium', dueDate: '2024-02-15', status: 'Assigned', assignedDate: today });
    await PerformanceTask.insertMany(tasks);
    console.log('Tasks seeded');

    if (ravi) {
      await Appraisal.create({
        employee: ravi._id, empName: 'Ravi Sharma', empDept: 'Engineering', empPosition: 'Sr. Developer',
        quarter: 'Q4', year: 2023,
        scores: { technical: 5, communication: 4, teamwork: 4, punctuality: 5, productivity: 5 },
        average: 4.6, rating: 'Excellent', comments: 'Outstanding performance this quarter.', date: '2023-12-30'
      });
    }
    if (priya) {
      await Appraisal.create({
        employee: priya._id, empName: 'Priya Patel', empDept: 'Marketing', empPosition: 'Marketing Head',
        quarter: 'Q4', year: 2023,
        scores: { technical: 3, communication: 5, teamwork: 4, punctuality: 4, productivity: 4 },
        average: 4.0, rating: 'Good', comments: 'Great leadership skills.', date: '2023-12-28'
      });
    }
    console.log('Appraisals seeded');

    await Onboarding.insertMany([
      { name: 'Neha Kapoor', position: 'Accountant', dept: 'Finance', startDate: '2022-09-01', progress: 100, status: 'Completed' },
      { name: 'Kavya Iyer', position: 'HR Executive', dept: 'HR', startDate: '2023-03-01', progress: 100, status: 'Completed' },
      { name: 'Manish Joshi', position: 'Content Writer', dept: 'Marketing', startDate: '2023-04-10', progress: 60, status: 'In Progress' },
      { name: 'Isha Agarwal', position: 'SEO Specialist', dept: 'Marketing', startDate: '2023-05-20', progress: 30, status: 'In Progress' },
    ]);
    console.log('Onboarding seeded');

    await Announcement.insertMany(announcements);
    console.log('Announcements seeded');
    await Ticket.insertMany(tickets);
    console.log('Tickets seeded');
    await Course.insertMany(courses);
    console.log('Courses seeded');

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

module.exports = seedDatabase;

if (require.main === module) {
  const dotenv = require('dotenv');
  const mongoose = require('mongoose');
  dotenv.config();
  mongoose.connect(process.env.MONGODB_URI).then(seedDatabase).then(() => process.exit(0));
}
