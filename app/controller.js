const { saveCallId, getCallId } = require("./model");

exports.saveCallId = async (req, res) => {
  try {
    const { id, signalData } = req.body;
    await saveCallId(id, signalData);
    res.status(200).send(true);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};

exports.getCallId = async (req, res) => {
  try {
    const { id } = req.params;
    const code = await getCallId(id);
    res.status(200).send({ code });
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};
