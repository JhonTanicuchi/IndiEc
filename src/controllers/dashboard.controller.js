const DashboardController = {};

DashboardController.dashboard = async (req, res) => {
  res.render("dashboard");
};

module.exports = DashboardController;
