const express = require('express');
const request = require('request');
const extractor = require('unfluff');
const SummaryTool = require('node-summary');
const summarize = require('summarize');
const router = express.Router();

/* POST summary. */
router.post('/', function (req, res) {
  let url = req.body.url
  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let fullResponse = {
        analyzedData: {},
        textSummary: '',
        siteSummary: {}
      };
      fullResponse['analyzedData'] = extractor(body, 'en');
      fullResponse['siteSummary'] = summarize(body);
      // console.log(analyzedData);
      
      SummaryTool.summarize(fullResponse['analyzedData'].title, fullResponse['analyzedData'].text, (err, summary) => {
          if(err) console.log("Something went wrong man!");

          // console.log(summary);

          // console.log("Original Length " + (title.length + content.length));
          // console.log("Summary Length " + summary.length);
          // console.log("Summary Ratio: " + (100 - (100 * (summary.length / (title.length + content.length)))));
          fullResponse['textSummary'] = summary;
          res.render('summary', JSON.stringify(fullResponse));
      });
      // res.send(JSON.stringify(analyzedData));
      // res.render('summary', { data: analyzedData });
    }
  });
  
});

module.exports = router;
