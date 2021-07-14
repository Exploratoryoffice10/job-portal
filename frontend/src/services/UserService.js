import axios from 'axios'
const userLogin = '/api/users/login'
const applicantRegister = '/api/applicants/register'
const recruiterRegister = '/api/recruiters/register'
const userLink = '/api/users'
 
const register = newUser => {

	console.log(newUser.user.role)
	if (newUser.user.role === 'applicant'){

		const request = axios.post(applicantRegister, newUser)
		console.log(request);		
		return request.then(response => response.data)	
	}
	else if (newUser.user.role === 'recruiter'){
		const request = axios.post(recruiterRegister, newUser)
		console.log(request);
		return request.then(response => response.data)
	}
	
}

const login = (user) => {
	const request = axios.post(userLogin, user)
	console.log(request);
	return request.then(response => response.data)
}

const logout = (user) => {
	const request = axios.delete(userLink)
	console.log(request,'logouttest');
	return request.then(response => response.data)
}

const checkLogin = async () => {
	let data = ''
	const request = axios.get(userLink)
	await request.then(response => {
		data = response.data
	})
	return data
}


const UserService = { register, login, logout, checkLogin }

export default UserService