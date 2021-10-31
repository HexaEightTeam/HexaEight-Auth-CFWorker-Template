addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

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

async function handleRequest(request) {
  const usercookiedomain = cookiedomain;
  const userdatasink = datasink;
  const userdatasinkprotocol = datasinkprotocol;

  if (request.method === 'POST' ) {

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
            
    let url = userdatasinkprotocol + "://" + userdatasink + "/" + sinklocation;
    var resp = await fetch(url);
    var userauthtoken = await resp.text();

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
	let expTStamp = Math.floor(Date.now() / 1000)+3600;
        let token = `hexaeighttoken=${userauthtoken.trim()}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;  max-age=3600;`;
        let token2 = `hexaeightuserinfo=${whois.user.trim()+":"+expTStamp.toString()+";"}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;  max-age=3600;`;
        let response = new Response('SessionResponse: User Authenticated Successfully.', {
        headers: { 'content-type': 'text/plain',
        'Set-Cookie': `hexaeightsessionid=${whois.clientcodechallenge}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;  max-age=3600;`,
        },
        });
        response.headers.append('Set-Cookie', `hexaeighttoken=${userauthtoken.trim()}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;  max-age=3600;`);
        response.headers.append('Set-Cookie', `hexaeightuserinfo=${whois.user.trim()+":"+expTStamp.toString()+";"}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;  max-age=3600;`);
        return response;
      }
      else
      {
        return new Response('Unauthorized Request', {
          headers: { 'content-type': 'text/plain' },
        });
      }
  }
  else
  {
	if (request.method === 'GET' || request.method === 'OPTIONS' || request.method === 'HEAD' ) {
		const url = new URL(request.url)

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
		      let expTStamp = Number(ttlleft) - Math.floor(Date.now() / 1000);

		      if (Number(expTStamp) < 900) {

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

				let newexpTStamp = Math.floor(Date.now() / 1000) + 3600;
			        let response = new Response('SessionResponse: User Session Extended Successfully.', {
			        headers: { 'content-type': 'text/plain',
					        'Set-Cookie': `hexaeighttoken=${newtoken.toString().trim()}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;  max-age=3600;`,
				        },
			        });
			        response.headers.append('Set-Cookie', `hexaeightuserinfo=${useremail.trim()+":"+newexpTStamp.toString()+";"}; path=/; domain=${usercookiedomain}; secure; HttpOnly; SameSite=Strict;  max-age=3600;`);
			        return response;
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
			return new Response('Unauthorized Request', {
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










