const QuestionList = async (req, res) => {
 
  try {
    const { position, description, duration, type } = req.body;
    
    if (!position || !description || !duration || !type) { 
      return res.status(400).json({ error: 'Missing credentials' });
    }

    res.status(201).json({
      success: true,
      comment: ['successfully details fetched']
    });
  } catch (error) {                                                                                                                                                           
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default QuestionList;
