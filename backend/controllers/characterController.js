import Character from "../models/Character.js";


// GET ALL CHARACTERS
export const getAllCharacters = async (req, res) => {

  try {

    const characters = await Character.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      characters
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

};



// ADD CHARACTER
export const addCharacter = async (req, res) => {

  try {

    const { name, profileLink, renderLink } = req.body;

    const character = await Character.create({
      name,
      profileLink,
      renderLink,
      forms: [],
      moments: []
    });

    res.json({
      success: true,
      character
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

};



// UPDATE CHARACTER
export const updateCharacter = async (req, res) => {

  try {

    const { id } = req.params;

    const { name, profileLink, renderLink } = req.body;

    const character = await Character.findByIdAndUpdate(
      id,
      { name, profileLink, renderLink },
      { new: true }
    );

    res.json({
      success: true,
      character
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

};



// DELETE CHARACTER
export const deleteCharacter = async (req, res) => {

  try {

    const { id } = req.params;

    const character = await Character.findById(id);

    if (!character) {
      return res.json({
        success: false,
        message: "Character not found"
      });
    }

    // Delete character
    await Character.findByIdAndDelete(id);

    // Remove this character from all movies
    await Movie.updateMany(
      {},
      {
        $pull: {
          casts: { name: character.name }
        }
      }
    );

    res.json({
      success: true,
      message: "Character deleted and removed from movies"
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

};



// ADD FORM
export const addForm = async (req, res) => {

  try {

    const { characterId } = req.params;

    const { name, image, renderLink } = req.body;

    const character = await Character.findById(characterId);

    if (!character) {
      return res.json({
        success: false,
        message: "Character not found"
      });
    }

    character.forms.push({
      name,
      image,
      renderLink
    });

    await character.save();

    res.json({
      success: true,
      message: "Form added"
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

};



// DELETE FORM
export const deleteForm = async (req, res) => {

  try {

    const { characterId, formId } = req.params;

    const character = await Character.findById(characterId);

    if (!character) {
      return res.json({
        success: false,
        message: "Character not found"
      });
    }

    character.forms = character.forms.filter(
      (f) => f._id.toString() !== formId
    );

    await character.save();

    res.json({
      success: true,
      message: "Form deleted"
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

};



// ADD MOMENT
export const addMoment = async (req, res) => {

  try {

    const { characterId } = req.params;

    const { title, description, show, episode, video } = req.body;

    const character = await Character.findById(characterId);

    if (!character) {
      return res.json({
        success: false,
        message: "Character not found"
      });
    }

    character.moments.push({
      title,
      description,
      show,
      episode,
      video
    });

    await character.save();

    res.json({
      success: true,
      message: "Moment added"
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

};



// DELETE MOMENT
export const deleteMoment = async (req, res) => {

  try {

    const { characterId, momentId } = req.params;

    const character = await Character.findById(characterId);

    if (!character) {
      return res.json({
        success: false,
        message: "Character not found"
      });
    }

    character.moments = character.moments.filter(
      (m) => m._id.toString() !== momentId
    );

    await character.save();

    res.json({
      success: true,
      message: "Moment deleted"
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

};