define(['./Service', './StateMachine', './client', './server'], function (
           Service,     StateMachine,     client,     server) {

    // Mode
    var hosts = document.getElementById('hosts');
    var offer = document.getElementById('offer');
    var accept = document.getElementById('accept');

    // Messages
    var history = document.getElementById('history');
    var message = document.getElementById('message');
    var send = document.getElementById('send');
    var clear = document.getElementById('clear');

    var service = new Service()
    var state = new StateMachine(
        'free',
        {
            free : {
                host : [function () {
                    // Spawn dedicated worker to handle messages.
                    
                }, 'host'],
                join : [function () {}, 'guest']
            },
            host : {
                quit : [function () {}, 'free'],
                send : [function () {}]
            },
            guest : {
                quit : [function () {}, 'free'],
                send : [function () {}]
            }
        }
    );

    send.addEventListener(
        'click',
        function(event) {
            var m = message.value.trim();
            if (m !== '') {
                var p = document.createElement('p');
                p.innerHTML = m;
                history.appendChild(p);
            }

            return false;
        },
        false
    );

    clear.addEventListener(
        'click',
        function(event) {
            if (message.value !== '') {
                message.value = '';
            }

            return false;
        },
        false
    );
});
