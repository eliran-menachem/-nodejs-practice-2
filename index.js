const fs = require('fs').promises;

const bodyParser = require('body-parser');
const express = require('express')

const app = express();
app.use(bodyParser.json())

const initialTodos = []

const fileName = 'todos.json';

const store = {

    async read() {
        try {
            await fs.access(fileName);
            this.todos = JSON.parse((await fs.readFile(fileName)).toString());
        }
        catch (e) {
            this.todos = initialTodos;
        }
        return this.todos
    }, // End of read

    async save() {
        await fs.writeFile(fileName, JSON.stringify(this.todos));
    },// End of save
    async getIndexById(id) {
        try {
            const todos = await this.read();
            return todos.findIndex(todo => todo.id === +id);
        }
        catch (e) {
            console.log(e);

        }
    },// End of save
    async getNextTodoId() {
        let maxId = 0;
        const todos = await this.read();
        todos.forEach(todo => {
            if (todo.id > maxId) maxId = todo.id;
        });
        return maxId + 1
    },// End of getIndexById
    todos: []
}// End of getNextTodoId

app.get('/todos', (req, res) => {
    res.json(store.read())
})

app.post('/todos', async (req, res) => {
    const todo = req.body;
    todo.id = await store.getNextTodoId();
    await store.todos.push(todo);
    store.save();
    res.json('ok');
})

app.put('/todos/:id', async (req, res) => {
    const index = await store.getIndexById(req.params.id);
    const { title, completed } = req.body
    store.todos[index].title = title;
    store.todos[index].completed = completed;

    await store.save();
    res.json('ok');
})
app.delete('/todos/:id', async (req, res) => {
    const index = await store.getIndexById(req.params.id);
    store.todos.splice(index, 1)
    await store.save();
    res.json('ok');
})

app.listen(3000)