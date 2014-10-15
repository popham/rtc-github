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

        var onClear = function (event) {
            if (message.value !== '') {
                message.value = '';
            }

            return false;
        };

        var onSend = function (client) {
            return function (event) {
                var m = message.value.trim();
                if (m !== '') {
                    client.send(m);
                    var p = document.createElement('p');
                    p.innerHTML = m;
                    history.insertBefore(p, history.firstChild);
                }

                return false;
            };
        };

        var onMessage = function (message) {
            message.getMessages().forEach(function (message) {
                var name = message.getSource().getName().asString();
                var m = message.getValue().asString().trim();
                if (m !== '') {
                    var p = document.createElement('p');
                    p.innerHTML = '<p><span>'+name+'</span><br>'+m+'</p>';
                    history.appendChild(p);
                }
            });

            return false;
        };

        var onHostsUpdate = function (users) {
            var options = '';
            users.forEach(function (user) {
                options += '<option value="'+user.getUid()+'">';
                options += user.getName().asString();
                options += '</option>';
            });
        };

        var uiReset = function () {
            hosts.disabled = true;
            offer.disabled = true;
            accept.disabled = true;
            quit.disabled = true;
            message.disabled = true;
            message.innerHTML = "";
            send.disabled = true;
            clear.disabled = true;
        };
        var uiAnonymous = function () {
            uiReset();
        };
        var uiAuthenticated = function () {
            uiReset();
            hosts.disabled = false;
            offer.disabled = false;
            accept.disabled = false;
        };
        var uiHost = function () {
            uiReset();
            quit.disabled = false;
            message.disabled = false;
            send.disabled = false;
            clear.disabled = false;
        };
        var uiGuest = function () {
            uiReset();
            quit.disabled = false;
            message.disabled = false;
            send.disabled = false;
            clear.disabled = false;
        };

        var signal = null;
        var client = null;
        var service = null;

        var logOut = [function (done) {
            if (signal) signal.kill();
            signal = null;
            uiAnonymous();
            done();
        }, 'anonymous'];

        var state = new StateMachine(
            'anonymous',
            {
                anonymous : {
                    logIn : [function (done) {
                        signal = new Signal();
                        signal.hostsUpdated.add(onHostsUpdate);
                        onHostsUpdate(signal.hosts);
                        signal.connecting.done(
                            function () { uiAuthenticated(); done(); },
                            function (e) {
                                signal.kill();
                                onHostsUpdate(Signal.EMPTY_HOSTS);
                                done(e);
                            }
                        );
                    }, 'authenticated'],
                    logOut : [function (done) { done(); }]
                },
                authenticated : {
                    logOut : logOut,
                    offer : [function (done) {
                        signal.connecting.done(function (session) {
                            service = new Service(signal, session);
                            var local = service.createLocalClient();
                            local.messaged.add(onMessage);
                            send.onclick = onSend(local);
                            clear.onclick = onClear;
                            uiHost();
                            done()
                        });
                    }, 'host'],
                    accept : [function (done) {
                        client = new Client(selectedHost(), signal);
                        client.messaged.add(onMessage);
                        send.onclick = onSend(client);
                        clear.onclick = onClear;
                        uiGuest();
                        done()
                    }, 'guest']
                },
                host : {
                    logOut : logOut,
                    quit : [function (done) {
                        if (service) service.kill();
                        service = null;
                        send.onclick = null;
                        clear.onclick = null;
                        uiAuthenticated();
                        done();
                    }, 'authenticated']
                },
                guest : {
                    logOut : logOut,
                    quit : [function (done) {
                        if (client) client.kill();
                        client = null;
                        send.onclick = null;
                        clear.onclick = null;
                        uiAuthenticated();
                        done();
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
