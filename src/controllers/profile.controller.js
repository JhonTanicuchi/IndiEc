const ProfileService = require("../services/profile.service");
const { APP_NAME } = require("../../config/env.config");

const ProfileController = {};

ProfileController.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = await ProfileService.getProfile(userId);

    res.render("users/profile", { profile: profileData });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

ProfileController.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const newData = {
      user: { /* ...datos del usuario a actualizar... */ },
      artist: { /* ...datos del artista a actualizar... */ },
      person: { /* ...datos de la persona a actualizar... */ },
    };

    await ProfileService.updateProfile(userId, newData);
    res.redirect(`/${APP_NAME}/profile`);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

module.exports = ProfileController;
