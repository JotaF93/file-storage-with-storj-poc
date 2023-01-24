import React, { ChangeEvent, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import S3 from 'aws-sdk/clients/s3';

//API KEY 1dfHwQq8oAkpiLCKiDYxKuUE5afM6w6iG1ri9k1vCJWayLRQeZ4kcPFu1Vgx5BEnbdrzLtua3wf7PsAkCEPLf9esJC288n9bkRUUsSybs7JVryDSwdzs

//Satellite addres = 12EayRS2V1kEsWESU9QMRseFhdxYxKicsiFmxrsLZHeLUtdps3S@us1.storj.io:7777
function App() {
	const [file, setFile] = useState<File>();

	const accessKeyId = 'jwajxrwbnfh6xon7bzgrybjdayfa';
	const secretAccessKey =
		'j3msl4tnq2riqfwazr6zc37hydf23d2byjzl7oae33xv5ldyucdae';
	const endpoint = 'https://gateway.storjshare.io';

	const s3 = new S3({
		accessKeyId,
		secretAccessKey,
		endpoint,
		s3ForcePathStyle: true,
		signatureVersion: 'v4',
		httpOptions: { timeout: 0 },
	});

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const uploadFiles = async (file: Blob) => {
		// `file` can be a readable stream in node or a `Blob` in the browser

		const params = {
			Bucket: 'test-bucket',
			Key: 'key',
			Body: file,
		};

		await s3
			.upload(params, {
				partSize: 64 * 1024 * 1024,
			})
			.promise();
		console.log('success');
	};

	const params = {
		Bucket: 'test-bucket',
		Key: 'key',
	};

	const url = s3.getSignedUrl('getObject', params);

	console.log(url);

	const handleUploadClick = async () => {
		if (!file) {
			return;
		}
		uploadFiles(file);
	};

	useEffect(() => {
		const buckets = async () => {
			const { Buckets } = await s3.listBuckets().promise();

			console.log(Buckets);
		};

		buckets();
	}, []);

	return (
		<div className='App'>
			<header className='App-header'>
				<img src={logo} className='App-logo' alt='logo' />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<input className='App-link' type='file' onChange={handleFileChange} />
				<button onClick={handleUploadClick}>Upload File</button>
			</header>
		</div>
	);
}

export default App;
