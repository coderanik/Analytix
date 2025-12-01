import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Revenue from '../models/Revenue.js';
import Activity from '../models/Activity.js';
import Traffic from '../models/Traffic.js';
import Notification from '../models/Notification.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Revenue.deleteMany({});
    await Activity.deleteMany({});
    await Traffic.deleteMany({});
    await Notification.deleteMany({});

    console.log('Cleared existing data...');

    // Hash password for all users (insertMany doesn't trigger pre-save hooks)
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create users with country and currency
    const users = await User.insertMany([
      {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        password: hashedPassword,
        role: 'Admin',
        status: 'active',
        revenue: 12450,
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        country: 'US',
        currency: 'USD',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        password: hashedPassword,
        role: 'User',
        status: 'active',
        revenue: 8920,
        company: 'Design Studio',
        location: 'London, UK',
        country: 'GB',
        currency: 'GBP',
        lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        name: 'Michael Brown',
        email: 'michael@example.com',
        password: hashedPassword,
        role: 'User',
        status: 'inactive',
        revenue: 5340,
        company: 'Marketing Inc',
        location: 'Toronto, Canada',
        country: 'CA',
        currency: 'CAD',
        lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        name: 'Emily Davis',
        email: 'emily@example.com',
        password: hashedPassword,
        role: 'Editor',
        status: 'active',
        revenue: 15780,
        company: 'Creative Agency',
        location: 'Berlin, Germany',
        country: 'DE',
        currency: 'EUR',
        lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        name: 'James Wilson',
        email: 'james@example.com',
        password: hashedPassword,
        role: 'User',
        status: 'pending',
        revenue: 3200,
        company: 'Startup Co',
        location: 'Sydney, Australia',
        country: 'AU',
        currency: 'AUD',
        lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        name: 'Jessica Martinez',
        email: 'jessica@example.com',
        password: hashedPassword,
        role: 'User',
        status: 'active',
        revenue: 9450,
        company: 'Finance LLC',
        location: 'Mumbai, India',
        country: 'IN',
        currency: 'INR',
        lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
      {
        name: 'David Anderson',
        email: 'david@example.com',
        password: hashedPassword,
        role: 'Admin',
        status: 'active',
        revenue: 22100,
        company: 'Enterprise Inc',
        location: 'Tokyo, Japan',
        country: 'JP',
        currency: 'JPY',
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        name: 'Ashley Thomas',
        email: 'ashley@example.com',
        password: hashedPassword,
        role: 'User',
        status: 'inactive',
        revenue: 1890,
        company: 'Small Business',
        location: 'São Paulo, Brazil',
        country: 'BR',
        currency: 'BRL',
        lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      },
    ]);

    console.log(`Created ${users.length} users...`);

    // Create user-specific revenue, activity, and traffic data
    const currentYear = new Date().getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

    let totalRevenues = 0;
    let totalActivities = 0;
    let totalTraffic = 0;

    // Different revenue patterns for each user
    const revenuePatterns = [
      [4500, 5200, 4800, 6100, 5900, 7200, 6800, 7500, 8100, 7900, 8600, 9200], // Alex - USD
      [3200, 3800, 3500, 4200, 4100, 4800, 4600, 5100, 5500, 5400, 5800, 6200], // Sarah - GBP
      [4200, 4800, 4500, 5400, 5200, 6000, 5800, 6400, 6800, 6700, 7100, 7500], // Michael - CAD
      [3800, 4400, 4100, 4900, 4700, 5500, 5300, 5800, 6200, 6100, 6500, 6900], // Emily - EUR
      [3500, 4000, 3700, 4500, 4300, 5000, 4800, 5300, 5700, 5600, 6000, 6400], // James - AUD
      [2800, 3200, 3000, 3600, 3500, 4100, 3900, 4300, 4600, 4500, 4800, 5100], // Jessica - INR
      [5500, 6200, 5800, 7000, 6800, 8000, 7600, 8400, 9000, 8800, 9400, 10000], // David - JPY
      [2200, 2500, 2300, 2800, 2700, 3200, 3000, 3300, 3600, 3500, 3800, 4000], // Ashley - BRL
    ];

    // Different activity patterns for each user
    const activityPatterns = [
      [2400, 1398, 9800, 3908, 4800, 3800, 4300], // Alex
      [1800, 1200, 7500, 2800, 3600, 2900, 3200], // Sarah
      [2000, 1500, 8500, 3200, 4000, 3200, 3600], // Michael
      [2200, 1300, 9000, 3500, 4400, 3500, 3900], // Emily
      [1900, 1100, 8000, 3000, 3800, 3000, 3400], // James
      [1600, 1000, 7000, 2500, 3200, 2600, 2900], // Jessica
      [2800, 1800, 11000, 4500, 5600, 4400, 5000], // David
      [1400, 900, 6000, 2200, 2800, 2300, 2500], // Ashley
    ];

    // Different traffic patterns for each user
    const trafficPatterns = [
      [{ name: 'Organic', value: 4500 }, { name: 'Direct', value: 3200 }, { name: 'Referral', value: 2100 }, { name: 'Social', value: 1800 }, { name: 'Email', value: 1200 }],
      [{ name: 'Organic', value: 3200 }, { name: 'Direct', value: 2400 }, { name: 'Referral', value: 1500 }, { name: 'Social', value: 1300 }, { name: 'Email', value: 900 }],
      [{ name: 'Organic', value: 3800 }, { name: 'Direct', value: 2800 }, { name: 'Referral', value: 1800 }, { name: 'Social', value: 1600 }, { name: 'Email', value: 1100 }],
      [{ name: 'Organic', value: 3600 }, { name: 'Direct', value: 2600 }, { name: 'Referral', value: 1700 }, { name: 'Social', value: 1500 }, { name: 'Email', value: 1000 }],
      [{ name: 'Organic', value: 3300 }, { name: 'Direct', value: 2400 }, { name: 'Referral', value: 1600 }, { name: 'Social', value: 1400 }, { name: 'Email', value: 950 }],
      [{ name: 'Organic', value: 2800 }, { name: 'Direct', value: 2000 }, { name: 'Referral', value: 1300 }, { name: 'Social', value: 1200 }, { name: 'Email', value: 800 }],
      [{ name: 'Organic', value: 5200 }, { name: 'Direct', value: 3800 }, { name: 'Referral', value: 2500 }, { name: 'Social', value: 2200 }, { name: 'Email', value: 1500 }],
      [{ name: 'Organic', value: 2200 }, { name: 'Direct', value: 1600 }, { name: 'Referral', value: 1100 }, { name: 'Social', value: 1000 }, { name: 'Email', value: 700 }],
    ];

    const fillColors = {
      'Organic': '#3b82f6',
      'Direct': '#22c55e',
      'Referral': '#f59e0b',
      'Social': '#8b5cf6',
      'Email': '#ef4444',
    };

    // Create data for each user
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const revenuePattern = revenuePatterns[i];
      const activityPattern = activityPatterns[i];
      const trafficPattern = trafficPatterns[i];

      // Create revenue data for this user
      const userRevenues = revenuePattern.map((rev, idx) => ({
        userId: user._id,
        month: monthNames[idx],
        year: currentYear,
        revenue: rev,
        target: Math.floor(rev * 0.9), // Target is 90% of revenue
      }));
      await Revenue.insertMany(userRevenues);
      totalRevenues += userRevenues.length;

      // Create activity data for this user
      const userActivities = activityPattern.map((active, idx) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + idx);
        return {
          userId: user._id,
          day: days[idx],
          date,
          active: active,
          new: Math.floor(active * 0.15), // New users are 15% of active
        };
      });
      await Activity.insertMany(userActivities);
      totalActivities += userActivities.length;

      // Create traffic data for this user
      const userTraffic = trafficPattern.map(t => ({
        userId: user._id,
        name: t.name,
        value: t.value,
        fill: fillColors[t.name],
      }));
      await Traffic.insertMany(userTraffic);
      totalTraffic += userTraffic.length;
    }

    console.log(`Created ${totalRevenues} revenue records...`);
    console.log(`Created ${totalActivities} activity records...`);
    console.log(`Created ${totalTraffic} traffic records...`);

    console.log(`Created ${traffic.length} traffic records...`);

    // Create notifications
    const notifications = await Notification.insertMany([
      {
        title: 'New user registered',
        description: 'Alex Johnson just signed up for a Pro account',
        type: 'user',
        read: false,
        userId: null,
        createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      },
      {
        title: 'Payment received',
        description: '$1,200 payment from Sarah Williams processed successfully',
        type: 'payment',
        read: false,
        userId: null,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        title: 'Server alert',
        description: 'CPU usage exceeded 80% on production server',
        type: 'alert',
        read: true,
        userId: null,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        title: 'New feature deployed',
        description: 'Analytics v2.0 is now live with improved performance',
        type: 'update',
        read: true,
        userId: null,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        title: 'Weekly report ready',
        description: 'Your weekly analytics report is ready to download',
        type: 'update',
        read: true,
        userId: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    ]);

    console.log(`Created ${notifications.length} notifications...`);

    console.log('✅ Database seeded successfully!');
    console.log('\nDefault login credentials:');
    console.log('Email: alex@example.com');
    console.log('Password: password123');
    console.log('\nYou can use any of the seeded users to login.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

