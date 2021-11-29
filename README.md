#### HexaEight-Serverless-CFWorker-Template

This is the base template that implements HexaEight Serverless on a CloudFlare Worker.

Please report any issues related to this template in the issues section.

Limitations of HexaEight Serverless Deployed using Cloud Flare Workers : You cannot register only a subdomain in cloudflare, 
instead you will need to register your entire domain in cloudflare, the subdomain feature is only availble for enterprise customers.
So if you are planning on protecting only your subdomain using HexaEight Serverless, then this wont work unless you are a Cloudflare 
Enterprise customer.

We are aware of this limitation, alternatively HexaEight Serverless is expected to be available shortly on other Cloud Platforms like Microsoft Azure, AWS, GCP etc.
These alternatives can be utilized to deploy HexaEight Serverless in a subdomain directly.

[`index.js`](https://github.com/HexaEightTeam/HexaEight-Auth-CFWorker-Template/blob/main/index.js) contains the Worker Script

##### Wrangler

This template requires [wrangler](https://github.com/cloudflare/wrangler).

Proceed to the next steps after installing wrangler.

Install This Worker Template using the below steps:

#### 1. Create your worker. Change the yourworkername to name of your choice. 

>wrangler generate yourworkername https://github.com/HexaEightTeam/HexaEight-Auth-CFWorker-Template

#### 2. Edit wranger.toml and change the below to match your cloudflare account. 
If your correct account id and zone id is already shown, you can skip this and proceed to next step

>     account_id = "your cloudflare account id"
>     zone_id = "yourzoneid"

Save the File


#### 3. Create the KV namespaces and Client App Code 

API Keys - To Store API Key Secret

DATASink  - To Store Encrypted Tokens

AUDITLogs - To Store Audit Logs

>     wrangler kv:namespace create "APIKeys"

---
Creating namespace with title yourworkername-APIKeys"

Success!

Add the following to your configuration file:

kv_namespaces = [
{ binding = "APIKeys", id = "An ID gets generated here" }
]


>     wrangler kv:namespace create "DATASink"

---
Creating namespace with title yourworkername-DATASink"

Success!

Add the following to your configuration file:

kv_namespaces = [
{ binding = "DATASink", id = "An ID gets generated here" }
]

>
>     wrangler kv:namespace create "AUDITLogs"

---
Creating namespace with title yourworkername-AUDITLogs"

Success!

Add the following to your configuration file:

kv_namespaces = [
{ binding = "AUDITLogs", id = "An ID gets generated here" }
]


Make note of the above generated ids and input the appropriate IDs generated above.
Edit wranger.toml, and update the input the above generated KV ids into the respective bindings.

>     kv_namespaces = [
>         { binding = "APIKeys", id = "put the KV ID generated for APIKeys" },
>	      { binding = "DATASink", id = "put the KV ID generated in DATASink" },
>	      { binding = "AUDITLogs", id = "put the KV ID generated in AUDITLogs" }
>
>     ]


---

###### Get an API Key for HexaEight Secure Platform from [RapidAPI](https://rapidapi.com/hexaeight-hexaeight-default/api/hexaeight-sso-platform/pricing)

A Free Plan is available if you want to test the authentication. Once you have subscribed to a plan, your Rapid API key is available 
@
[Rapid API Dashboard](https://rapidapi.com/developer/dashboard) --> Choose the default application --> Security on the left hand pane --> Application Key
Copy the API Key and 

Run the below command to save your API Key as a secret inside Cloud Flare

>     wrangler secret put RapidAPIKey
  
Enter the secret text you'd like assigned to the variable RapidAPIKey on the script named newtestworker:
paste the api key here

Creating the secret for script name \<your worker name\>

  Success! Uploaded secret RapidAPIKey.
  
###### Run the below command to Generate a New Client App Code (or Client ID) for your Login Application using RAPID API Key hosted by CF Worker

Input the Rapid API Key and change the data field to reflect your application name.  This application name is for your internal use to identify
the login page from which the user got authenticated.  This output of this is a Client ID (similar to Oauth Client ID which is used to identify Apps)
This Client ID is tied to the Rapid API user account, so you can only decode the tokens for this Client ID using the same API keys associated with 
your Rapid API user account.

###### From Unix Or Mac using Shell
>     curl --header 'x-rapidapi-key: your rapidapi key' --data 'Default Login Application v 1.0' --request POST --url https://hexaeight-sso-platform.p.rapidapi.com/get-new-securetoken --header 'content-type: text/plain' --header 'x-rapidapi-host: hexaeight-sso-platform.p.rapidapi.com'

OR

###### From Windows using Powershell
>     $h = @{"x-rapidapi-host"="hexaeight-sso-platform.p.rapidapi.com"; "x-rapidapi-key"="your rapid api key";}
>     $response = Invoke-WebRequest -Body 'Default Login Application v 1.0' -Uri 'https://hexaeight-sso-platform.p.rapidapi.com/get-new-securetoken' -Method POST -Headers $h -ContentType 'text/plain';[System.Text.Encoding]::UTF8.GetString($response.Content);


#### 4. Edit wranger.toml, change your domain and input the generated Client Id and make the required changes to the config file as indicated below

>     #Implements authentication for all subdomains under yourdomain.com, if you want to protect only one subdomain change the first \* to your domainname
>     routes = ["\*.yourdomain.com/login\*"] - 
>
>
>     [vars]
>     #Change this if you need to set a different protocol for datasink
>     datasinkprotocol = "https"
>
>     #Set usecfdatasink to NO if you dont want to use CF Worker as a Datasink.  
>     #HexaEight Serverless is tested and works with api.cl1p.net  and could be an alternative which provides cost effective datasink.  
>     usecfdatasink = "YES"
>
>     #Change the domain below to match with the subdomain, if the route is \*, then designate any subdomain of your choice but DO NOT change /login/sink.
>     datasink = "login.yourdomain.xxx/login/sink"
>
>     #Prefix a dot to allow a cookie to be set for all you subdomains or change the domain to suit only your subdomain.
>     cookiedomain = ".yourdomain.xxx"
>
>     #Change emaildomainfilter to NO if you want to allow authentication from any email address
>     emaildomainsfilter = "YES"
>      
>     #If the email domain filter is set to YES enter a comma seperated list of domains with the single quotes as shown below
>     emaildomainslist = "'gmail.com','facebook.com','yahoo.com'"
>
>     #Change your domain below and set the server name to match this setting to the same subdomain setting in datasink.
>     servername = "login.yourdomain.xxx"
>
>     #Do not change the below two settings
>     path = "/"
>     redirecturl = "/loginsuccess"
>
>     #Input the Client code (Client ID) generated above
>     clientappcode = "put your client ID here"
>     #This is a small lock image displayed at the bottom of the page which you can customize if you want to put your own logo.
>     bottomlogo = "https://cdn1.iconfinder.com/data/icons/hawcons/32/698845-icon-118-lock-rounded-128.png"
>
>     #By enabling auditing every login success, blocked logins, cookie extension success and failure messages are captured in the AUDITLogs KV
>     #Logs are retained for a week after which the logs expire automatically. Change it to DISABLED if you want to disable auditing.
>     auditing = "ENABLED"
>

Save the file.

##### 5. That is it!! Publish your worker

>     wrangler publish
