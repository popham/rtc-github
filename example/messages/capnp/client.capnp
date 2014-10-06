@0xcbcf14c1e72dfa85;

using import "/user.capnp".Uid;

struct Client {
    source :union {
        unset @0 :Void;
        userId @1 :Uid;
    }
    message @2 :Text;
}
