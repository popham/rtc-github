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
            if (host) {
                return {
                    id : host.value,
                    name : host.text
                };
            } else {
                return null;
            }
        };

        var selectHost = function (choice) {
            if (choice) {
                currentHost.innerHTML = choice.getName().toString();
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
            printMessage(
                message.getSource().getName().toString(),
                message.getValue().toString().trim()
            );

            return false;
        };

        var onHostsUpdate = function (users) {
            var options = '';
            users.forEach(function (user) {
                options += '<option value="'+user.getId()+'">';
                options += user.getName().toString();
                options += '</option>';
            });

            hosts.innerHTML = options;
        };

        /*
         * Create a client specific handler for hosts updates.  Quit with the
         * host.
         */
        var quitWithHost = function (host) {
            return function (users) {
                var ids = {};
                users.forEach(function (user) {
                    ids[user.getId()] = null;
                });

                if (ids[host.id] !== null) state.trigger('quit');
            };
        };

        var uiReset = function () {
            unselectHost();
            hosts.disabled = true;
            offer.disabled = true;
            accept.disabled = true;
            quit.disabled = true;
            history.innerHTML = "";
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
        var onClientHostsUpdate = null;

        var logOut = [function (done) {
            if (signal) {
                signal.hostsUpdated.remove(onHostsUpdate);
                signal.kill();
            }
            signal.hostsUpdated.remove(onClientHostsUpdate);
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
                                // Clean up and abort transition.
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
                            done();
                        }, done); // Technically, the error of a failed promise
                                  // could be falsy, causing a bug here.
                    }, 'host'],
                    accept : [function (done) {
                        var host = selectedHost();
                        if (host) {
                            client = new Client(host.id, signal);
                            client.messaged.add(onMessage);
                            onClientHostsUpdate = quitWithHost(host);
                            signal.hostsUpdated.add(onClientHostsUpdate);
                            send.onclick = onSend(client);
                            clear.onclick = onClear;
                            uiGuest();
                            selectHost();
                            done();
                        } else {
                            done('Cannot join a nonhost');
                        }
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
                        signal.hostsUpdated.remove(onClientHostsUpdate);
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
        quit.onclick = function () { state.trigger('quit'); };
    });
});
