function showCreateProject() {
	document.getElementById('createProject').classList.remove('hidden');
}

function hideProjectForm() {
	document.getElementById('createProject').classList.add('hidden');
	document.getElementById('createProjectForm').reset();
}

function showMultiCreateProject() {
	document.getElementById('multiCreateProject').classList.remove('hidden');
	
}

function hideMultiProjectForm() {
	document.getElementById('multiCreateProject').classList.add('hidden');
	document.getElementById('projectForms').innerHTML = '';
}function showDeleteManyProject() {
	document.getElementById('deleteMany').classList.remove('hidden');

}

function hideDeleteManyProject() {
	document.getElementById('deleteMany').classList.add('hidden');
	document.getElementById('deleteManyForm').reset()
}



function showEditForm(editForm) {
	const projectContainer = editForm.closest('.projectContainer');
	projectContainer.classList.remove('hidden');
	editForm.classList.remove('hidden');
}

function hideEditForm(editForm) {
	const projectContainer = editForm.closest('.projectContainer');
	projectContainer.classList.add('hidden');
	editForm.classList.add('hidden');
}

document.getElementById('deleteManyForm').addEventListener('submit', function(e) {
	e.preventDefault();

	if (!confirm("Are you sure you want to delete the selected projects?")) {
		return;
	}

	const form = document.getElementById('deleteManyForm');
	const formData = new FormData(form);
	const projectIds = [];

	for (const pair of formData.entries()) {
		if (pair[0] === 'projectId') {
			projectIds.push(pair[1]);
		}
	}

	fetch(`/project/deleteMany/${projectIds}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	})
	.then((response) => {
		if (!response.ok) {
			return response.text().then(text => { throw new Error(text) })
		}
		return response.json();
	})
	.then((data) => {
		console.log(data);
		alert('All the selected projects have been deleted.');
		location.reload()
	})
	.catch(error => {
		alert('Could Not Delete Projects')
		console.error('Error: ', error.message);

	});
});




document.querySelectorAll(".delete-btn").forEach((button) => {
	button.addEventListener("click", () => {
			const projectContainer = button.closest(".projectContainer");
			const projectName = projectContainer.querySelector("h1").textContent.trim();
			const projectId = projectContainer.querySelector(".projectId").textContent.trim();

			if (confirm(`Are you sure you want to delete ${projectName}?`)) {
					fetch(`/project/${projectId}`, {
							method: "DELETE",
							headers: { "Content-Type": "application/json; charset=UTF-8" },
					})
					.then((response) => response.json())
					.then((json) => {
							location.reload();
					})
					.catch((error) => {
							console.error('Error:', error);
					});
			}
	});
});




document.getElementById('createProjectForm').addEventListener('submit', (e) => {
	e.preventDefault();

	const Image = document.getElementById('projectImg');
	const file = Image.files[0];
	const reader = new FileReader();

	reader.onloadend = () => {
			const base64String = reader.result.split(',')[1];

			const formData = {
					projectName: document.getElementById('projectName').value,
					studentName: document.getElementById('studentName').value,
					grade: document.getElementById('grade').value,
					yearMade: document.getElementById('yearMade').value,
					madeUsing: document.getElementById('madeUsing').value,
					projectImg: base64String,
					projectDescription: document.getElementById('projectDescription').value,
					projectURL: document.getElementById('projectURL').value,
					coursePage: document.getElementById('coursePage').value,
			};

			fetch('/project', {
					method: "POST",
					headers: { "Content-Type": "application/json; charset=UTF-8" },
					body: JSON.stringify(formData)
			})
			.then((response) => response.json())
			.then(data => {
					hideProjectForm();
					location.reload()
			})
			.catch(error => {
					console.error('Error: ', error);
			});
	};

	reader.readAsDataURL(file);
});

document.querySelectorAll('.edit-btn').forEach((button) => {
	button.addEventListener('click', () => {
			const projectContainer = button.closest(".projectContainer");
			const projectId = projectContainer.querySelector(".projectId").textContent.trim();
			const editForm = projectContainer.querySelector('.editForm');

			showEditForm(editForm);

			editForm.addEventListener('submit', (e) => {
					e.preventDefault();
					const projectImage = editForm.querySelector('#editprojectImg');
					const file = projectImage.files[0];
					const reader = new FileReader();

					reader.onloadend = () => {
							let base64String = null;

							if (file) {
									base64String = reader.result.split(',')[1];
							} else {
									const existingImg = projectContainer.querySelector('img');
									base64String = existingImg.src.split(',')[1];
							}

							const formData = {
									projectName: editForm.querySelector('#editprojectName').value,
									studentName: editForm.querySelector('#editstudentName').value,
									grade: editForm.querySelector('#editgrade').value,
									yearMade: editForm.querySelector('#edityearMade').value,
									madeUsing: editForm.querySelector('#editmadeUsing').value,
									projectImg: base64String,
									projectDescription: editForm.querySelector('#editprojectDescription').value,
									projectURL: editForm.querySelector('#editprojectURL').value,
									coursePage: editForm.querySelector('#editcoursePage').value,
							};

							fetch(`/project/${projectId}`, {
									method: 'PATCH',
									headers: {
											'Content-Type': 'application/json',
									},
									body: JSON.stringify(formData),
							})
							.then((response) => response.json())
							.then((data) => {
									hideEditForm(editForm);
									// location.reload()
							})
							.catch((error) => {
									console.error('Error:', error);
							});
					};

					if (file) {
							reader.readAsDataURL(file);
					} else {
							reader.onloadend();
					}
			});
	});
});

const logoutButton = document.getElementById('logoutBtn');
logoutButton.addEventListener('click', function(e) {
	fetch('/teacher/admin/logout')
	.then(response => {
			if (response.ok) {
					location.href = '/project/admin/login';
			} else {
					alert('Failed to log out!');
			}
	});
});
