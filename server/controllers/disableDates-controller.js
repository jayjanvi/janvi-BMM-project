const {
  addDisableDates,
  getAllDiasbleDates,
} = require("../services/disableDates-service");

const addDisableDate = async (req, res) => {
  const disabledate = await addDisableDates(req.body);
  return res.json(disabledate);
};

const disableDateList = async (req, res) => {
  const disabledate = await getAllDiasbleDates(req.body);
  return res.json(disabledate);
};

module.exports = {
  addDisableDate,
  disableDateList,
};
