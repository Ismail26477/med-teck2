import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Medication } from './models/Medication';
import { Allergy } from './models/Allergy';
import { MedicalCondition } from './models/MedicalCondition';
import { MedicalFile } from './models/MedicalFile';

dotenv.config();

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not defined');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[v0] Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Medication.deleteMany({});
    await Allergy.deleteMany({});
    await MedicalCondition.deleteMany({});
    await MedicalFile.deleteMany({});
    console.log('[v0] Cleared existing data');

    // Create test users
    const user1 = await User.create({
      email: 'john@example.com',
      password: 'password123',
      name: 'John Doe',
      dateOfBirth: '1990-05-15',
      bloodType: 'O+',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1234567890',
      allergies: ['Penicillin', 'Shellfish'],
      conditions: ['Diabetes Type 2', 'Hypertension'],
      medications: ['Metformin', 'Lisinopril'],
    });

    const user2 = await User.create({
      email: 'sarah@example.com',
      password: 'password456',
      name: 'Sarah Smith',
      dateOfBirth: '1985-08-22',
      bloodType: 'A+',
      emergencyContact: 'Mike Smith',
      emergencyPhone: '+9876543210',
      allergies: ['Aspirin'],
      conditions: ['Asthma'],
      medications: ['Albuterol'],
    });

    console.log('[v0] Created 2 users');

    // Create medications for user1
    await Medication.create([
      {
        userId: user1._id,
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        reason: 'Type 2 Diabetes',
        startDate: '2023-01-15',
        prescribedBy: 'Dr. Johnson',
        pharmacy: 'CVS Pharmacy',
        sideEffects: 'Mild nausea',
        notes: 'Take with meals',
      },
      {
        userId: user1._id,
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        reason: 'Hypertension',
        startDate: '2023-03-20',
        prescribedBy: 'Dr. Johnson',
        pharmacy: 'Walgreens',
        notes: 'Take in the morning',
      },
    ]);

    // Create medications for user2
    await Medication.create({
      userId: user2._id,
      name: 'Albuterol Inhaler',
      dosage: '90mcg',
      frequency: 'As needed',
      reason: 'Asthma',
      startDate: '2023-06-10',
      prescribedBy: 'Dr. Lee',
      pharmacy: 'Walmart Pharmacy',
      notes: 'Use before exercise if needed',
    });

    console.log('[v0] Created medications');

    // Create allergies for user1
    await Allergy.create([
      {
        userId: user1._id,
        allergen: 'Penicillin',
        severity: 'severe',
        reaction: 'Anaphylaxis',
        dateDiscovered: '2015-10-05',
        notes: 'Avoid all penicillin-based antibiotics',
      },
      {
        userId: user1._id,
        allergen: 'Shellfish',
        severity: 'moderate',
        reaction: 'Hives and swelling',
        dateDiscovered: '2010-07-20',
        notes: 'Cross-contamination risk in seafood restaurants',
      },
    ]);

    // Create allergies for user2
    await Allergy.create({
      userId: user2._id,
      allergen: 'Aspirin',
      severity: 'mild',
      reaction: 'Stomach upset',
      dateDiscovered: '2012-03-15',
      notes: 'Use acetaminophen as alternative',
    });

    console.log('[v0] Created allergies');

    // Create medical conditions for user1
    await MedicalCondition.create([
      {
        userId: user1._id,
        name: 'Type 2 Diabetes',
        status: 'active',
        diagnosedDate: '2020-06-01',
        diagnosedBy: 'Dr. Johnson',
        notes: 'Well controlled with medication',
      },
      {
        userId: user1._id,
        name: 'Hypertension',
        status: 'active',
        diagnosedDate: '2021-03-15',
        diagnosedBy: 'Dr. Johnson',
        notes: 'BP readings stable',
      },
    ]);

    // Create medical conditions for user2
    await MedicalCondition.create({
      userId: user2._id,
      name: 'Asthma',
      status: 'active',
      diagnosedDate: '2018-05-20',
      diagnosedBy: 'Dr. Lee',
      notes: 'Mild to moderate, well controlled',
    });

    console.log('[v0] Created medical conditions');

    // Create medical files for user1
    await MedicalFile.create([
      {
        userId: user1._id,
        name: 'Annual Physical Report 2024',
        type: 'Report',
        description: 'Annual physical examination results',
        uploadDate: '2024-01-10',
      },
      {
        userId: user1._id,
        name: 'Blood Test Results',
        type: 'Lab Results',
        description: 'Glucose and lipid panel',
        uploadDate: '2024-01-15',
      },
    ]);

    // Create medical files for user2
    await MedicalFile.create({
      userId: user2._id,
      name: 'Chest X-Ray',
      type: 'Imaging',
      description: 'Chest X-ray for asthma evaluation',
      uploadDate: '2024-02-01',
    });

    console.log('[v0] Created medical files');

    console.log('[v0] Database seeding completed successfully!');
    console.log('[v0] Test Accounts:');
    console.log('[v0] Email: john@example.com, Password: password123');
    console.log('[v0] Email: sarah@example.com, Password: password456');

    await mongoose.connection.close();
  } catch (error) {
    console.error('[v0] Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
