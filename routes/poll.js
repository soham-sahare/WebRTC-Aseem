const express = require('express');
const router = express.Router();

// router.get('/', (req, res) => {
//     res.send("POLLsd")
// });

router.get('/', (req, res) => res.render('poll'));

router.post('/', (req, res) => {

    const { title, option1, option2, option3, option4 } = req.body;

    res.send(title, option1, option2, option3, option4)
});


module.exports = router;