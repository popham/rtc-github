define(['domReady', './StateMachine', './Service', './Client', './Signal'], function (
         domReady,     StateMachine,     Service,     Client,     Signal) {

    domReady(function () {
        // Authentication IFrame
        var auth = document.getElementById('auth');

        // Control
        var hosts = document.getElementById('hosts');
        var offer = document.getElementById('offer');
        var accept = document.getElementById('accept');
        var quit = document.getElementById('quit');

        // Messages
        var history = document.getElementById('history');
        var message = document.getElementById('message');
        var send = document.getElementById('send');
        var clear = document.getElementById('clear');

        var selectedHost = function () {
            var i = hosts.selectedIndex;
            return hosts.item(i).value;
        };

        var onSend = function (client) {
            return function (event) {
                var m = message.value.trim();
                if (m !== '') {
                    client.send(m);
                    var p = document.createElement('p');
                    p.innerHTML = m;
                    history.appendChild(p);
                }

                return false;
            };
        };

        var onClear = function (event) {
            if (message.value !== '') {
                message.value = '';
            }

            return false;
        };

        var onMessage = function (message) {
            var name = message.getSource().getName().asString();
            var m = message.getValue().asString().trim();
            if (m !== '') {
                var p = document.createElement('p');
                p.innerHTML = '<p><span>'+name+'</span><br>'+m+'</p>';
                history.appendChild(p);
            }

            return false;
        };

        var uiReset = function () {
            hosts.disabled = false;
            offer.disabled = false;
            accept.disabled = false;
            quit.disabled = false;
            history.disabled = false;
            message.disabled = false;
            send.disabled = false;
            clear.disabled = false;
        };
        var uiAnonymous = function () {
            uiReset();
            hosts.disabled = true;
            offer.disabled = true;
            accept.disabled = true;
            quit.disabled = true;
            send.disabled = true;
            clear.disabled = true;

            history.innerHTML = "";
            message.disabled = true;
            message.value = "";
        };
        var uiAuthenticated = function () {
            uiReset();
            quit.disabled = true;
            send.disabled = true;
            clear.disabled = true;

            history.innerHTML = "";
            message.disabled = true;
            message.value = "";
        };
        var uiHost = function () {
            uiReset();
            hosts.disabled = true;
            offer.disabled = true;
            accept.disabled = true;
        };
        var uiGuest = function () {
            uiReset();
            offer.disabled = true;
            accept.disabled = true;
        };

        var signal = null;
        var client = null;
        var service = null;

        var logOut = [function () {
            signal.kill();
            signal = null;
            uiAnonymous();
        }, 'anonymous'];

        uiAnonymous();
        var state = new StateMachine(
            'anonymous',
            {
                anonymous : {
                    logIn : [function () {
                        signal = new Signal();
                        signal.hostsUpdated.add(function (users) {
                            var options = '';
                            users.forEach(function (user) {
                                options += '<option value="'+user.getUid()+'">';
                                options += user.getName().asString();
                                options += '</option>';
                            });
                            hosts.innerHTML = options;
                        });
                        uiAuthenticated();
                    }, 'authenticated'],
                    logOut : [function () {}]
                },
                authenticated : {
                    logOut : logOut,
                    offer : [function () {
                        service = new Service(signal);
                        var local = service.createLocalClient();
                        local.messaged.add(onMessage);
                        send.onclick = onSend(local);
                        clear.onclick = onClear;
                        uiHost();
                    }, 'host'],
                    accept : [function () {
                        client = new Client(selectedHost(), signal);
                        client.messaged.add(onMessage);
                        send.onclick = onSend(client);
                        clear.onclick = onClear;
                        uiGuest();
                    }, 'guest']
                },
                host : {
                    logOut : logOut,
                    quit : [function () {
                        service.kill();
                        service = null;
                        send.onclick = null;
                        clear.onclick = null;
                        uiAuthenticated();
                    }, 'authenticated']
                },
                guest : {
                    logOut : logOut,
                    quit : [function () {
                        client.kill();
                        client = null;
                        send.onclick = null;
                        clear.onclick = null;
                        uiAuthenticated();
                    }, 'authenticated']
                }
            }
        );

        window.onmessage = function (e) {
            switch (e.data.status) {
            case 'logged in': state.trigger('logIn'); break;
            case 'logged out': state.trigger('logOut'); break;
            default: throw new Error('Unrecognized hash value');
            }
        };
        auth.contentWindow.postMessage("I'm ready", "*");

        offer.onclick = function () { state.trigger('offer'); };
        accept.onclick = function () { state.trigger('accept'); };
        quit.onclick = function () { state.trigger('logOut'); };
    });
});
