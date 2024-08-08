const express = require('express');
const multer = require('multer');
const router = express.Router();



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), (req,res)=>{
	if(!req.file){
		return res.status(400).json({error: 'No file was uploaded'})
	}
	const imageBuffer = req.file.buffer
	const base64Image = imageBuffer.toString('base64') // turning the Images into a base64URL so I can store it as a string

	res.json({base64Image})
})

module.exports = { upload, router };
