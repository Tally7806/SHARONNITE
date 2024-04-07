const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const cors = require('cors');
const crypto = require('crypto');
const router = express.Router();

const app = express(); //creating an instance express module 
const port = process.env.PORT || 3000; //app listening on this port


// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const {User} = require('./models/users.js')
const {Appointment} = require('./models/appointment.js')
const {Login} = require('./models/login.js')


//users route
const users = []; //creating an empty array for storing data

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); //middle ware for parsing incomin jason payloads
app.use(express.static('public')); // express to serve static files like script and images

const secretKey = crypto.randomBytes(32).toString('hex');


app.post('/register', async (req, res) => { //end point register
    const { name, email, password } = req.body;
    if (!name || !email || !password) { //checking if any of this is falsy for code in if to execute
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
  
    const existingUser = users.find(user => user.email === email); //method to find element and check emails
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10); //this is a library for hashing passwords. It provides a secure way to hash passwords using a one-way hashing algorithm
                                                            //10 This is the number of salt rounds to use when generating the hash
  
    const newUser = User({ //object to create a new user instance.
      id: users.length + 1,
      name,
      email,
      passwordHash: hashedPassword,
    });
  
    await newUser.save(); //save to the db
  
    const payload = {
      userId: newUser.id.toString(),
    
    };
  
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); //used to authenticate users and transmit information securely between the client and server
  
    res.status(201).json({ message: 'User registered successfully', token, userId: newUser._id  });
  }
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
mongoose.connect('mongodb://localhost:27017/HMS')
.then(() => console.log('Database Connected!'))
.catch((e) => console.log('Error connecting to MongoDB:', e));

//end of user register


//appointment route
  let appointment

 // API endpoint to book an appointment

 app.post('/appointment', async (req, res) => {
        // Create a new appointment
    const user = await User.findOne({ email: req.body.email }).exec();
    //console.log(user);
    if (!user) {
        return res.status(400).json({ message: 'User detail espcially email is incorrect' });
        
    }
    try{
      const newAppointment = new Appointment({
        name: req.body.name,
        email: req.body.email,
        date: req.body.date,
        phone: req.body.phone,
        dob: req.body.dob,
        gender: req.body.gender,
        department: req.body.department,
        reason: req.body.reason,
        user: user._id, // Reference to the user collection id
      });
    
      const savedAppointment = await newAppointment.save();
      console.log(savedAppointment);
      res.status(201).json({ "success": `New Appointment ${savedAppointment._id} created!`});
    } catch (err) { 
       res.status(500).send({error: err})
    }  
  })

app.get('/', (req, res) => {
    console.log('GET')
})

//login route
app.use(cors());
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
console.log(req.body)
  try {
    // Find the user by email
    const user = await User.findOne({ email: email }).exec(); //check if email exist
    console.log(user)
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      // Generate a JWT token
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secretKey);

      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid login credentials' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'User email does not exist' });
  }
});

  
    // Admin route
// Admin routes

// Get all users (admin view)
app.get('/admin/users', async (req, res) => {
  try {
    const peopleData = await fs.readFile(simulacra.uk/CST2572/people.json, 'utf-8');
    const people = JSON.parse(peopleData);
    res.json(people);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a user by ID (admin delete)
app.delete('/admin/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const peopleData = await fs.readFile(simulacra.uk/CST2572/people.json, 'utf-8');
    let people = JSON.parse(peopleData);

    // Find the index of the user with the given ID
    const userIndex = people.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the user from the array
    people.splice(userIndex, 1);

    // Save the updated data back to the file
    await fs.writeFile(simulacra.uk/CST2572/people.json, JSON.stringify(people, null, 2), 'utf-8');

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a user by ID (admin update)
app.put('/admin/users/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  try {
    const peopleData = await fs.readFile(simulacra.uk/CST2572/people.json, 'utf-8');
    let people = JSON.parse(peopleData);

    // Find the index of the user with the given ID
    const userIndex = people.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's data
    people[userIndex] = { ...people[userIndex], ...updatedData };

    // Save the updated data back to the file
    await fs.writeFile(PEOPLE_FILE_PATH, JSON.stringify(people, null, 2), 'utf-8');

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Doctor routes

// Update a user's prescription by ID (doctor update)
app.put('/doctor/users/:id/prescription', async (req, res) => {
  const userId = req.params.id;
  const prescriptionData = req.body;

  try {
    const medicineData = await fs.readFile(simulacra.uk/CST2572/medicine.json, 'utf-8');
    const medicine = JSON.parse(medicineData);

    // Check if the prescribed medicine exists
    const prescribedMedicine = medicine.find(item => item.id === prescriptionData.medicineId);

    if (!prescribedMedicine) {
      return res.status(404).json({ message: 'Prescribed medicine not found' });
    }

    const peopleData = await fs.readFile(simulacra.uk/CST2572/people.json, 'utf-8');
    let people = JSON.parse(peopleData);

    // Find the index of the user with the given ID
    const userIndex = people.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's prescription data
    people[userIndex].prescription = {
      medicine: prescribedMedicine.name,
      dosage: prescriptionData.dosage,
      instructions: prescriptionData.instructions,
    };

    // Save the updated data back to the file
    await fs.writeFile(simulacra.uk/CST2572/people.json, JSON.stringify(people, null, 2), 'utf-8');

    res.json({ message: 'Prescription updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
//end of functionality for admin and doctor










// // Admin view (fetch all users)
// fetch('/admin/users')
//   .then(response => response.json())
//   .then(users => {
//     console.log('All Users:', users);
//     // Update your UI to display the users
//   })
//   .catch(error => console.error('Error fetching users:', error));

// // Admin delete (delete user by ID)
// const userIdToDelete = 'user_id_to_delete'; 
// fetch(`/admin/users/${userIdToDelete}`, {
//   method: 'DELETE',
// })
//   .then(response => response.json())
//   .then(data => console.log(data.message))
//   .catch(error => console.error('Error deleting user:', error));

// // Admin update (update user by ID)
// const userIdToUpdate = 'user_id_to_update'; 
// const updatedData = { name: 'Updated Name' }; 
// fetch(`/admin/users/${userIdToUpdate}`, {
//   method: 'PUT',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(updatedData),
// })
//   .then(response => response.json())
//   .then(data => console.log(data.message))
//   .catch(error => console.error('Error updating user:', error));

// // Doctor update prescription (update user's prescription by ID)
// const userIdForPrescription = 'user_id_for_prescription'; 
// const prescriptionData = {
//   medicineId: 'medicine_id', 
//   dosage: 'Updated Dosage',
//   instructions: 'Updated Instructions',
// }; // Replace with the actual prescription data
// fetch(`/doctor/users/${userIdForPrescription}/prescription`, {
//   method: 'PUT',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(prescriptionData),
// })
//   .then(response => response.json())
//   .then(data => console.log(data.message))
//   .catch(error => console.error('Error updating prescription:', error));



//   // People route
//   app.get('/people', authenticateToken, (req, res) => {
//     const userRole = req.user.role;
  
//     if (userRole === 'people') {
//       // Implement people functionality here (e.g., book appointments, view medication instructions)
//       res.json({ message: 'People functionality accessed' });
//     } else {
//       res.status(403).json({ message: 'Access forbidden' });
//     }
//   });
     
//   // Middleware to authenticate the token
//   function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
  
//     if (token == null) {
//       return res.sendStatus(401);
//     }
  
//     jwt.verify(token, secretKey, (err, user) => {
//       if (err) {
//         return res.sendStatus(403);
//       }
  
//       req.user = user;
//       next();
//     });
//   }
  
// // Default route handler for undefined routes
// app.use((req, res) => {
//   res.status(404).json({ message: 'Not Found' });
// });
  


 