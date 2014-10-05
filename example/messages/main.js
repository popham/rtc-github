define(['./Signal', './client', './server'], function (
           Signal,     client,     server) {

    var hosts = document.getElementById('hosts');
    var membership = document.getElementById('membership');

    var history = document.getElementById('history');

    var message = document.getElementById('message');
    var send = document.getElementById('send');
    var clear = document.getElementById('clear');

    var signal = new Signal();

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
