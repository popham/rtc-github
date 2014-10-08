define(['./StateMachine', './Service', './Client', './Signal'], function (
           StateMachine,     Service,     Client,     Signal) {

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
    var uiFree = function () {
        uiReset();
        quit.disabled = true;
        message.disabled = true;
        send.disabled = true;
        clear.disabled = true;
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
        hosts.disabled = true;
        offer.disabled = true;
        accept.disabled = true;
    };

    var signal = new Signal();
    signal.hostsUpdated.add(function (users) {
        var options = '';
        users.forEach(function (user) {
            options += '<option value="'+user.getUid()+'">';
            options += user.getName().asString();
            options += '</option>';
        });
        hosts.innerHTML = options;
    });

    var client = null;
    var service = null;
    var state = new StateMachine(
        'free',
        {
            free : {
                host : [function () {
                    uiHost();
                    service = new Service(signal);
                    var local = service.createLocalClient();
                    local.messaged.add(onMessage);
                    send.onclick = onSend(local);
                    clear.onclick = onClear;
                }, 'host'],
                join : [function () {
                    uiGuest();
                    client = new Client(selectedHost(), signal);
                    client.messaged.add(onMessage);
                    send.onclick = onSend(client);
                    clear.onclick = onClear;
                }, 'guest']
            },
            host : {
                quit : [function () {
                    uiFree();
                    service.kill();
                    service = null;
                    send.onclick = null;
                    clear.onclick = null;
                }, 'free']
            },
            guest : {
                quit : [function () {
                    uiFree();
                    client.kill();
                    client = null;
                    send.onclick = null;
                    clear.onclick = null;
                }, 'free']
            }
        }
    );

    offer.onclick = function () { state.trigger('host'); };
    accept.onclick = function () { state.trigger('guest'); };
    quit.onclick = function () { state.trigger('free'); };
});
