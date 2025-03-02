    Technologies + How To Run:

        Frontend of project developed in React / using VisualStudioCode.

        For running, you will need to use the following commands:
            - npm install (to install the node_modules based on package.json)
            - fnm env --use-on-cd | Out-String | Invoke-Expression; fnm use --install-if-missing 16
                (to use the npm version 16 in order for the encryption to work - does not matter what node version
                is currently installed)
            - npm run start (to run the project)


    Main purpose of project:

        BTCodeCrafters OTP Challenge is an app where you generate an OTP and use it for logging into an account.


    How it works:

        You generate an OTP, that will remain active for the time shown. Default time is 30 seconds.
    If you want to change this value, you increment it by the + or - buttons. The 30-100 range can change anytime, it is just an example.
    After you login with that OTP, the OTP will no longer work. Also, if the allocated time runs out,
    the OTP will reset (both visually and in the backend). So the only way to use the OTP is to generate it,
    use it to login before the time runs out, and then logout if you want to generate a new OTP for another login.

        If you reload the page at any time, the timer will reset. Also, you cannot login without generating an OTP
    and you cannot generate another OTP until the current one expires.

        The project has a single page. After you login using the OTP, you will be redirected to a "dummy" page.
    In a real scenario, you would be redirected to your user home page or any other important page.
