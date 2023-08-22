function log() {
	if (window.Console) Console.log({ file: 'nextcloud.js' }, ...arguments)
}

export async function poller({ domain = 'https://vera.se.tab.digital', ext = '/index.php/login/v2' } = {}) {
	log('poller', domain + ext);
	let options = {
		method: 'POST',
		//headers,
		body: domain + ext,
	};
	return await fetch('https://bullhoff.com/nextcloud/RequestAccess', options)
		.then(async (res) => {
			return await res.json();
		})
		.then((json) => {
			window.open(json.login, '_blank');
			return startPoll(json);
		});
}
export async function startPoll(json) {
	log('startPoll', json);
	const headers = new Headers();
	headers.append('Connection', 'keep-alive');
	let options = {
		method: 'POST',
		headers,
		body: JSON.stringify(json),
	};
	return await fetch('https://bullhoff.com/nextcloud/Poll', options).then(async (res) => {
		return await res.json();
	}).catch((err) => {
		return console.error('err', err)
	});
}
export async function getFile(baseUrl, folder, file, auth) {
	// url := normalizeURL(request.BaseUrl + "/" + request.Folder + "/" + request.File)
	log('getFile', { baseUrl, folder, file, auth });
	if (!baseUrl || !file || !auth) return {}
	const headers = new Headers();
	headers.append('Connection', 'keep-alive');
	//headers.append('Content-Type', 'application/json');
	let options = {
		headers,
		method: 'POST',
		body: JSON.stringify({ baseUrl, folder, file, auth })
	};
	log('getFile', options);
	return await fetch('https://bullhoff.com/nextcloud/GetFile', options).then(async (res) => {
		let json = await res.text();
		return json;
	}).catch((err) => {
		return console.error('err', err)
	});
}

export async function saveFile(baseUrl, folder, file, auth, data) {
	log('saveFile', { baseUrl, folder, file, auth, data });
	if (typeof data == 'object') data = JSON.stringify(data)
	const headers = new Headers();
	headers.append('Connection', 'keep-alive');
	headers.append('Content-Type', 'application/json');
	let options = {
		headers,
		method: 'POST',
		body: JSON.stringify({ baseUrl, folder, file, auth, data }),
	};
	log('saveFile', options);
	return await fetch('https://bullhoff.com/nextcloud/SaveFile', options).then(async (res) => {
		return await res.text();
	}).catch((err) => {
		return console.error('err', err)
	});
}

export async function deleteFile(baseUrl, folder, file, auth,) {
	log('deleteFile', { baseUrl, folder, file, auth, });
	const headers = new Headers();
	headers.append('Connection', 'keep-alive');
	headers.append('Content-Type', 'application/json');
	let options = {
		headers,
		method: 'POST',
		body: JSON.stringify({ baseUrl, folder, file, auth, }),
	};
	log('deleteFile', options);
	return await fetch('https://bullhoff.com/nextcloud/DeleteFile', options).then(async (res) => {
		return await res.text();
	}).catch((err) => {
		return console.error('err', err)
	});
}


/* https://vera.se.tab.digital/remote.php/dav/files/daniel.lundell@gmail.com/ */
export async function getFolderContent(baseUrl, folder, auth) {
	log('getFolderContent', { baseUrl, folder, auth, });
	if (!baseUrl || !auth) return {}
	const headers = new Headers();
	headers.append('Connection', 'keep-alive');
	//headers.append('Content-Type', 'application/json');
	let options = {
		headers,
		method: 'POST',
		body: JSON.stringify({ baseUrl, folder, auth })
	};
	log('getFile', options);
	return await fetch('https://bullhoff.com/nextcloud/GetFiles', options).then(async (res) => {
		return await res.text();
	}).catch((err) => {
		return console.error('err', err)
	});
}
/* 
status: 504
statusText: "Gateway Time-out"
*/

/* 
<?xml version="1.0" encoding="utf-8"?>
<d:error xmlns:d="DAV:" xmlns:s="http://sabredav.org/ns">
  <s:exception>Sabre\DAV\Exception\NotFound</s:exception>
  <s:message>File with name //bullhoff could not be located</s:message>
</d:error>

*/
