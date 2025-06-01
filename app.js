auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('todo-section').style.display = 'block';
    loadTasks(user.uid);
  } else {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('todo-section').style.display = 'none';
  }
});

function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email, password)
      .catch(alert);
}

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, password)
      .catch(alert);
}

function logout() {
  auth.signOut();
}

function addTask() {
  const task = document.getElementById('taskInput').value;
  const user = auth.currentUser;
  db.collection('tasks').add({
    uid: user.uid,
    task,
    completed: false,
    createdAt: new Date()
  });
  document.getElementById('taskInput').value = '';
  loadTasks(user.uid);
}

function loadTasks(uid) {
  db.collection('tasks').where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .get()
    .then(snapshot => {
      const list = document.getElementById('taskList');
      list.innerHTML = '';
      snapshot.forEach(doc => {
        const li = document.createElement('li');
        li.textContent = doc.data().task + (doc.data().completed ? ' ✅' : '');
        li.onclick = () => toggleComplete(doc.id, !doc.data().completed);
        list.appendChild(li);
      });
    });
}

function toggleComplete(id, newStatus) {
  db.collection('tasks').doc(id).update({ completed: newStatus });
  loadTasks(auth.currentUser.uid);
}
