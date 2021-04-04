import './App.css';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';

function App() {
	const [image, setimage] = useState('');
	useEffect(() => {
		//this is the route were we get the image metadata which contains its name, type, etc
		Axios.get('http://localhost:5000/files/').then((response) => {
			//this is route where we stream the image
			setimage('http://localhost:5000/image/' + response.data[0].filename);
		});
	}, []);

	return (
		<div className="App">
			Did the image load?
			<img src={image} alt="a cat" />
		</div>
	);
}
export default App;
