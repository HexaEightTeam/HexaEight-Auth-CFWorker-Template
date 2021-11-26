addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function loginpagehtml() {
	return  `
	<html lang="en">
	<title>Sign In</title>
	<head>
	    <meta charset="utf-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    	<!-- SEO Meta Tags -->
	    <meta name="description" content="Login Using HexaEight QR Code">
	    <meta name="author" content="Provided By HexaEight">

	     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css">
	     <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
	     <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
	      <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js"></script>

		<style>
		*{
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		.btn-pulse{
		  color: #1c264a;
		  position: relative;
		  left: 50%;
		  transform: translate(-50%, -50%);
		  width: 75px;
		  height: 75px;
		  border-radius: 50%;
		  border: 2px solid #2debae;
		  background-color: #2debae;
		  display: flex;
		  justify-content: center;
		  align-items: center;
		  cursor: pointer;
		  box-shadow: 0 0 0 0 #2debae;
		  animation: pulse 1.3s  infinite;
		}
		@keyframes pulse {
		  to {
		    box-shadow: 0 0 0 16px rgba(255,255,255,0.01);
		  }
		}



		body {
			height: 100vh;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #EE8FA6;
			background: -webkit-linear-gradient(45deg, #3C88CF, #EE8FA6, #FBE9DE);
			background: linear-gradient(45deg, #3C88CF, #EE8FA6, #FBE9DE);
			font-family: 'Roboto', sans-serif;
		}
		.screen {
			min-width: 360px;
			background-color: #FFFFFF;
			border-radius: 20px;
		  	text-align: center;
			padding: 18px;
			display: flex;
			flex-direction: column;
		}
		.register-heading{
		    text-align: center;
		    margin-top: 0%;
		    margin-bottom: 0%;
		    color: #495057;
		    display: flex;
		    flex-direction: column;
		}
		
		.hover01 figure img {
			-webkit-transform: scale(1);
			transform: scale(1);
			-webkit-transition: .3s ease-in-out;
			transition: .3s ease-in-out;
		}
		.hover01 figure:hover img {
			-webkit-transform: scale(1.3);
			transform: scale(1.3);
		}


		</style>
		
		</head>
		
		<div class="screen register-heading">
		<button class="btn-pulse" id="login-hexaeight-button">Login</button>
		<div id="boxsize" class="register-heading">
		<h3><strong>Sign In </strong></h3>
		<p class="small below-txt1">Click On The Login Button Post QR Code Authorization</p>
		<p class="small below-txt1"><a href="https://www.hexaeight.com/docs/quick-instructions.html" target=_blank>Instructions</a></p>
		<p class="small below-txt2">HexaEight QR Code</p>
		<div id="display-hexaeight-qrcode">
		</div>
		<div id="display-hexaeight-qrcodeid">
		</div>
        	<button class="small" id="scan-hexaeight-qrcode">Scan QR Code</button> <br/>
		<div class="hover01 column">
			<figure> <img src="` + bottomlogo + `" width = "50" height = "50"/> </figure>
		</div>
		</div>
		</div>
	
	</html>
	
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js"></script>
	
	
	<script>
		console.log("Login Page Loaded Successfully");
	</script>	

` + `<script id="hexaeightclient" src="https://cdn.jsdelivr.net/gh/hexaeight/jslibrary/hexaeight-token-quickauth.js" servername="` + servername + `" path="` + path + `" redirecturl="/loginsuccess" clientappcode="` + clientappcode + `" datasinkprotocol="` + datasinkprotocol + `" datasinkurl="` + datasink + `"></script>

`;
}

function loginsuccesspage(user) {
	let info = user.split("@");
	let username=info[0];

	return  `
	<html lang="en">
	<meta charset="utf-8"/>
	<title>Sign In - Success</title>
	<head>
		<style type="text/css">
		body {text-align: center}
		</style>

	<body>
		<h1 center>Login - Success</h1>
		<div>
		        <p>Hello ` + username + `, Login Successful. Welcome To Dashboard Page.</p>
		</div>
	`;
}



    function sha256(plain) {
      // returns promise ArrayBuffer
      const encoder = new TextEncoder();
      const data = encoder.encode(plain);
      return crypto.subtle.digest("SHA-256", data);
    }

    function base64urlencode(a) {
      var str = "";
      var bytes = new Uint8Array(a);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        str += String.fromCharCode(bytes[i]);
      }
      return btoa(str)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }

    async function generateCodeChallengeFromVerifier(v) {
      var hashed = await sha256(v);
      var base64encoded = base64urlencode(hashed);
      return base64encoded;
    }


function parseUserData(data){
    try {
      return JSON.parse(data);
    } catch(ex){
      return {'user': 'Unknown user'};
    }
}

function validateemail(email){
	let atpos = email.indexOf("@");
	let domain = email.split("@")[1];
	if (email == null || email == "") {
	    return false;
	} 
	else if (atpos < 1 || (emaildomainslist.indexOf(domain) == -1)) {
	    return false;
	} 
	return true;
}

async function handleRequest(request) {
  const usercookiedomain = cookiedomain;
  const userdatasink = datasink;
  const userdatasinkprotocol = datasinkprotocol;
  const url = new URL(request.url)


  if (request.method === 'POST' ) {

  	if (url.toString().includes("/login/sink/") && usecfdatasink.toUpperCase() === 'YES')  {
	
	    let cookies = request.headers.get('Cookie') || "";
	    if (cookies.includes("hexaeightsessionid=")) {
	      const matches = cookies.match(/hexaeightsessionid=(.*)/)
	      let username = decodeURIComponent(matches[1]);
	      return new Response('SessionResponse: User Authenticated Successfully.', {
        	headers: { 'content-type': 'text/plain'},
	      });
	    }
		var urlvalue = url.toString();
		var key = urlvalue.substring(urlvalue.lastIndexOf('/') + 1);
		console.log(urlvalue);
		console.log(key);
		let requestbody = await request.text();
		await DATASink.put(key, requestbody, {expirationTtl: 180});
		return new Response('Ok.', {
        		headers: { 'content-type': 'text/plain' },
		});

 	 }


    let cookies = request.headers.get('Cookie') || "";
    if (cookies.includes("hexaeightsessionid=")) {

      const matches = cookies.match(/hexaeightsessionid=(.*)/)
      let username = decodeURIComponent(matches[1]);
      return new Response('SessionResponse: User Authenticated Successfully.', {
        headers: { 'content-type': 'text/plain' },
      });
    }

    let requestbody = await request.text() + '||';
    var incomingrequest = requestbody.split("|");
    var sinklocation = incomingrequest[0];
    var usercode = incomingrequest[1];
    var challenge = await generateCodeChallengeFromVerifier(usercode);


    var resp = "";
    var userauthtoken = "";

    if (usecfdatasink === "YES") {
	    userauthtoken = await DATASink.get(sinklocation.toString());
	    await DATASink.delete(sinklocation.toString());
    }
    else {
	    let url = userdatasinkprotocol + "://" + userdatasink + "/" + sinklocation;
	    resp = await fetch(url);
	    userauthtoken = await resp.text();
    }
    

    var hexa8resp = await fetch("https://hexaeight-sso-platform.p.rapidapi.com/fetchauthtoken", {
          "method": "POST",
          "headers": {
          "content-type": "text/plain",
	        "x-rapidapi-host": "hexaeight-sso-platform.p.rapidapi.com",
		      "x-rapidapi-key": RapidAPIKey
	      },
	    "body": userauthtoken,
      });

      var userinfo = await hexa8resp.text();

      const whois = parseUserData(userinfo);

      if (whois.user != "Unknown user" && whois.clientcodechallenge == challenge)
      {
	if (emaildomainsfilter.toUpperCase() == "NO") {
		//let expTStamp = Math.floor(Date.now() / 1000)+3600;
		let expTStamp = Number(whois.exp)*60*1000;
	        let token = `hexaeighttoken=${userauthtoken.trim()}; expires=${expTStamp}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;`;
	        let token2 = `hexaeightuserinfo=${whois.user.trim()+":"+expTStamp.toString()+";"}; expires=${expTStamp}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;`;
	        let response = new Response('SessionResponse: User Authenticated Successfully.', {
	        headers: { 'content-type': 'text/plain',
	        'Set-Cookie': `hexaeightsessionid=${whois.clientcodechallenge}; expires=${expTStamp}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;`,
	        },
	        });
	        response.headers.append('Set-Cookie', `hexaeighttoken=${userauthtoken.trim()}; expires=${expTStamp}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;`);
	        response.headers.append('Set-Cookie', `hexaeightuserinfo=${whois.user.trim()+":"+expTStamp.toString()+";"}; expires=${expTStamp}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;`);

		if (auditing === "ENABLED") {
			await AUDITLogs.put(Date.now(),"LoginSuccess:"+whois.user +":"+ JSON.stringify(whois) , {expirationTtl: 604800});
		}

        	return response;
	}
	else {
		if (emaildomainsfilter.toUpperCase() == "YES" && validateemail(whois.user)) {
			//let expTStamp = Math.floor(Date.now() / 1000)+3600;
			let expTStamp = Number(whois.exp)*60*1000;
			let expDate = new Date();
			expDate.setTime(expTStamp);
		        let token = `hexaeighttoken=${userauthtoken.trim()}; expires=${expDate}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;`;
		        let token2 = `hexaeightuserinfo=${whois.user.trim()+":"+expTStamp.toString()+";"}; expires=${expTStamp}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;`;
	        	let response = new Response('SessionResponse: User Authenticated Successfully.', {
			        headers: { 'content-type': 'text/plain',
		        	'Set-Cookie': `hexaeightsessionid=${whois.clientcodechallenge}; expires=${expDate}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict; `,
		        	},
		        });
		        response.headers.append('Set-Cookie', `hexaeighttoken=${userauthtoken.trim()}; expires=${expDate}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;`);
	        	response.headers.append('Set-Cookie', `hexaeightuserinfo=${whois.user.trim()+":"+expTStamp.toString()+";"}; expires=${expDate}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;`);

			if (auditing === "ENABLED") {
				await AUDITLogs.put(Date.now(),"LoginSuccess:"+ whois.user + ":" + JSON.stringify(whois) , {expirationTtl: 604800});
			}

	        	return response;
		}
		else {
			if (auditing === "ENABLED") {
				await AUDITLogs.put(Date.now(),"LoginBlocked:"+whois.user +":"+ JSON.stringify(whois) , {expirationTtl: 604800});
			}

		        return new Response('Sorry, The Owner of this Site has enforced login only for specific Email Domains. Contact Owner', {
        		  headers: { 'content-type': 'text/plain' },
	        	});
		}
	}
	
      }
      else
      {
	if (auditing === "ENABLED") {
		await AUDITLogs.put(Date.now(),"LoginAttempt:"+whois.user +":"+ JSON.stringify(whois), {expirationTtl: 604800});
	}

        return new Response('Unauthorized Request', {
          headers: { 'content-type': 'text/plain' },
        });
      }
  }
  else
  {
	if (request.method === 'GET' || request.method === 'OPTIONS' || request.method === 'HEAD' ) {
		const url = new URL(request.url)

		if (url.toString().endsWith("/loginpage"))
		{
			const html = loginpagehtml()
			    return new Response(html, {
			      headers: {
			        "content-type": "text/html;charset=UTF-8",
			        'Access-Control-Allow-Methods': 'OPTIONS, HEAD, POST, GET',
			      },
			    });

		}

		if (url.toString().endsWith("/loginsuccess"))
		{
		    let cookies = request.headers.get('Cookie') || "";
		    if (cookies.includes("hexaeightsessionid=")) {

		      let cookies = request.headers.get('Cookie') || "";
		      const userinfo = cookies.match(/hexaeightuserinfo=(.*)/)
		      let userdetails = decodeURIComponent(userinfo[1]);
		      let enduser = userdetails.split(":");
		      let useremail=enduser[0];
		      let ttlleft=enduser[1];

			const htmlsuccess = loginsuccesspage(useremail)
			    return new Response(htmlsuccess, {
			      headers: {
			        "content-type": "text/html;charset=UTF-8",
			        'Access-Control-Allow-Methods': 'OPTIONS, HEAD, POST, GET',
			      },
			    });
		   }
		   else
		   {
			return new Response('Unauthorized Request', {
				headers: { 'content-type': 'text/plain' },
		   	 });
		   }


		}


		if (url.toString().endsWith("/login"))
		{
			    let cookies = request.headers.get('Cookie') || "";
			    if (cookies.includes("hexaeightsessionid=")) {
				      const matches = cookies.match(/hexaeightsessionid=(.*)/)
				      let username = decodeURIComponent(matches[1]);
				      return new Response('SessionResponse: User Authenticated Successfully.', {
					        headers: { 'content-type': 'text/plain' },
				      });
				}
				else
				{
				      return new Response('Unauthorized Request', {
				        headers: { 'content-type': 'text/plain' },
				});
			    }

		}

		if (url.toString().endsWith("/login/getuseremail"))
		{
		 
			    let cookies = request.headers.get('Cookie') || "";
			    if (cookies.includes("hexaeightsessionid=")) {

				      const userinfo = cookies.match(/hexaeightuserinfo=(.*)/)
				      let userdetails = decodeURIComponent(userinfo[1]);
				      let enduser = userdetails.split(":");
				      let useremail=enduser[0];
				      let ttlleft=enduser[1];
				      let expTStamp = Number(ttlleft) - Math.floor(Date.now() / 1000);
				    	return new Response(useremail, {
					        headers: { 'content-type': 'text/plain' },
				      });
				}
				else
				{
				      return new Response('Unauthorized Request', {
				        headers: { 'content-type': 'text/plain' },
				});
			    }
		}

		if (url.toString().endsWith("/login/getsessionexpiry"))
		{
			try {
			      let cookies = request.headers.get('Cookie') || "";
			      const userinfo = cookies.match(/hexaeightuserinfo=(.*)/)
			      let userdetails = decodeURIComponent(userinfo[1]);
			      let enduser = userdetails.split(":");
			      let useremail=enduser[0];
			      let ttlleft=enduser[1];
			      let expTStamp = Number(ttlleft) - Math.floor(Date.now() / 1000);
			    	return new Response(expTStamp + ' Seconds Left', {
			        headers: { 'content-type': 'text/plain' },
			      });
			} catch (err)
			{				      
				return new Response('Unauthorized Request', {
				        headers: { 'content-type': 'text/plain' },
				});


			}
		}

		if (url.toString().endsWith("/login/extendSession"))
		{
		  try {
		    let cookies = request.headers.get('Cookie') || "";
		    if (cookies.includes("hexaeightsessionid=")) {
		      const userinfo = cookies.match(/hexaeightuserinfo=(.*)/);
		      const usertoken = cookies.match(/hexaeighttoken=(.*;)/);
		      const challenge = cookies.match(/hexaeightsessionid=(.*)/);

		      let utoken = decodeURIComponent(usertoken[1]);
		      utoken=utoken.replace(";","");
		      let userdetails = decodeURIComponent(userinfo[1]);
		      let enduser = userdetails.split(":");
		      let useremail=enduser[0];
		      let ttlleft=enduser[1];
		      let expTStamp = Number(ttlleft) - Date.now();

		      if (Number(expTStamp) < 900000) {

			    var hexa8resp = await fetch("https://hexaeight-sso-platform.p.rapidapi.com/extendauthtoken", {
			          "method": "POST",
			          "headers": {
			          "content-type": "text/plain",
				      "x-rapidapi-host": "hexaeight-sso-platform.p.rapidapi.com",
				      "x-rapidapi-key": RapidAPIKey
				      },
				    "body": utoken,
			      });

			      var newtoken = await hexa8resp.text();

			      if (newtoken.toString().length > 1000)
			      {

				    var hexa8user = await fetch("https://hexaeight-sso-platform.p.rapidapi.com/get-cookieuser", {
				          "method": "POST",
				          "headers": {
				          "content-type": "text/plain",
					      "x-rapidapi-host": "hexaeight-sso-platform.p.rapidapi.com",
					      "x-rapidapi-key": RapidAPIKey
					      },
					    "body": newtoken.trim(),
				      });

				      var uinfo = await hexa8user.text();
		
				      const whois = parseUserData(uinfo);

				      if (whois.user != "Unknown user")
				      {
						//let newexpTStamp = Math.floor(Date.now() / 1000) + 3600;
						let newexpTStamp = Number(whois.exp)*60*1000;
						let expDate = new Date();
						expDate.setTime(newexpTStamp);



					        let response = new Response('SessionResponse: User Session Extended Successfully.', {
					        headers: { 'content-type': 'text/plain',
						        'Set-Cookie': `hexaeighttoken=${newtoken.toString().trim()}; expires=${expDate}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;`,
						        },
					        });
					        response.headers.append('Set-Cookie', `hexaeightuserinfo=${useremail.trim()+":"+newexpTStamp.toString()+";"}; expires=${expDate}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;`);
			
						if (auditing === "ENABLED") {
							await AUDITLogs.put(Date.now(),"CookieExtensionSuccess:"+whois.user +":"+ JSON.stringify(whois) , {expirationTtl: 604800});
						}

					        return response;

				      }
				      else
				      {
					        let response = new Response('SessionResponse: ' + JSON.stringify(uinfo));
			
						if (auditing === "ENABLED") {
							await AUDITLogs.put(Date.now(),"CookieExtensionFailed:" + useremail +":"+ JSON.stringify(uinfo) , {expirationTtl: 604800});
						}



				      }
			     }
			     else
			     {
			    	return new Response("Ok", {
				        headers: { 'content-type': 'text/plain' },
				      });
			     }

			}
			else {
			    	return new Response("Ok", {
				        headers: { 'content-type': 'text/plain' },
			      });

			}
		    } 
		 } catch (err) {
			return new Response('Unauthorized Request' , {
			        headers: { 'content-type': 'text/plain' },
			});
                 }

		}


	        return new Response('Invalid Request', {
			headers: { 'content-type': 'text/plain' },
			});
			
	}
	else {
		return new Response('Invalid Method', {
			headers: { 'content-type': 'text/plain' },
			});
	}


  }
}
