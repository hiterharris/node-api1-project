const express = require('express');

const Db = require('./data/db');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.json({response: 'Hello world!!'})
})

server.get('/api/users', (req, res) => {
    Db.find()
        .then(users => {
            res.status(200).json(users)
        })
    .catch(error => {
        console.log("error on GET /user", error);
        res.status(500).json({errorMessage: "The user information could not be retrieved."});
    }); 
})

server.get('/api/users/:id', (req, res) => {
    const {id} = req.params;
    Db.findById(id)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(error => {
            console.log("error on GET /user", error);
            res.status(500).json({errorMessage: "The user information could not be retrieved."});
        });  
})

server.post('/api/users', (req, res) => {
    const userInfo = req.body;
    Db.insert(userInfo)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            console.log("error on POST /user", error);
            res.status(400).json({errorMessage: "Please provide name and bio for the user."});
        });
})

server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;
    Db.remove(id)
        .then(user => {
            if (!user){
                res.status(404).json({errorMessage: "The user with the specified ID does not exist."})
            } else{
            res.status(200).json(user);
            }
        })
        .catch(error => {
            console.log("error on DELETE /hubs", error);
            res.status(500).json({errorMessage:  "The user could not be removed"});
        });
})

server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    Db.update(id, req.body)
    .then(user => {
        if (!user){
            res.status(404).json({errorMessage: "The user with the specified ID does not exist."})
        } else if ((req.body.name.length < 1) || (req.body.bio.length < 1)){
            res.status(400).json({errorMessage:  "Please provide name and bio for the user." })
        } else {
           res.status(200).json(user); 
        }
    })
    .catch(error => {
        console.log("error on DELETE /hubs", error);
        res.status(500).json({errorMessage:  "The user information could not be modified."});
    });
});


const port = 5000;
server.listen(port, () => console.log(`Server listening on port ${port}`));