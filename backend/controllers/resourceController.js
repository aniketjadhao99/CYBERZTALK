import Resource from '../models/Resource.js';

// Get all resources (with filters)
export const getAllResources = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        let query = { isPublished: true };

        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { tags: new RegExp(search, 'i') }
            ];
        }

        const total = await Resource.countDocuments(query);
        const resources = await Resource.find(query)
            .populate('author', 'fullName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            data: resources,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error fetching resources'
        });
    }
};

// Get resource by ID
export const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('author', 'fullName email');

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: resource
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error fetching resource'
        });
    }
};

// Get resources by category
export const getResourcesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const limit = parseInt(req.query.limit) || 6;

        const resources = await Resource.find({
            category,
            isPublished: true
        })
            .populate('author', 'fullName')
            .sort({ createdAt: -1 })
            .limit(limit);

        return res.status(200).json({
            success: true,
            data: resources
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error fetching resources'
        });
    }
};

// Mark resource as helpful
export const markHelpful = async (req, res) => {
    try {
        const { helpful } = req.body; // true or false

        const updateData = helpful
            ? { $inc: { helpful: 1 } }
            : { $inc: { notHelpful: 1 } };

        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Thank you for your feedback',
            data: resource
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error updating resource'
        });
    }
};

// Get featured resources
export const getFeaturedResources = async (req, res) => {
    try {
        const resources = await Resource.find({
            isPublished: true,
            resourceType: { $in: ['guide', 'toolkit', 'report'] }
        })
            .populate('author', 'fullName')
            .sort({ views: -1 })
            .limit(6);

        return res.status(200).json({
            success: true,
            data: resources
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error fetching featured resources'
        });
    }
};
