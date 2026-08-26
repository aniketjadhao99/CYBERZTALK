import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/models/User.js';
import ExpertProfile from './backend/models/ExpertProfile.js';
import Resource from './backend/models/Resource.js';
import connectDB from './backend/config/database.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await Resource.deleteMany({});
        console.log('Cleared existing resources');

        // Seed Resources
        const resources = [
            {
                title: 'The Anatomy of a Zero-Day Exploit: Prevention and Response',
                description: 'Understand the mechanics behind undetected vulnerabilities and how proactive AI-driven monitoring can safeguard your infrastructure.',
                content: 'A zero-day exploit is a cyber attack that targets a previously unknown vulnerability in software...',
                category: 'cyber-fraud',
                tags: ['exploits', 'vulnerability', 'prevention', 'security'],
                resourceType: 'guide',
                readTime: 12,
                isPublished: true
            },
            {
                title: 'Spear-Phishing Tactics of 2024',
                description: 'Cybercriminals are using LLMs to craft hyper-personalized attacks. Learn how to identify AI-generated social engineering attempts.',
                content: 'Spear-phishing has evolved dramatically in 2024 with the introduction of AI-powered attack generators...',
                category: 'phishing',
                tags: ['phishing', 'ai', 'social-engineering', 'detection'],
                resourceType: 'article',
                readTime: 8,
                isPublished: true
            },
            {
                title: 'Personal Security Audit Checklist',
                description: 'A comprehensive, step-by-step guide to locking down your digital presence.',
                content: 'This toolkit provides a detailed checklist for conducting a personal security audit...',
                category: 'privacy',
                tags: ['security-audit', 'privacy', 'personal-security', 'checklist'],
                resourceType: 'toolkit',
                readTime: 15,
                isPublished: true
            },
            {
                title: 'Defending Against Cyber Fraud',
                description: 'A deep dive into common financial scams targeting individuals and small businesses.',
                content: 'Cyber fraud encompasses a wide range of attacks designed to steal money or sensitive information...',
                category: 'cyber-fraud',
                tags: ['fraud', 'financial', 'scams', 'prevention'],
                resourceType: 'guide',
                readTime: 10,
                isPublished: true
            },
            {
                title: 'Privacy in a Connected World',
                description: 'How to configure your devices and networks to minimize data tracking.',
                content: 'In our interconnected world, protecting your privacy requires multiple layers of defense...',
                category: 'privacy',
                tags: ['privacy', 'devices', 'networks', 'configuration'],
                resourceType: 'article',
                readTime: 7,
                isPublished: true
            },
            {
                title: 'Social Media Security Protocol',
                description: 'Actionable steps to secure your profiles against account takeovers.',
                content: 'Social media accounts are prime targets for cybercriminals due to the valuable personal information they contain...',
                category: 'social-media',
                tags: ['social-media', 'security', 'account-protection', 'two-factor'],
                resourceType: 'toolkit',
                readTime: 9,
                isPublished: true
            },
            {
                title: 'Malware Detection and Removal Guide',
                description: 'Comprehensive guide to identifying, isolating, and removing malware from your systems.',
                content: 'Malware is malicious software designed to damage or disable computers and steal data...',
                category: 'cyber-fraud',
                tags: ['malware', 'detection', 'removal', 'antivirus'],
                resourceType: 'guide',
                readTime: 14,
                isPublished: true
            },
            {
                title: 'Identity Theft: Prevention and Recovery',
                description: 'Learn how to protect yourself from identity theft and steps to take if it happens to you.',
                content: 'Identity theft occurs when someone uses your personal information to commit fraud...',
                category: 'phishing',
                tags: ['identity-theft', 'prevention', 'recovery', 'credit-monitoring'],
                resourceType: 'guide',
                readTime: 11,
                isPublished: true
            },
            {
                title: '2024 Cybersecurity Threat Report',
                description: 'Annual analysis of emerging threats and attack trends based on real-world incident data.',
                content: 'This comprehensive report analyzes cybersecurity trends and threats from 2024...',
                category: 'general',
                tags: ['report', 'trends', 'threats', 'analysis'],
                resourceType: 'report',
                readTime: 20,
                isPublished: true
            },
            {
                title: 'Ransomware: Understanding and Protecting',
                description: 'An in-depth look at ransomware attacks and how to build resilience against them.',
                content: 'Ransomware is a type of malicious software that encrypts your files and demands payment...',
                category: 'cyber-fraud',
                tags: ['ransomware', 'encryption', 'backup', 'disaster-recovery'],
                resourceType: 'guide',
                readTime: 13,
                isPublished: true
            }
        ];

        await Resource.insertMany(resources);
        console.log(`✅ Seeded ${resources.length} resources`);

        // Seed demo users
        const demoUsers = [
            {
                fullName: 'Dr. Sarah Jenkins',
                email: 'sarah.jenkins@cyberztalk.com',
                password: 'SecurePassword123!',
                phone: '+91 98765 43210',
                location: 'Bengaluru, Karnataka',
                role: 'expert',
                expertise: ['phishing', 'malware', 'forensics'],
                isVerified: true,
                isActive: true
            },
            {
                fullName: 'Alex Chen',
                email: 'alex.chen@cyberztalk.com',
                password: 'SecurePassword123!',
                phone: '+91 98765 43211',
                location: 'Mumbai, Maharashtra',
                role: 'expert',
                expertise: ['identity-theft', 'financial-fraud'],
                isVerified: true,
                isActive: true
            },
            {
                fullName: 'Elena Vasquez',
                email: 'elena.vasquez@cyberztalk.com',
                password: 'SecurePassword123!',
                phone: '+91 98765 43212',
                location: 'New Delhi, Delhi',
                role: 'admin',
                isVerified: true,
                isActive: true
            }
        ];

        // Check if demo users exist before creating
        for (const userData of demoUsers) {
            let user = await User.findOne({ email: userData.email });
            if (!user) {
                user = new User(userData);
                await user.save();
                console.log(`✅ Created demo user: ${userData.fullName}`);
            } else {
                user.phone = userData.phone;
                user.location = userData.location;
                user.role = userData.role;
                user.expertise = userData.expertise;
                await user.save();
                console.log(`✅ Updated demo user: ${userData.fullName}`);
            }

            if (userData.role === 'expert') {
                const expert = user;
                const profileDefaults = userData.fullName.includes('Sarah')
                    ? {
                        headline: 'Cybercrime Response Specialist',
                        bio: 'Helps victims respond to phishing, malware, and digital evidence concerns.',
                        specialties: ['phishing', 'malware', 'forensics'],
                        yearsOfExperience: 10,
                        feePerMinute: 2,
                        credentials: ['Certified Cybercrime Investigator'],
                        languages: ['English', 'Hindi', 'Kannada'],
                        availability: 'available'
                    }
                    : {
                        headline: 'Financial Fraud & Identity Protection Expert',
                        bio: 'Supports victims through financial fraud recovery and identity protection steps.',
                        specialties: ['identity-theft', 'financial-fraud'],
                        yearsOfExperience: 8,
                        feePerMinute: 1.5,
                        credentials: ['Certified Fraud Examiner'],
                        languages: ['English', 'Hindi', 'Marathi'],
                        availability: 'available'
                    };

                await ExpertProfile.findOneAndUpdate(
                    { user: expert._id },
                    { user: expert._id, ...profileDefaults, isPublic: true, isApproved: true },
                    { upsert: true, new: true, runValidators: true }
                );
                console.log(`✅ Created expert profile: ${userData.fullName}`);
            }
        }

        console.log('🎉 Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeding
seedDatabase();
