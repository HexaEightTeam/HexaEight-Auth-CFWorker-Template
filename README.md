"# HexaEight-Auth-CFWorker-Template" 
# `HexaEight Authentication template using CloudFlare Workers using Public Data Sink`

A template for implementing HexaEight Quick Authentication using CloudFlare Workers

[`index.js`](https://github.com/cloudflare/worker-template/blob/master/index.js) contains the Worker Script

#### Wrangler

To generate using [wrangler](https://github.com/cloudflare/wrangler)
```

Install This Worker Template using the below steps:

--Create your worker 
1. wrangler generate yourworkername https://github.com/hexaeight/hexa8authcfworker-template

--Create a KV namespace
2. wrangler kv:namespace create "APIKeys"
 Creating namespace with title "hexa8authcfworker-template-APIKeys"
 Success!
Add the following to your configuration file:
kv_namespaces = [
         { binding = "APIKeys", id = "edc10a33f1874e4fe0ad1943fb6adaa0d" }
]
Make note of the above id, this is required in step 3

3. Edit wranger.toml and change the below to match your cloudflare account

account_id = "<your account id"
routes = ["*.mydomain.com/login","*.mydomain.com/login-dashboard"] - To implement authentication for all subdomains under mydomain
zone_id = "yourzoneid"

kv_namespaces = [
         { binding = "APIKeys", id = "<put the KV ID generated in Step 2>" }
]

[vars]
datasinkprotocol = "https" - Change this if you need to set a different protocol for datasink
datasink = "api.cl1p.net" - Change this if you want to use a different private or public datasink, no http or https, just datasinkname
cookiedomain = ".mydomain.com"  - Prefix a dot to allow a cookie to be set for all you subdomains

Save the File

4. Get an API Key for HexaEight Secure Platform from [`RapidAPI`] (https://rapidapi.com/hexaeight-hexaeight-default/api/hexaeight-sso-platform/pricing)
A Free Plan is available if you want to test the authentication. Once you have subscribed to a plan, your Rapid API key is available 

[`Rapid API Dashboard`](https://rapidapi.com/developer/dashboard) --> Choose the default application --> Security on the left hand pane --> Application Key
Copy the API Key and 

Run the below command to save your API Key as a secret inside Cloud Flare
wrangler kv:key put --binding=APIKeys "RapidAPIKey" "<your api Key>"


That is it!! Publish your worker
5. wrangler publish

Lastly publish a static web page and point your application to the static web page and your authentication is ready.

Further documentation for HexaEight Authentication and Static Web Site can be found [here](https://www.hexaeight.com/cfworkers.html).

