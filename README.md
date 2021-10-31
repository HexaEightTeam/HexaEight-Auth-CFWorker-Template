"# HexaEight-Auth-CFWorker-Template" 
# `HexaEight Authentication template using CloudFlare Workers`

A template for implementing HexaEight Quick Authentication with a Public DataSink

[`index.js`](https://github.com/HexaEightTeam/HexaEight-Auth-CFWorker-Template/blob/main/index.js) contains the Worker Script

#### Wrangler

This template requires [wrangler](https://github.com/cloudflare/wrangler).

Proceed to the next steps after installing wrangler.

Install This Worker Template using the below steps:

--Create your worker. Change the yourworkername to name of your choice. 
1. wrangler generate yourworkername https://github.com/HexaEightTeam/HexaEight-Auth-CFWorker-Template

--Create a KV namespace to store API Keys
2. wrangler kv:namespace create "APIKeys"
 Creating namespace with title "<yourworkername>-APIKeys"
 Success!
Add the following to your configuration file:
kv_namespaces = [
         { binding = "APIKeys", id = "<An ID gets generated here>" }
]
Make note of the above id, this is required in step 3

3. Edit wranger.toml and change the below to match your cloudflare account

account_id = "<your cloudflare account id"
routes = ["*.yourdomain.com/login*"] - Implements authentication for all subdomains under yourdomain.com
zone_id = "yourzoneid"

kv_namespaces = [
         { binding = "APIKeys", id = "<put the KV ID generated in Step 2>" }
]

[vars]
datasinkprotocol = "https" - Change this if you need to set a different protocol for datasink otherwise leave it as it is.
datasink = "api.cl1p.net" - Change this if you want to use a different private or public datasink, no http or https, just datasinkname
cookiedomain = ".yourdomain.com"  - Prefix a dot to allow a cookie to be set for all you subdomains

Save this File

4. Get an API Key for HexaEight Secure Platform from [`RapidAPI`] (https://rapidapi.com/hexaeight-hexaeight-default/api/hexaeight-sso-platform/pricing)
A Free Plan is available if you want to test the authentication. Once you have subscribed to a plan, your Rapid API key is available 
@
[`Rapid API Dashboard`](https://rapidapi.com/developer/dashboard) --> Choose the default application --> Security on the left hand pane --> Application Key
Copy the API Key and 

Run the below command to save your API Key as a secret inside Cloud Flare
wrangler kv:key put --binding=APIKeys "RapidAPIKey" "<your api Key>"


That is it!! Publish your worker
5. wrangler publish

Lastly publish a static web page and point your application to the static web page and your authentication is ready.

Further documentation for HexaEight Authentication and Static Web Site can be found [here](https://www.hexaeight.com/cfworkers.html).

