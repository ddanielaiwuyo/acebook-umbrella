import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import {Link} from "react-router-dom";

import { signup } from "../../services/authentication";

import { PreLoginButton } from "../../components/PreLoginButton";
import { InputField } from "../../components/InputField";

import "./SignupPage.css";

export function SignupPage() {
	const [firstName, setFirstName] = useState("");
	const [surname, setSurname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState("");
	const navigate = useNavigate();

	async function handleSubmit(event) {
		event.preventDefault();
		try {
			const response = await signup(email, password);
			if (response.status != 201) {
				setErrors(response.message)
				return
			}
			setErrors("")
			navigate("/login", { replace: true }); // To prevent user to go to signup page again if pressing bckspace;
		} catch (err) {
			console.error(err);
			navigate("/signup");
		}
	}


	return (
		<div className="signup-page">
			<div className="left-container">
				<div className="signup-form">
					<h1>Create your account</h1>
					<p className="errors"> {errors}</p>
					<form onSubmit={handleSubmit}>
						<InputField
							type="text"
							placeholder="First Name"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							required
						/>
						<InputField
							type="text"
							placeholder="Surname"
							value={surname}
							onChange={(e) => setSurname(e.target.value)}
							required
						/>
						<InputField
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<InputField
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<div className="btn">
							<PreLoginButton type="submit">Sign Up</PreLoginButton>
						</div>
						<div className="already-registered">
							<p>
								Already registered?{" "}
								<Link to="/login">
									<strong>Log in</strong>
								</Link>{" "}
								and continue your journey.
							</p>
						</div>
					</form>
				</div>
			</div>

			<div className="right-container">
				<div className="greeter">
					<h1>Start your Acebook journey today</h1>
					<h2>Sign up in seconds and get connected.</h2>
				</div>
			</div>
		</div>
	);
}
