exports.user = async (req, res) => {
  const {firstName, lastName} = req.user;
  res.status(200).json({fullName: `${firstName} ${lastName}`});
};
