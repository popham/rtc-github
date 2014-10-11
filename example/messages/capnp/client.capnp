@0xcbcf14c1e72dfa85;

using import "/rtc-github-protocol/user.capnp".User;

struct Client {
    source :union {
        unset @0 :Void;
        user @1 :User;
    }
    message @2 :Text;
}
