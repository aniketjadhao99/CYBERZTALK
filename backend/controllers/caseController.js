import Case from '../models/Case.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/emailUtils.js';

const buildCaseEmailHtml = (caseData) => {
    const {
        caseId,
        createdAt,
        victimInfo,
        incidentType,
        platform,
        suspectInfo,
        status,
        description
    } = caseData;

    return `
        <div style="font-family: Arial, sans-serif; color: #111;">
            <h2 style="color: #006688;">New Cyberztalk Incident Report</h2>
            <p>New report submitted successfully with the following details:</p>
            <table cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Case ID</td><td style="border:1px solid #ddd;">${caseId}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Submitted At</td><td style="border:1px solid #ddd;">${new Date(createdAt).toLocaleString()}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Victim Name</td><td style="border:1px solid #ddd;">${victimInfo.fullName}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Victim Email</td><td style="border:1px solid #ddd;">${victimInfo.email}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Phone</td><td style="border:1px solid #ddd;">${victimInfo.phone || 'N/A'}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Alternate Contact</td><td style="border:1px solid #ddd;">${victimInfo.alternateContact || 'N/A'}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Age Group</td><td style="border:1px solid #ddd;">${victimInfo.ageGroup || 'N/A'}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">City / State</td><td style="border:1px solid #ddd;">${victimInfo.city || 'N/A'}, ${victimInfo.state || 'N/A'}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Incident Types</td><td style="border:1px solid #ddd;">${(incidentType || []).join(', ')}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Platform(s)</td><td style="border:1px solid #ddd;">${(platform || []).join(', ')}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Suspect Options</td><td style="border:1px solid #ddd;">${(suspectInfo?.options || []).join(', ') || 'None'}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Suspect Email</td><td style="border:1px solid #ddd;">${suspectInfo?.email || 'N/A'}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Suspect Name</td><td style="border:1px solid #ddd;">${suspectInfo?.name || 'N/A'}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Suspect URL</td><td style="border:1px solid #ddd;">${suspectInfo?.url || 'N/A'}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Other Suspect Info</td><td style="border:1px solid #ddd;">${suspectInfo?.other || 'N/A'}</td></tr>
               
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Status</td><td style="border:1px solid #ddd;">${status || 'new'}</td></tr>
                <tr><td style="font-weight:bold; border:1px solid #ddd;">Description</td><td style="border:1px solid #ddd;">${description || 'N/A'}</td></tr>
            </table>
        </div>
    `;
};

// Create a new case
export const createCase = async (req, res) => {
    try {
        const { victimInfo, incidentType, description, platform, suspectInfo } = req.body;

        const normalizedVictimInfo = {
            fullName: victimInfo?.fullName || victimInfo?.name || '',
            email: victimInfo?.email || '',
            phone: victimInfo?.phone || '',
            alternateContact: victimInfo?.alternateContact || victimInfo?.alternatePhone || '',
            ageGroup: victimInfo?.ageGroup || null,
            city: victimInfo?.city || null,
            state: victimInfo?.state || null
        };

        const normalizedIncidentType = Array.isArray(incidentType) ? incidentType : incidentType ? [incidentType] : [];
        const normalizedPlatform = Array.isArray(platform) ? platform : platform ? [platform] : [];
        const normalizedSuspectInfo = suspectInfo && typeof suspectInfo === 'object' ? suspectInfo : {
            options: [],
            email: null,
            name: null,
            url: null,
            other: null
        };

        if (!normalizedVictimInfo.fullName || !normalizedVictimInfo.email) {
            return res.status(400).json({
                success: false,
                message: 'Victim full name and email are required'
            });
        }

        if (!normalizedIncidentType.length || !description || !normalizedPlatform.length) {
            return res.status(400).json({
                success: false,
                message: 'Please provide incident type, platform and description'
            });
        }

        const newCase = await Case.create({
            victim: req.userId,
            victimInfo: normalizedVictimInfo,
            incidentType: normalizedIncidentType,
            description,
            platform: normalizedPlatform,
            suspectInfo: normalizedSuspectInfo,
           
            status: 'new'
        });

        const emailHtml = buildCaseEmailHtml(newCase);
        try {
            const emailResult = await sendEmail({
                to: process.env.EMAIL_TO || 'cyberzsecofficial@gmail.com',
                subject: `New Cyberztalk Incident Report ${newCase.caseId}`,
                html: emailHtml
            });
            console.log('✅ [CASE CREATED] Case notification sent/logged:', {
                caseId: newCase.caseId,
                victim: newCase.victimInfo?.fullName,
                email: newCase.victimInfo?.email,
                incidentType: newCase.incidentType,
                status: newCase.status
            });
        } catch (emailError) {
            console.error('❌ [EMAIL ERROR] Failed to send email:', emailError.message);
        }

        res.status(201).json({
            success: true,
            message: 'Case created successfully',
            data: newCase
        });
    } catch (error) {
        console.error('❌ [CASE ERROR] Error creating case:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error creating case: ' + error.message
        });
    }
};

// Get all cases
export const getAllCases = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const cases = await Case.find().limit(limit).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: cases,
            total: cases.length
        });
    } catch (error) {
        console.error('❌ [CASE ERROR] Error fetching cases:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching cases'
        });
    }
};

// Get case by ID
export const getCaseById = async (req, res) => {
    try {
        const caseData = await Case.findById(req.params.id).populate('victim');

        if (!caseData) {
            return res.status(404).json({
                success: false,
                message: 'Case not found'
            });
        }

        res.json({
            success: true,
            data: caseData
        });
    } catch (error) {
        console.error('❌ [CASE ERROR] Error fetching case:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching case'
        });
    }
};

// Update case status
export const updateCaseStatus = async (req, res) => {
    try {
        const { status, priority, assignedExpert } = req.body;
        const caseId = req.params.id;

        console.log('📝 [STATUS UPDATE] Request received:', {
            caseId,
            newStatus: status,
            priority,
            assignedExpert
        });

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const updateData = { status };
        if (priority) updateData.priority = priority;
        if (assignedExpert) updateData.assignedExpert = assignedExpert;

        const updatedCase = await Case.findByIdAndUpdate(caseId, updateData, { new: true });

        if (!updatedCase) {
            return res.status(404).json({
                success: false,
                message: 'Case not found'
            });
        }

        console.log('✅ [STATUS UPDATE] Case updated successfully:', {
            caseId: updatedCase.caseId,
            status: updatedCase.status
        });

        res.json({
            success: true,
            message: 'Case status updated successfully',
            data: updatedCase
        });
    } catch (error) {
        console.error('❌ [STATUS UPDATE] Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error updating case status: ' + error.message
        });
    }
};

// Get cases for current user
export const getUserCases = async (req, res) => {
    try {
        const cases = await Case.find({ victim: req.userId }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: cases,
            total: cases.length
        });
    } catch (error) {
        console.error('❌ [CASE ERROR] Error fetching user cases:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching cases'
        });
    }
};

// Delete a case
export const deleteCase = async (req, res) => {
    try {
        const deletedCase = await Case.findByIdAndDelete(req.params.id);

        if (!deletedCase) {
            return res.status(404).json({
                success: false,
                message: 'Case not found'
            });
        }

        res.json({
            success: true,
            message: 'Case deleted successfully',
            data: deletedCase
        });
    } catch (error) {
        console.error('❌ [CASE ERROR] Error deleting case:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error deleting case'
        });
    }
};
