import City from '../models/City.js';
import Country from '../models/Country.js';

export const getCities = async (req, res) => {
  try {
    const { countryid, search, isBusiness } = req.query;
    let query = {};
    
    if (countryid) query.countryid = countryid;
    if (search) query.cityname = { $regex: search, $options: 'i' };
    if (isBusiness !== undefined) query.isBusiness = isBusiness === 'true';
    
    const cities = await City.find(query)
      .populate('countryid', 'countryname countrycode flag_url')
      .sort({ cityname: 1 });
    
    res.json({ success: true, data: cities, count: cities.length });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cities' });
  }
};

export const getCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id)
      .populate('countryid', 'countryname countrycode flag_url currency currencysign');
    
    if (!city) {
      return res.status(404).json({ success: false, error: 'City not found' });
    }
    
    res.json({ success: true, data: city });
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch city' });
  }
};

export const getCitiesByCountry = async (req, res) => {
  try {
    const cities = await City.find({ 
      countryid: req.params.countryId,
      isBusiness: true 
    }).sort({ cityname: 1 });
    
    res.json({ success: true, data: cities, count: cities.length });
  } catch (error) {
    console.error('Error fetching cities by country:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cities' });
  }
};

export const createCity = async (req, res) => {
  try {
    const { countryid, cityname } = req.body;
    
    if (!countryid || !cityname) {
      return res.status(400).json({ success: false, error: 'Country and city name are required' });
    }
    
    const country = await Country.findById(countryid);
    if (!country) {
      return res.status(404).json({ success: false, error: 'Country not found' });
    }
    
    const cityData = { ...req.body, countryname: country.countryname };
    const city = await City.create(cityData);
    await city.populate('countryid', 'countryname countrycode flag_url');
    
    res.status(201).json({ success: true, data: city, message: 'City created successfully' });
  } catch (error) {
    console.error('Error creating city:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    
    res.status(500).json({ success: false, error: 'Failed to create city' });
  }
};

export const updateCity = async (req, res) => {
  try {
    if (req.body.countryid) {
      const country = await Country.findById(req.body.countryid);
      if (!country) {
        return res.status(404).json({ success: false, error: 'Country not found' });
      }
      req.body.countryname = country.countryname;
    }
    
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('countryid', 'countryname countrycode flag_url');
    
    if (!city) {
      return res.status(404).json({ success: false, error: 'City not found' });
    }
    
    res.json({ success: true, data: city, message: 'City updated successfully' });
  } catch (error) {
    console.error('Error updating city:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    
    res.status(500).json({ success: false, error: 'Failed to update city' });
  }
};

export const deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    
    if (!city) {
      return res.status(404).json({ success: false, error: 'City not found' });
    }
    
    res.json({ success: true, message: 'City deleted successfully' });
  } catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({ success: false, error: 'Failed to delete city' });
  }
};

export const searchCities = async (req, res) => {
  try {
    const { q, countryid, limit = 20 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [], count: 0 });
    }
    
    let query = { cityname: { $regex: q, $options: 'i' }, isBusiness: true };
    if (countryid) query.countryid = countryid;
    
    const cities = await City.find(query)
      .populate('countryid', 'countryname countrycode flag_url')
      .limit(parseInt(limit))
      .sort({ cityname: 1 });
    
    res.json({ success: true, data: cities, count: cities.length });
  } catch (error) {
    console.error('Error searching cities:', error);
    res.status(500).json({ success: false, error: 'Failed to search cities' });
  }
};

export default { getCities, getCity, getCitiesByCountry, createCity, updateCity, deleteCity, searchCities };
