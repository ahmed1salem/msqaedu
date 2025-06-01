// قم باستبدال القيم بما يظهر لك من Firebase

let currentUser = null;
let displayName = "";

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    getUserName(user.uid);
  } else {
    document.getElementById("todoSection").style.display = "none";
    document.getElementById("authSection").style.display = "block";
  }
});

function register() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  displayName = document.getElementById("displayName").value;

  auth.createUserWithEmailAndPassword(email, pass).then(cred => {
    return db.collection("users").doc(cred.user.uid).set({
      name: displayName,
      email: email
    });
  });
}

function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, pass);
}

function logout() {
  auth.signOut();
}

function getUserName(uid) {
  db.collection("users").doc(uid).get().then(doc => {
    displayName = doc.data().name;
    document.getElementById("welcomeUser").textContent = `Welcome, ${displayName}`;
    document.getElementById("authSection").style.display = "none";
    document.getElementById("todoSection").style.display = "block";
    loadTasks();
  });
}

function addTask() {
  const task = document.getElementById("taskInput").value;
  const isPublic = document.getElementById("taskPublic").checked;

  if (!task) return;

  db.collection("tasks").add({
    task,
    uid: currentUser.uid,
    public: isPublic,
    completed: false,
    completedBy: null,
    createdAt: new Date()
  });

  document.getElementById("taskInput").value = "";
}

function loadTasks() {
  db.collection("tasks").orderBy("createdAt", "desc").onSnapshot(snapshot => {
    const list = document.getElementById("taskList");
    list.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const isOwner = data.uid === currentUser.uid;
      if (data.public || isOwner) {
        const li = document.createElement("li");
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = data.completed;
        checkbox.onchange = () => {
          db.collection("tasks").doc(doc.id).update({
            completed: checkbox.checked,
            completedBy: checkbox.checked ? displayName : null
          });
        };

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + data.task));
        li.appendChild(label);

        if (data.completedBy) {
          const who = document.createElement("span");
          who.textContent = ` ✅ Done by: ${data.completedBy}`;
          who.style.fontSize = "0.8em";
          who.style.color = "green";
          li.appendChild(who);
        }

        list.appendChild(li);
      }
    });
  });
}
