const express = require('express')
const app = express();
const morgan = require('morgan');
const cors = require('cors')
app.use(cors())
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body' ))
let numbers = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
  app.get('/api/persons', (request, response)=> {
    response.json(numbers)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = numbers.find(number => number.id === id);
    if (person) {
        response.json(person)
    } else {
        response.status(404).send('No person found with that id').end()
    }

  })


  app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
   
    const personExists = numbers.find(person => person.name === body.name);

    if (personExists) {
        return response.status(400).json({
            error: 'name must be unique'
        }).end()
    }
    const person = {
        name: body.name,
        number: body.number,
        id: Math.random()
    }
    numbers = numbers.concat(person);
    response.json(person)
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    numbers = numbers.filter(number => number.id !== id);
    response.status(204).end();
  })

  app.get('/info', (request, response)=> {
    response.send(
        `<p>Phonebook has info for ${numbers.length} people</p>
         <p>${new Date()}</p>`
    )
  })
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)