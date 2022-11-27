const axios = require('axios');
const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const PORT = 4000 || process.env.PORT;

const fs = require('fs');
const sheetDbToken = '3t5z74z2y54wj'
// const sound = require('sound-play');
// sound.play('./sound/random.mp3')

//- express & routes
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use(express.static(__dirname + '/sound'));


const readDataHistory = async () => {
    return JSON.parse(fs.readFileSync('./dataHistory.json'));
}

const {readFileSync, promises: fsPromises} = require('fs');
const readDataPasscode = async () => {
    const contents = readFileSync('dataPasscode.txt', 'utf-8');

    const arr = contents.split(/\r?\n/);
    arr.forEach((line, index) => {
        arr[index] = line.trim();
    });

    console.log(arr); // 👉️ ['One', 'Two', 'Three', 'Four']

    return arr;
    // return JSON.parse(fs.readFileSync('./dataPasscode.json'));
}


router.get('/', (req, res) => {
    res.send('Welcome to backend random passline!');
});     


//- Data History
router.post('/dataHistory', async (req, res) => {
    try {
        let { data } = req.body;
    
        let dataHistory = await readDataHistory();
        // console.log(dataHistory)
        
        fs.writeFileSync('./dataHistory.json', JSON.stringify(dataHistory.concat(data)));
        res.status(200).json({ msg: 'History pushed!' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});


router.get('/dataHistory', async (req, res) => {
    try {
        res.status(200).json({ msg: 'History fetch success!', val: await readDataHistory() });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});


router.delete('/dataHistory', async(req, res) => {
    try {
        let { no } = req.query;
        let dataHistory = await readDataHistory();
        
        dataHistory = dataHistory.filter(item => item.no != no);
        fs.writeFileSync('./dataHistory.json', JSON.stringify(dataHistory));

        res.status(200).json({ msg: 'History deleted!' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});


//- Data Dek
router.get('/dataDek', async (req, res) => {

    try {
        await axios.get(`https://sheetdb.io/api/v1/${sheetDbToken}`)
            .then(async (axiosRes) => {
                let dataDek = axiosRes.data;

                for (let item of await readDataHistory()) {
                    dataDek = dataDek.filter(itemDek => itemDek.no !== item.no); 
                }
                res.status(200).json({ msg: 'Data Dek fetch success!', val: dataDek });
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }

});


router.put('/dataDek/:column/:value', async (req, res) => {
    try {

        const { data } = req.body;
        const { column, value } = req.params;

        await axios.put(`https://sheetdb.io/api/v1/${sheetDbToken}/${column}/${value}`, {data: data})
            .then(async (axiosRes) => {
                res.status(200).json({ msg: 'Data Dek update success!', val: axiosRes.data });
            }
            ).catch((err) => {
                console.log(err);
            });
        
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});



//- Data Passcode
router.get('/dataPasscode', async (req, res) => {
    try {

        let dataPasscode = await readDataPasscode();
        let dataHistory = await readDataHistory();

        for (let item of dataHistory) {
            dataPasscode = dataPasscode.filter(itemPasscode => itemPasscode !== item.passcode);
        }
        
        res.status(200).json({ msg: 'Data Passcode fetch success!', val: dataPasscode });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});


app.use('/', router);

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});

