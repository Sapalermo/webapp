from flask import Flask, jsonify, request, abort

app = Flask(__name__)

tasks = []

def find_task(task_id):
    return next((task for task in tasks if task['id'] == task_id), None)

# Funzione per recuperare la lista delle attività
@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

# Funzione per creare una nuova attività
@app.route('/tasks', methods=['POST'])
def create_task():
    if not request.json or 'title' not in request.json:
        abort(400)
    task = {
        'id': len(tasks) + 1,
        'title': request.json['title'],
        'description': request.json.get('description', ""),
        'done': False
    }
    tasks.append(task)
    return jsonify(task), 201

# Funzione per modificare un'attività
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = find_task(task_id)
    if task is None:
        abort(404)
    if not request.json:
        abort(400)
    task['title'] = request.json.get('title', task['title'])
    task['description'] = request.json.get('description', task['description'])
    task['done'] = request.json.get('done', task['done'])
    return jsonify(task)

# Funzione per eliminare un'attività
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = find_task(task_id)
    if task is None:
        abort(404)
    tasks.remove(task)
    return jsonify({'message': f'Attività {task_id} eliminata correttamente'}), 200

if __name__ == '__main__':
    app.run(debug=True)
