import Country from '../models/Country.js';

/**
 * @desc    Get all countries
 * @route   GET /api/v1/countries
 * @access  Public
 */
export const getCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ countryname: 1 });
    
    res.json({
      success: true,
      data: countries,
      count: countries.length,
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch countries',
    });
  }
};

/**
 * @desc    Get single country
 * @route   GET /api/v1/countries/:id
 * @access  Public
 */
export const getCountry = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    
    if (!country) {
      return res.status(404).json({
        success: false,
        error: 'Country not found',
      });
    }
    
    res.json({
      success: true,
      data: country,
    });
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch country',
    });
  }
};

/**
 * @desc    Create new country
 * @route   POST /api/v1/countries
 * @access  Private/Admin
 */
export const createCountry = async (req, res) => {
  try {
    const country = await Country.create(req.body);
    
    res.status(201).json({
      success: true,
      data: country,
      message: 'Country created successfully',
    });
  } catch (error) {
    console.error('Error creating country:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create country',
    });
  }
};

/**
 * @desc    Update country
 * @route   PUT /api/v1/countries/:id
 * @access  Private/Admin
 */
export const updateCountry = async (req, res) => {
  try {
    const country = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!country) {
      return res.status(404).json({
        success: false,
        error: 'Country not found',
      });
    }
    
    res.json({
      success: true,
      data: country,
      message: 'Country updated successfully',
    });
  } catch (error) {
    console.error('Error updating country:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update country',
    });
  }
};

/**
 * @desc    Delete country
 * @route   DELETE /api/v1/countries/:id
 * @access  Private/Admin
 */
export const deleteCountry = async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    
    if (!country) {
      return res.status(404).json({
        success: false,
        error: 'Country not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Country deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting country:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete country',
    });
  }
};

/**
 * @desc    Get business countries (isBusiness = true)
 * @route   GET /api/v1/countries/business
 * @access  Public
 */
export const getBusinessCountries = async (req, res) => {
  try {
    const countries = await Country.find({ isBusiness: true }).sort({ countryname: 1 });
    
    res.json({
      success: true,
      data: countries,
      count: countries.length,
    });
  } catch (error) {
    console.error('Error fetching business countries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch business countries',
    });
  }
};