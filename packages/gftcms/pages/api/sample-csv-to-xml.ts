import nextConnect from "next-connect";

const handler = nextConnect();

handler.post((req, res) => {
  try {
    const {
      businessHeaderCsv,
      epcClassCsv,
      locationCsv,
      objectEventCsv,
      transformationEventCsv,
      aggregationEventCsv
    } = req.body;

    res.json({
      businessHeaderCsv,
      epcClassCsv,
      locationCsv,
      objectEventCsv,
      transformationEventCsv,
      aggregationEventCsv
    });
  } catch (error) {
    res.json({
      ok: false,
      error
    });
  }
});

export default handler;
