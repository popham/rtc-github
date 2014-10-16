define(['domReady', './StateMachine', './Service', './Client', './Signal'], function (
         domReady,     StateMachine,     Service,     Client,     Signal) {

    domReady(function () {
        // Authentication IFrame
        var auth = document.getElementById('auth');

        // Control
        var currentHost = document.getElementById('currentHost');
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
            var host = hosts.item(hosts.selectedIndex);
            return {
                id : host.value,
                name : host.text
            };
        };

        var selectHost = function (choice) {
            if (choice) {
                currentHost.innerHTML = choice.getName().asString();
            } else {
                currentHost.innerHTML = selectedHost().name;
            }
            currentHost.hidden = false;
            hosts.hidden = true;
        };

        var unselectHost = function () {
            currentHost.innerHTML = "";
            currentHost.hidden = true;
            hosts.hidden = false;
        };

        var printMessage = function (name, message) {
            var p = document.createElement('p');
            p.innerHTML = '<p><span class="name">'+name+'</span><span class="message">'+message+'</span></p>';
            history.insertBefore(p, history.firstChild);
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
                    printMessage('Me', m);
                }
                message.value = '';

                return false;
            };
        };

        var onMessage = function (message) {
            message.getMessages().forEach(function (message) {
                printMessage(
                    message.getSource().getName().asString(),
                    message.getValue().asString().trim()
                );
            });

            return false;
        };

        var onHostsUpdate = function (users) {
            var options = '';
            users.forEach(function (user) {
                options += '<option value="'+user.getId()+'">';
                options += user.getName().asString();
                options += '</option>';
            });

            hosts.innerHTML = options;
        };

        var uiReset = function () {
            unselectHost();
            hosts.disabled = true;
            offer.disabled = true;
            accept.disabled = true;
            quit.disabled = true;
            message.disabled = true;
            message.value = "";
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
        var priorHost = null;

        var logOut = [function (done) {
            if (signal) {
                signal.hostsUpdated.removeAll();
                signal.kill();
            }
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
                            selectHost(service.getOwner());
                            done()
                        });
                    }, 'host'],
                    accept : [function (done) {
                        var hostId = selectedHost().id;
                        client = new Client(hostId, signal);
                        client.messaged.add(onMessage);
                        send.onclick = onSend(client);
                        clear.onclick = onClear;
                        if (priorHost !== hostId) history.innerHTML = "";
                        uiGuest();
                        selectHost();
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
                        history.innerHTML = "";
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
                        priorHost = selectedHost().id;
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
        quit.onclick = function () { state.trigger('quit'); };
    });
});
