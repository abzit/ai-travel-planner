const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY }); 

const generateItinerary = async (destination, days, budgetType, interests) => {
  const prompt = `
You are an expert AI travel planner. Create a detailed day-by-day itinerary for a trip to ${destination} for ${days} days.
The budget type is ${budgetType}. The traveler is interested in: ${interests.join(', ')}.
Provide a realistic budget estimate in the official local currency of ${destination}. Provide the 3-letter currency code and the currency symbol.
Suggest a couple of hotels suitable for the budget.
Also, extract the most important specific locations mentioned in the itinerary (like specific tourist attractions, parks, or monuments) and provide their approximate GPS latitude and longitude so we can plot them on a map.

Return ONLY a valid JSON object without any markdown codeblocks or extra text. Use the exact structure below:
{
  "currencyCode": "EUR",
  "currencySymbol": "€",
  "itinerary": [
    {
      "day": 1,
      "activities": [
        "Morning: Visit XYZ",
        "Afternoon: Lunch at ABC",
        "Evening: Explore DEF"
      ]
    }
  ],
  "budgetEstimate": {
    "flights": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "total": 0
  },
  "hotels": [
    {
      "name": "Hotel Name",
      "type": "${budgetType}"
    }
  ],
  "mapLocations": [
    {
      "name": "XYZ Attraction",
      "lat": 48.8584,
      "lng": 2.2945
    }
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let text = response.text;
    // Strip markdown code blocks if the model accidentally included them
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (text.startsWith('```')) {
        text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error('Failed to generate itinerary with AI');
  }
};

const regenerateDay = async (destination, dayNumber, interests, currentActivities) => {
  const prompt = `
You are an expert AI travel planner. You need to regenerate a single day of an itinerary for ${destination}.
This is for Day ${dayNumber}. Current activities were: ${currentActivities.join(', ')}. The user wants new suggestions.
The traveler's overall interests are: ${interests.join(', ')}.

Return ONLY a valid JSON array of strings containing 3 to 4 new activities for this day. No markdown code blocks.
Example:
[
  "Morning: New Activity A",
  "Afternoon: New Activity B",
  "Evening: New Activity C"
]
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let text = response.text;
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (text.startsWith('```')) {
        text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Error regenerating day:', error);
    throw new Error('Failed to regenerate day with AI');
  }
};

module.exports = {
  generateItinerary,
  regenerateDay,
};
