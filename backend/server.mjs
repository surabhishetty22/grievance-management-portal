import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import ExifParser from 'exif-parser';
import fetch from 'node-fetch';
import natural from 'natural';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas:', err);
});

const dataSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  password: String,
});

const DataModel = mongoose.model('Datas', dataSchema);

const classifier = new natural.BayesClassifier();
// Health Department
classifier.addDocument('Slow response during health emergencies, risking lives.', 'Health Department');
classifier.addDocument('Inadequate funding for public health campaigns and education.', 'Health Department');
classifier.addDocument('Hospitals lacking critical medical equipment and supplies.', 'Health Department');
classifier.addDocument('Shortage of medical professionals in rural areas.', 'Health Department');
classifier.addDocument('Poor sanitation standards in healthcare facilities.', 'Health Department');
classifier.addDocument('Limited access to specialized medical services.', 'Health Department');
classifier.addDocument('Inefficient handling of vaccination programs.', 'Health Department');
classifier.addDocument('Inaccurate patient record management.', 'Health Department');
classifier.addDocument('Lack of transparency in healthcare facility ratings.', 'Health Department');
classifier.addDocument('Challenges in obtaining medical licenses and permits.', 'Health Department');
classifier.addDocument('Inconsistent distribution of essential medications.', 'Health Department');
classifier.addDocument('Ongoing issues with appointment scheduling.', 'Health Department');
classifier.addDocument('Inadequate mental health support services.', 'Health Department');
classifier.addDocument('Delayed response to healthcare complaints.', 'Health Department');
classifier.addDocument('Insufficient public awareness on health programs.', 'Health Department');
classifier.addDocument('Problems with health facility maintenance.', 'Health Department');
classifier.addDocument('Difficulty accessing medical test results.', 'Health Department');
classifier.addDocument('Shortage of ambulances during emergencies.', 'Health Department');
classifier.addDocument('Inadequate disaster preparedness in healthcare.', 'Health Department');
classifier.addDocument('Issues with the management of medical waste.', 'Health Department');
classifier.addDocument('Overcrowding in health clinics, affecting care quality.', 'Health Department');
classifier.addDocument('Absence of preventive care and wellness programs.', 'Health Department');
classifier.addDocument('Problems with public health inspection and regulation', 'Health Department');
classifier.addDocument('Delays in the issuance of medical certificates.', 'Health Department');
classifier.addDocument('Lack of affordable healthcare options.', 'Health Department');
classifier.addDocument('Inefficient handling of disease outbreaks.', 'Health Department');
classifier.addDocument('Limited access to medical imaging services.', 'Health Department');
classifier.addDocument('Absence of a comprehensive healthcare app', 'Health Department');
classifier.addDocument('Problems with public health data reporting', 'Health Department');
classifier.addDocument('Inadequate community health centers.', 'Health Department');

// Municipal Department
classifier.addDocument('Frequent water supply interruptions causing major disruptions.', 'Municipal Department');
classifier.addDocument('Sewage system blockages leading to property damage and health hazards.', 'Municipal Department');
classifier.addDocument('Poor waste management, resulting in environmental pollution.', 'Municipal Department');
classifier.addDocument('Inadequate street cleaning and maintenance.', 'Municipal Department');
classifier.addDocument('Insufficient street lighting, affecting safety.', 'Municipal Department');
classifier.addDocument('Land disputes leading to legal issues.', 'Municipal Department');
classifier.addDocument('Delays in issuing construction permits.', 'Municipal Department');
classifier.addDocument('Ineffective urban planning and traffic management.', 'Municipal Department');
classifier.addDocument('Difficulty obtaining birth and death certificates.', 'Municipal Department');
classifier.addDocument('Inconsistent property tax assessments.', 'Municipal Department');
classifier.addDocument('Lack of green spaces and recreational facilities.', 'Municipal Department');
classifier.addDocument('Neglect of heritage preservation and cultural sites.', 'Municipal Department');
classifier.addDocument('Absence of public restrooms in key areas.', 'Municipal Department');  
classifier.addDocument('Challenges in obtaining marriage licenses and civil documents.', 'Municipal Department');
classifier.addDocument('Problems with stray animal control.', 'Municipal Department');
classifier.addDocument('Ineffective urban drainage systems leading to flooding.', 'Municipal Department');
classifier.addDocument('Inconsistent garbage collection schedules.', 'Municipal Department');
classifier.addDocument('Issues with land encroachments and illegal constructions.', 'Municipal Department');
classifier.addDocument('Poor road maintenance and infrastructure.', 'Municipal Department');
classifier.addDocument('Lack of bicycle lanes and cycling infrastructure.', 'Municipal Department');
classifier.addDocument('Problems with public transportation infrastructure.', 'Municipal Department');
classifier.addDocument('Difficulty in obtaining street lighting in specific areas.', 'Municipal Department');
classifier.addDocument('Inefficient handling of illegal street vendors.', 'Municipal Department');
classifier.addDocument('Challenges in maintaining historical landmarks.', 'Municipal Department');
classifier.addDocument('Lack of public art and beautification projects.', 'Municipal Department');
classifier.addDocument('Delayed resolution of property disputes.', 'Municipal Department');
classifier.addDocument('Problems with illegal dumping and littering.', 'Municipal Department');
classifier.addDocument('Absence of effective parking facilities.', 'Municipal Department');
classifier.addDocument('Issues with land zoning regulations.', 'Municipal Department');
classifier.addDocument('Inadequate public transportation options.', 'Municipal Department');
classifier.addDocument('Inadequate parking options.', 'Municipal Department');

// Electricity Department
classifier.addDocument('Frequent power outages/cuts causing significant disruptions/problems.', 'Electricity Department');
classifier.addDocument('High electricity bills and billing errors.', 'Electricity Department');
classifier.addDocument('Safety concerns related to electrical infrastructure.', 'Electricity Department');
classifier.addDocument('Inconsistent voltage supply damaging electronic devices.', 'Electricity Department');
classifier.addDocument('Difficulty in obtaining new electricity connections.', 'Electricity Department');
classifier.addDocument('Limited access to renewable energy options.', 'Electricity Department');
classifier.addDocument('Inefficient complaint resolution for power-related issues.', 'Electricity Department');
classifier.addDocument('Inadequate response during severe weather events.', 'Electricity Department');
classifier.addDocument('Voltage fluctuations impacting sensitive equipment', 'Electricity Department');
classifier.addDocument('Delays in repairing damaged electrical lines', 'Electricity Department');
classifier.addDocument('Unscheduled maintenance leading to unannounced outages', 'Electricity Department');
classifier.addDocument('Billing disputes and overcharges', 'Electricity Department');
classifier.addDocument('Outdated electrical infrastructure in need of upgrades', 'Electricity Department');
classifier.addDocument('Inadequate measures for energy conservation', 'Electricity Department');
classifier.addDocument('Lack of transparency in electricity rates and tariffs', 'Electricity Department');
classifier.addDocument('Difficulty in obtaining load shedding schedules', 'Electricity Department');
classifier.addDocument('Absence of off-grid electricity solutions in remote areas', 'Electricity Department');
classifier.addDocument('street light is not working properly', 'Electricity Department');
classifier.addDocument('Problems with illegal electricity connections', 'Electricity Department');
classifier.addDocument('Insufficient investment in renewable energy sources', 'Electricity Department');
classifier.addDocument('Delays in the installation of electric meters', 'Electricity Department');
classifier.addDocument('Problems with the electrical inspection process', 'Electricity Department');
classifier.addDocument('Difficulty in obtaining information about power outages', 'Electricity Department');
classifier.addDocument('Issues with the response time to power-related complaints', 'Electricity Department');
classifier.addDocument('Inadequate backup power solutions during outages', 'Electricity Department');
classifier.addDocument('Problems with meter reading accuracy', 'Electricity Department');
classifier.addDocument('no informmation given in advance for the power cut', 'Electricity Department');
classifier.addDocument('due to natural disaster the electicity cables are fallen', 'Electricity Department');
classifier.addDocument('Inefficient electricity bill payment options', 'Electricity Department');
classifier.addDocument('Difficulty in obtaining information about power consumption', 'Electricity Department');
classifier.addDocument('Challenges in seeking compensation for power-related damages', 'Electricity Department');
classifier.addDocument('Inadequate response to electrical emergencies', 'Electricity Department');

// Public Works Department
classifier.addDocument('Potholes and damaged roads causing vehicular damage and accidents', 'Public Works Department');
classifier.addDocument('Delayed construction and repair of bridges, leading to traffic congestion', 'Public Works Department');
classifier.addDocument('Ineffective drainage systems resulting in flooding', 'Public Works Department');
classifier.addDocument('Inadequate maintenance of public parks and recreational areas', 'Public Works Department');
classifier.addDocument('Land encroachments affecting road expansion projects', 'Public Works Department');
classifier.addDocument('Lack of pedestrian walkways and crosswalks', 'Public Works Department');
classifier.addDocument('Lack of maintenance in public buildings and infrastructure', 'Public Works Department');
classifier.addDocument('Absence of public restrooms in key locations', 'Public Works Department');
classifier.addDocument('Inconsistent road signage and safety measures', 'Public Works Department');
classifier.addDocument('Issues with street vendor regulations and management', 'Public Works Department');
classifier.addDocument('Environmental concerns regarding road construction projects', 'Public Works Department');
classifier.addDocument('Delays in road expansion projects', 'Public Works Department');
classifier.addDocument('Inadequate street cleaning and waste removal', 'Public Works Department');
classifier.addDocument('Problems with illegal dumping and littering', 'Public Works Department');
classifier.addDocument('Lack of bicycle lanes and infrastructure for cyclists', 'Public Works Department');
classifier.addDocument('Issues with public transportation infrastructure', 'Public Works Department');
classifier.addDocument('Poor planning for parking facilities in urban areas', 'Public Works Department');
classifier.addDocument('Challenges in maintaining historical and cultural landmarks', 'Public Works Department');
classifier.addDocument('Lack of public art and beautification projects', 'Public Works Department');
classifier.addDocument('Difficulty in obtaining permits for public events and parades', 'Public Works Department');
classifier.addDocument('Delays in resolving property encroachment issues', 'Public Works Department');
classifier.addDocument('Insufficient maintenance of public buildings and facilities', 'Public Works Department');
classifier.addDocument('Inadequate disaster preparedness and response planning', 'Public Works Department');
classifier.addDocument('Difficulty obtaining information about road closures', 'Public Works Department');
classifier.addDocument('Problems with the installation of traffic lights', 'Public Works Department');
classifier.addDocument('Challenges in managing public green spaces', 'Public Works Department');
classifier.addDocument('Ineffective land use and zoning regulations', 'Public Works Department');
classifier.addDocument('Issues with the accessibility of public buildings', 'Public Works Department');
classifier.addDocument('Inadequate response to public works complaints', 'Public Works Department');
classifier.addDocument('Lack of transparency in public works spending', 'Public Works Department');

// Water Department
classifier.addDocument('Unequal distribution of irrigation water impacting farmers', 'Water Department');
classifier.addDocument('Outdated and damaged water infrastructure requiring repairs', 'Water Department');
classifier.addDocument('Delays in responding to water contamination issues', 'Water Department');
classifier.addDocument('Inefficient water storage and distribution systems', 'Water Department');
classifier.addDocument('Inadequate measures for water conservation', 'Water Department');
classifier.addDocument('Challenges in obtaining water quality reports', 'Water Department');
classifier.addDocument('Insufficient monitoring of groundwater levels', 'Water Department');
classifier.addDocument('Problems with illegal water connections', 'Water Department');
classifier.addDocument('Lack of water supply in remote rural areas', 'Water Department');
classifier.addDocument('Pollution of local water sources', 'Water Department');
classifier.addDocument('Limited access to safe drinking water', 'Water Department');
classifier.addDocument('Delayed response to dam and reservoir maintenance', 'Water Department');
classifier.addDocument('Issues with water pricing and billing', 'Water Department');
classifier.addDocument('Lack of transparency in water resource management', 'Water Department');
classifier.addDocument('Flooding due to poor river management', 'Water Department');
classifier.addDocument('Difficulties in obtaining water connection permits', 'Water Department');
classifier.addDocument('Shortage of staff for managing water resources', 'Water Department');
classifier.addDocument('Problems with fishery and aquaculture regulation', 'Water Department');
classifier.addDocument('Ineffective measures to address water scarcity during droughts', 'Water Department');
classifier.addDocument('Inadequate programs for watershed management', 'Water Department');
classifier.addDocument('Absence of a comprehensive water quality testing program', 'Water Department');
classifier.addDocument('Challenges in securing water supply during emergencies', 'Water Department');
classifier.addDocument('Insufficient measures to prevent water pollution', 'Water Department');
classifier.addDocument('Delays in water resource conservation projects', 'Water Department');
classifier.addDocument('Difficulty in obtaining information on water usage restrictions', 'Water Department');
classifier.addDocument('Inefficient handling of water source permits', 'Water Department');
classifier.addDocument('Challenges in obtaining information on water rights and regulations', 'Water Department');
classifier.addDocument('Lack of effective measures to address water conflicts', 'Water Department');
classifier.addDocument('Problems with water source protection and preservation', 'Water Department');
classifier.addDocument('Inadequate response to water resource complaints', 'Water Department');

// Education Department
classifier.addDocument('Shortage of qualified teachers in public schools', 'Education Department');
classifier.addDocument('Dilapidated infrastructure and inadequate sanitation facilities', 'Education Department');
classifier.addDocument('Concerns about the quality of education due to a lack of oversight', 'Education Department');
classifier.addDocument('Limited access to extracurricular activities and sports programs', 'Education Department');
classifier.addDocument('Challenges in obtaining textbooks and educational materials', 'Education Department');
classifier.addDocument('Inequities in access to educational resources in different regions', 'Education Department');
classifier.addDocument('Bullying and safety concerns in schools', 'Education Department');
classifier.addDocument('Delayed issuance of certificates and diplomas', 'Education Department');
classifier.addDocument('Absence of vocational training and skill development programs', 'Education Department');
classifier.addDocument('Limited access to educational technology and internet connectivity', 'Education Department');
classifier.addDocument('Issues with teacher absenteeism and accountability', 'Education Department');
classifier.addDocument('Insufficient special education support and services', 'Education Department');
classifier.addDocument('Challenges in accessing higher education opportunities', 'Education Department');
classifier.addDocument('Problems with school transportation services', 'Education Department');
classifier.addDocument('Inconsistent school calendar and holiday schedules', 'Education Department');
classifier.addDocument('Absence of career guidance and counseling services', 'Education Department');
classifier.addDocument('Inadequate facilities for students with disabilities', 'Education Department');
classifier.addDocument('Delays in scholarship and financial aid disbursements', 'Education Department');
classifier.addDocument('Issues with the curriculum not meeting modern educational standards', 'Education Department');
classifier.addDocument('Shortage of educational staff for conducting extracurricular activities', 'Education Department');
classifier.addDocument('Inadequate measures for preventing cheating in examinations', 'Education Department');
classifier.addDocument('Difficulties in obtaining educational transcripts and records', 'Education Department');
classifier.addDocument('Challenges in addressing truancy and dropouts', 'Education Department');
classifier.addDocument('Inefficient allocation of educational resources', 'Education Department');
classifier.addDocument('Problems with overcrowded classrooms', 'Education Department');
classifier.addDocument('Lack of adequate measures to address academic disparities', 'Education Department');
classifier.addDocument('Difficulty in accessing extracurricular programs', 'Education Department');
classifier.addDocument('Issues with the management of student health and safety', 'Education Department');
classifier.addDocument('Inadequate response to parental concerns and feedback', 'Education Department');
classifier.addDocument('Lack of measures to promote digital literacy and technology in schools and colleges', 'Education Department');
classifier.addDocument('Teacher shortage affecting the quality of instruction', 'Education Department');
classifier.addDocument('Challenges in retaining experienced teachers in public schools', 'Education Department');
classifier.addDocument('Challenges in retaining experienced teachers in engineering colleges', 'Education Department');
classifier.addDocument('Issues with teacher training and professional development programs', 'Education Department');
classifier.addDocument('Inadequate measures to address teacher burnout and stress', 'Education Department');
classifier.addDocument('Concerns about teacher evaluations and performance assessments', 'Education Department');
classifier.addDocument('Difficulty in recruiting teachers for specialized subjects and courses', 'Education Department');
classifier.addDocument('Lack of incentives for teachers in underserved areas', 'Education Department');
classifier.train();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const complaintSchema = new mongoose.Schema({
  userId: { 
    type: String,
    required: true,
  },
  complaintId: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  date: Date,
  image: {
    data: String,
    contentType: String,
  },
  latitude: Number,
  longitude: Number,
  city: String,
  department: String,
  status: String,
  actionDescription: {
    type: String,
    default: 'Nil',
  },
});

const ComplaintModel = mongoose.model('fields', complaintSchema);

async function getLocationInfo(latitude, longitude) {
  const nominatimServerUrl = 'https://nominatim.openstreetmap.org/reverse';
  let locationInfo;

  try {
    const response = await fetch(`${nominatimServerUrl}?format=jsonv2&lat=${latitude}&lon=${longitude}`);
    const data = await response.json();

    if (data.display_name) {
      locationInfo = data.display_name;
    } else {
      locationInfo = 'Location not found';
    }
  } catch (error) {
    console.error('Error getting location info:', error);
    locationInfo = 'Error getting location info';
  }

  return locationInfo;
}



app.post('/insert-data', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const existingUser = await DataModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const userId = uuidv4(); 

    await DataModel.create({
      userId, 
      name,
      email,
      password,
    });

    res.status(201).json({ message: 'Data inserted into MongoDB' });
  } catch (error) {
    console.error('Error inserting data: ', error);
    res.status(500).json({ error: 'Error inserting data: ' + error.message });
  }
});


function getEmailDomain(email) {
  return email.split('@')[1];
}


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await DataModel.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const domain = getEmailDomain(user.email);

    let department = 'Unknown Department';
    if (domain === 'health.kar.in') {
      department = 'Health Department';
    } else if (domain === 'water.kar.in') {
      department = 'Water Department';
    } else if (domain === 'edu.kar.in') {
      department = 'Education Department';
    } else if (domain === 'pwd.kar.in') {
      department = 'Public Works Department';
    } else if (domain === 'ele.kar.in') {
      department = 'Electricity Department';
    } else if (domain === 'mcc.kar.in') {
      department = 'Municipal Department';
    }

    res.json({ department, userId: user._id }); 
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error during login' });
  }
});


app.get('/complaint-list', async (req, res) => {
  try {
    const department = req.query.department; 

    const complaints = await ComplaintModel.find({ department }).exec();
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Error fetching complaints' });
  }
});


app.post('/insert-complaint', upload.single('image'), async (req, res) => {
  const { userId, description, date } = req.body; 

  const image = {
    data: req.file.buffer.toString('base64'), 
    contentType: req.file.mimetype,
  };

  if (!userId || !description || !date || !image.data) {
    return res.status(400).json({ error: 'UserId, description, date, and image are required' });
  }

  try {
    const parser = ExifParser.create(Buffer.from(image.data, 'base64'));
    const result = parser.parse();
    const latitude = result.tags.GPSLatitude;
    const longitude = result.tags.GPSLongitude;
    let locationInfo = '';

    if (latitude && longitude) {
      locationInfo = await getLocationInfo(latitude, longitude);
    }

    const complaintText = description;
    const predictedDepartment = classifier.classify(complaintText);

    const complaintId = uuidv4();

    const initialStatus = 'In Progress';

    const newComplaint = await ComplaintModel.create({
      userId, 
      complaintId,
      description,
      date,
      image,
      latitude,
      longitude,
      city: locationInfo,
      department: predictedDepartment,
      status: initialStatus,
    });

    return res.status(201).json({ message: 'Complaint inserted into MongoDB', complaint: newComplaint });
  } catch (error) {
    console.error('Error inserting complaint: ', error);
    return res.status(500).json({ error: 'Error inserting complaint: ' + error.message });
  }
});

app.put('/update-complaint/:complaintId', upload.single('image'), async (req, res) => {
  const { complaintId } = req.params;
  const updatedFields = req.body;

  try {
    const complaint = await ComplaintModel.findOne({ complaintId: complaintId });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    if (updatedFields.actionDescription) {
      complaint.actionDescription = updatedFields.actionDescription;
    }

    if (req.file) {
      const imageBuffer = req.file.buffer;
      const imageBase64 = imageBuffer.toString('base64');

      complaint.image.data = imageBase64; 
      complaint.image.contentType = req.file.mimetype;
    }

    if (updatedFields.date) {
      complaint.date = updatedFields.date;
    }

    if (updatedFields.status) {
      complaint.status = updatedFields.status;
    }

    const updated = await complaint.save();

    return res.json({ message: 'Complaint updated successfully', complaint: updated });
  } catch (error) {
    console.error('Error updating complaint:', error);
    return res.status(500).json({ error: 'Error updating complaint' });
  }
});


app.get('/api/fields/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const userComplaints = await ComplaintModel.find({ userId });

    res.json(userComplaints);
  } catch (error) {
    console.error('Error fetching user-specific complaints:', error);
    res.status(500).json({ error: 'Error fetching user-specific complaints' });
  }
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});